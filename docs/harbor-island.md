# Harbor Island implementation status

The homepage mounts a static, lightweight launcher before the existing HomeStage. The Phaser scene and procedural audio load only after Start. `/play` uses the same launcher and accepts a bounded numeric challenge seed. Existing homepage sections are preserved.

## Working local game

- Captain/island names, flag, companion and validated versioned local save.
- Original vector island, fortress, farms, pier, approaching fleets, pointer and keyboard aiming, projectile collision, health and win/loss.
- Resource-funded timed cannon/fortress construction. Earned gems can accelerate work or upgrade a visible weapon.
- Stage-dependent procedural music, sound effects, saved separate toggles, reduced motion and hidden-tab pause.
- Daily supplies, companion rank, missions, same-seed challenge links and downloadable original PNG achievement cards.
- No cash checkout, payments, cash prizes, user-to-user raids, support ships or real global leaderboard are represented as working.

## Delivery and dependency

`public/harbor/` is isolated from the application bundle. Phaser 3.90.0 is loaded with a SHA-384 integrity check from jsDelivr only inside the game frame. CDN failure displays an explicit retry action. The site needs permission for that script origin in any future CSP applied to this document; do not relax the entire site's CSP. Consider moving the pinned engine file into the same-origin asset pipeline before a larger production rollout.

Run `node scripts/check-harbor.mjs` to check save input, timer/resource transactions, reward rules and challenge seeds. Test browser startup, battle, save reload, keyboard, reduced motion, narrow layout, mute, backgrounding and download before declaring full acceptance.

## Remaining server implementation

LocalStorage is **not authoritative** for gems, purchases or competitive scoring. Before enabling those systems, add anonymous authenticated identities, server-owned resources, an append-only transaction ledger, idempotent actions, rate limits and RLS. Validate battle outcomes on the server; do not accept client-reported rewards. Keep paid balances distinct from this local prototype.

For friend raids, support links and streamer queues, use signed server-issued targets, action expiry, replay protection, bounded queues and server-side reward evaluation. Global/country rankings must read actual verified results. Push notifications require a real subscription and player opt-in. The payment provider, merchant account and webhook credentials are not configured in this implementation. Never fulfill gems from a browser redirect or local purchase button.

This is a playable local release of the requested game, not the completed multiplayer and payment platform. No traffic, concurrency or latency guarantee has been established.
