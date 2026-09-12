-- Fleet Commander player persistence: base level, resources, and fleet
-- state, one row per authenticated player (auth.uid()).
--
-- Anti-cheat design: resources, building levels, and upgrade timers are
-- NEVER directly UPDATE-able from the client, even though RLS would
-- otherwise scope such an update to the player's own row. RLS only
-- controls *which rows* a policy applies to, not whether a submitted
-- value is honest — a player could otherwise open devtools and PATCH
-- their own row with steel = 999999999. Column-level GRANTs restrict
-- direct client writes to cosmetic fields only (display_name); every
-- state change that matters (starting/collecting an upgrade, building a
-- ship) goes through a SECURITY DEFINER function below that validates
-- cost, cooldown and ownership atomically, then applies the change with
-- the function owner's elevated privilege.

create table public.fleet_commander_players (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,

  command_center_level smallint not null default 1 check (command_center_level >= 1),
  shipyard_level smallint not null default 1 check (shipyard_level >= 1),
  missile_silo_level smallint not null default 1 check (missile_silo_level >= 1),
  refinery_level smallint not null default 1 check (refinery_level >= 1),

  command_center_upgrade_ready_at timestamptz,
  shipyard_upgrade_ready_at timestamptz,
  missile_silo_upgrade_ready_at timestamptz,
  refinery_upgrade_ready_at timestamptz,

  steel integer not null default 500 check (steel >= 0),
  fuel integer not null default 500 check (fuel >= 0),
  credits integer not null default 100 check (credits >= 0),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger fleet_commander_players_set_updated_at
  before update on public.fleet_commander_players
  for each row execute function public.set_updated_at();

alter table public.fleet_commander_players enable row level security;

create policy fc_players_select_own on public.fleet_commander_players
  for select to authenticated using (auth.uid() = id);

-- Only the display name is directly writable by the client.
grant select, update (display_name) on public.fleet_commander_players to authenticated;
create policy fc_players_update_display_name on public.fleet_commander_players
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- No client-side insert/delete policy: rows are created by
-- fc_ensure_player() below, and deletion is left to auth.users cascade
-- (deleting the auth account removes the player row automatically).

create table public.fleet_commander_ships (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.fleet_commander_players(id) on delete cascade,
  ship_type text not null check (ship_type in ('destroyer', 'corvette', 'carrier')),
  level smallint not null default 1 check (level >= 1),
  name text,
  created_at timestamptz not null default now()
);
create index fleet_commander_ships_player_id_idx on public.fleet_commander_ships(player_id);

alter table public.fleet_commander_ships enable row level security;

create policy fc_ships_select_own on public.fleet_commander_ships
  for select to authenticated using (auth.uid() = player_id);

grant select on public.fleet_commander_ships to authenticated;
-- No insert/update/delete grant: ships are built exclusively through
-- fc_build_ship() below, so a build always costs the right resources.

-- ---------------------------------------------------------------------
-- RPC functions: the only way client code can change game state that
-- matters. Each checks auth.uid() itself rather than trusting a passed
-- player id, so a call can never act on someone else's row.
-- ---------------------------------------------------------------------

-- Creates the caller's player row with starting resources if it doesn't
-- exist yet. Safe to call every time the game loads.
create or replace function public.fc_ensure_player()
returns public.fleet_commander_players
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.fleet_commander_players;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  insert into public.fleet_commander_players (id)
  values (auth.uid())
  on conflict (id) do nothing;

  select * into result from public.fleet_commander_players where id = auth.uid();
  return result;
end;
$$;
revoke all on function public.fc_ensure_player() from public;
grant execute on function public.fc_ensure_player() to authenticated;

-- Starting an upgrade: validates the building name, charges the cost for
-- the *next* level, and sets that building's ready_at timestamp. Costs
-- and durations here are placeholder game-balance numbers, easy to
-- tune later without touching the anti-cheat structure.
create or replace function public.fc_start_upgrade(p_building text)
returns public.fleet_commander_players
language plpgsql
security definer
set search_path = public
as $$
declare
  player public.fleet_commander_players;
  current_level smallint;
  steel_cost integer;
  fuel_cost integer;
  duration interval;
  level_col text;
  ready_col text;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  if p_building not in ('command_center', 'shipyard', 'missile_silo', 'refinery') then
    raise exception 'Unknown building: %', p_building;
  end if;

  select * into player from public.fleet_commander_players where id = auth.uid() for update;
  if not found then
    raise exception 'Player not found — call fc_ensure_player() first';
  end if;

  level_col := p_building || '_level';
  ready_col := p_building || '_upgrade_ready_at';

  execute format('select ($1).%I', level_col) using player into current_level;
  -- Blocks starting a new upgrade until any finished-but-uncollected one
  -- for this building is collected — otherwise a level paid for twice
  -- could be silently lost when the timer is overwritten.
  if (to_jsonb(player) ->> ready_col) is not null then
    raise exception '% has an upgrade in progress or pending collection', p_building;
  end if;

  steel_cost := 100 * current_level;
  fuel_cost := 60 * current_level;
  duration := (30 * current_level || ' seconds')::interval;

  if player.steel < steel_cost or player.fuel < fuel_cost then
    raise exception 'Not enough resources';
  end if;

  execute format(
    'update public.fleet_commander_players
       set steel = steel - $1, fuel = fuel - $2, %I = now() + $3
     where id = $4
     returning *',
    ready_col
  ) using steel_cost, fuel_cost, duration, auth.uid() into player;

  return player;
end;
$$;
revoke all on function public.fc_start_upgrade(text) from public;
grant execute on function public.fc_start_upgrade(text) to authenticated;

-- Collecting a finished upgrade: only succeeds once ready_at has passed,
-- then bumps the level and clears the timer.
create or replace function public.fc_collect_upgrade(p_building text)
returns public.fleet_commander_players
language plpgsql
security definer
set search_path = public
as $$
declare
  player public.fleet_commander_players;
  level_col text;
  ready_col text;
  ready_at timestamptz;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  if p_building not in ('command_center', 'shipyard', 'missile_silo', 'refinery') then
    raise exception 'Unknown building: %', p_building;
  end if;

  select * into player from public.fleet_commander_players where id = auth.uid() for update;
  if not found then
    raise exception 'Player not found';
  end if;

  level_col := p_building || '_level';
  ready_col := p_building || '_upgrade_ready_at';
  ready_at := (to_jsonb(player) ->> ready_col)::timestamptz;

  if ready_at is null then
    raise exception '% is not upgrading', p_building;
  end if;
  if ready_at > now() then
    raise exception '% upgrade not finished yet', p_building;
  end if;

  execute format(
    'update public.fleet_commander_players
       set %I = %I + 1, %I = null
     where id = $1
     returning *',
    level_col, level_col, ready_col
  ) using auth.uid() into player;

  return player;
end;
$$;
revoke all on function public.fc_collect_upgrade(text) from public;
grant execute on function public.fc_collect_upgrade(text) to authenticated;

-- Building a ship: requires a shipyard level high enough for the ship
-- type, charges resources, and inserts the new ship in one transaction.
create or replace function public.fc_build_ship(p_ship_type text, p_name text default null)
returns public.fleet_commander_ships
language plpgsql
security definer
set search_path = public
as $$
declare
  player public.fleet_commander_players;
  min_shipyard smallint;
  steel_cost integer;
  fuel_cost integer;
  new_ship public.fleet_commander_ships;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  if p_ship_type not in ('destroyer', 'corvette', 'carrier') then
    raise exception 'Unknown ship type: %', p_ship_type;
  end if;

  select * into player from public.fleet_commander_players where id = auth.uid() for update;
  if not found then
    raise exception 'Player not found';
  end if;

  min_shipyard := case p_ship_type
    when 'corvette' then 1
    when 'destroyer' then 3
    when 'carrier' then 6
  end;
  steel_cost := case p_ship_type
    when 'corvette' then 80
    when 'destroyer' then 200
    when 'carrier' then 600
  end;
  fuel_cost := case p_ship_type
    when 'corvette' then 40
    when 'destroyer' then 120
    when 'carrier' then 400
  end;

  if player.shipyard_level < min_shipyard then
    raise exception 'Shipyard level % required for %', min_shipyard, p_ship_type;
  end if;
  if player.steel < steel_cost or player.fuel < fuel_cost then
    raise exception 'Not enough resources';
  end if;

  update public.fleet_commander_players
    set steel = steel - steel_cost, fuel = fuel - fuel_cost
    where id = auth.uid();

  insert into public.fleet_commander_ships (player_id, ship_type, name)
  values (auth.uid(), p_ship_type, p_name)
  returning * into new_ship;

  return new_ship;
end;
$$;
revoke all on function public.fc_build_ship(text, text) from public;
grant execute on function public.fc_build_ship(text, text) to authenticated;
