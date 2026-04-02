# BuddyDex

Get the buddy you want.

> [!CAUTION]
> Anthropic may patch this, or worse. Use at your own risk.

Claude Code buddies are deterministic — species, rarity, stats, and shiny status all derive from `Wyhash(accountUuid + salt)` and re-roll every launch. BuddyDex brute-forces that pipeline to find UUIDs that produce the buddy you want.

## Install

Requires [Bun](https://bun.sh).

### CLI

Run directly:

```bash
bunx buddydex <command>
```

Or install globally:

```bash
bun add -g buddydex
buddydex <command>
```

### Claude Code plugin

```bash
claude plugin add github:iammatthias/buddy-reroller
```

Adds the `/reroll` slash command inside Claude Code.

### From source

```bash
git clone https://github.com/iammatthias/buddy-reroller.git
cd buddy-reroller
bun install
bun run cli <command>     # run CLI
bun run web               # dev server
bun run web:build         # build web → packages/web/dist/
```

## CLI

### hunt

Search for buddies matching your criteria.

```bash
buddydex hunt --species dragon --rarity legendary
buddydex hunt --rarity legendary --perfect 70
buddydex hunt --min-total 400 --tries 5000000
buddydex hunt --shiny --tries 50000000
```

| Flag | Example | What it does |
|------|---------|--------------|
| `--species` | `--species goose` | Filter by species |
| `--rarity` | `--rarity legendary` | Filter by rarity |
| `--shiny` | | Only shiny (1% chance) |
| `--min-stat` | `--min-stat chaos:90` | Min value for one stat |
| `--min-total` | `--min-total 400` | Min total BST |
| `--perfect` | `--perfect 70` | Every stat >= this |
| `--tries` | `--tries 5000000` | UUIDs to test (default 1M) |
| `--limit` | `--limit 20` | Max results (default 10) |

### inject

Patch `~/.claude.json` with a UUID from hunt results.

```bash
buddydex inject <seed>            # inject
buddydex inject <seed> --preview  # preview without saving
```

### show / restore / roll

```bash
buddydex show       # current buddy
buddydex restore    # restore original from backup
buddydex roll <id>  # preview what a UUID produces
```

## Species

duck, goose, blob, cat, dragon, octopus, owl, penguin, turtle, snail, ghost, axolotl, capybara, cactus, robot, rabbit, mushroom, chonk

## Rarity

| Tier | Rate | Shiny (1%) | Stat floor |
|------|------|------------|------------|
| Common | 60% | 0.6% | 5 |
| Uncommon | 25% | 0.25% | 15 |
| Rare | 10% | 0.1% | 25 |
| Epic | 4% | 0.04% | 35 |
| Legendary | 1% | 0.01% | 50 |

## How it works

```
userId = oauthAccount?.accountUuid ?? userID ?? "anon"
seed   = Wyhash(userId + "friend-2026-401") & 0xFFFFFFFF
rng    = Mulberry32(seed)
bones  = { rarity, species, eye, hat, shiny, stats }
```

The CLI uses native `Bun.hash()` (Wyhash). The web UI uses `@zig-wasm/hash` — the same Zig Wyhash compiled to WASM. Results are identical across both.

## Project structure

Bun workspace monorepo:

```
packages/
  engine/    Shared core — Wyhash, Mulberry32 PRNG, rollBones, constants
  cli/       CLI tool — hunt, inject, restore, show, roll
  web/       Web UI — React + Vite + Web Worker
  plugin/    Claude Code integration — /reroll slash command
```

## Safety

- Original UUID always backed up before injection
- `buddydex restore` reverses everything
- `buddydex inject --preview` to check first
- Auth is unaffected — uses OAuth tokens, not the UUID

## License

MIT
