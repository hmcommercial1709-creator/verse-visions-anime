// Server-side Supabase client.
//
// It holds the PUBLISHABLE key and is therefore subject to RLS exactly like
// the browser client. It does NOT bypass RLS, whatever the old name suggested:
// the constant was called SUPABASE_SERVICE_ROLE_KEY while holding an
// sb_publishable_ value, and the banner above it claimed admin rights, which
// sent a sitemap outage hunting in the wrong place. Reads that fail here fail
// because a policy or column grant is missing, not because a key is wrong.
//
// This is the right arrangement for what the server actually reads — public
// catalog rows — since it keeps a service-role secret out of the Worker
// bundle. Anything genuinely privileged needs a real sb_secret_ key supplied
// as a Worker secret, and a client of its own; do not assume this one can do
// it.
//
// Public read access for game_nexus_matrix is defined in
// supabase/migrations/20260912190000_allow_public_read_game_nexus_matrix.sql.
// That migration grants SELECT on named columns only, so `select *` is denied
// by design — always select the columns you need.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );

    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }

    // New Supabase API keys are opaque strings, not bearer JWTs.
    if (
      isNewSupabaseApiKey(supabaseKey) &&
      headers.get("Authorization") === `Bearer ${supabaseKey}`
    ) {
      headers.delete("Authorization");
    }

    headers.set("apikey", supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

function createSupabaseServerClient() {
  const SUPABASE_URL = "https://saddhtpsomxtazrgeyed.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_rwkvYRSJPJ4-0EvrEBhhlg_CJR8E3M8";

  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    global: {
      fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY),
    },
    auth: {
      storage: undefined,
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

let _supabaseServer: ReturnType<typeof createSupabaseServerClient> | undefined;

// Reads public data from server handlers. Subject to RLS — see the note at the
// top of this file.
// Load inside server handlers: const { supabaseServer } = await import("@/integrations/supabase/client.server");
// Top-level import is safe only in other .server.ts modules - route files and *.functions.ts ship to the client bundle.
export const supabaseServer = new Proxy({} as ReturnType<typeof createSupabaseServerClient>, {
  get(_, prop, receiver) {
    if (!_supabaseServer) _supabaseServer = createSupabaseServerClient();
    return Reflect.get(_supabaseServer, prop, receiver);
  },
});

/**
 * @deprecated Misleading name: this client does not have admin rights and does
 * not bypass RLS. Use `supabaseServer`. Kept so existing imports keep working.
 */
export const supabaseAdmin = supabaseServer;
