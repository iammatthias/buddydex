---
name: buddydex
description: Use when the user wants to reroll, change, swap, or customize their Claude Code buddy/companion. Also use when they mention buddy species, rarity, stats, shiny, or express dissatisfaction with their current buddy.
---

# BuddyDex

Browse, hunt, and inject Claude Code buddies by brute-forcing the deterministic Wyhash pipeline.

## Background

Claude Code buddies are generated deterministically from your account UUID:
1. The binary reads the user ID as: `oauthAccount?.accountUuid ?? userID ?? "anon"`
2. `Wyhash(userId + "friend-2026-401")` produces a 32-bit seed
3. Mulberry32 PRNG rolls species, rarity, eye, hat, shiny, and stats from that seed
4. The binary re-derives these "bones" every launch

To change bones, we spoof the `oauthAccount.accountUuid` field in `~/.claude.json` with a seed that produces the desired roll. Auth is unaffected because it uses OAuth tokens, not the UUID.

## How to Use

### Quick reroll (find + inject)

```bash
# Find candidates
bun ${CLAUDE_PLUGIN_ROOT}/../cli/bin.ts hunt --species dragon --rarity legendary --shiny --tries 50000000

# Inject the chosen seed
bun ${CLAUDE_PLUGIN_ROOT}/../cli/bin.ts inject <seed-value>
```

### Available filters

| Flag | Example | Description |
|------|---------|-------------|
| `--species` | `--species goose` | One of 18 species |
| `--rarity` | `--rarity legendary` | common/uncommon/rare/epic/legendary |
| `--shiny` | `--shiny` | Only shiny variants (1% chance) |
| `--min-stat` | `--min-stat chaos:90` | Minimum stat threshold |
| `--min-total` | `--min-total 400` | Minimum total stat points |
| `--perfect` | `--perfect 70` | ALL stats must be >= this value |
| `--tries` | `--tries 50000000` | Search space size (default 1M) |
| `--limit` | `--limit 20` | Max results to show |

### Species list
duck, goose, blob, cat, dragon, octopus, owl, penguin, turtle, snail, ghost, axolotl, capybara, cactus, robot, rabbit, mushroom, chonk

### Rarity drop rates
| Rarity | Rate | Stat Floor |
|--------|------|------------|
| Common | 60% | 5 |
| Uncommon | 25% | 15 |
| Rare | 10% | 25 |
| Epic | 4% | 35 |
| Legendary | 1% | 50 |

Shiny is an independent 1% chance on top of rarity.

### Restore original buddy
```bash
bun ${CLAUDE_PLUGIN_ROOT}/../cli/bin.ts restore
```

### Show current buddy info
```bash
bun ${CLAUDE_PLUGIN_ROOT}/../cli/bin.ts show
```

## Safety

- Original accountUuid is always backed up to `~/.claude/buddy-backup.json`
- `restore` reverses the change
- `inject --preview` shows what you'd get without saving
- The spoofed UUID only affects buddy generation — auth uses OAuth tokens

## Technical Details

```
userId = oauthAccount?.accountUuid ?? userID ?? "anon"
salted = userId + "friend-2026-401"
seed   = Wyhash(salted) & 0xFFFFFFFF
rng    = Mulberry32(seed)
bones  = rollFromRng(rng)
```
