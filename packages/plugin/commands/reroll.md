---
description: Reroll your Claude Code buddy - brute-force the hash to find a new species, rarity, and stats
argument-hint: [species] [--rarity legendary] [--shiny] [--inject]
allowed-tools: [Bash, Read, Write]
---

# Buddy Reroller

The user wants to reroll their Claude Code buddy. This command brute-forces the deterministic Wyhash pipeline to find spoofed account UUIDs that produce desirable buddy rolls, then optionally injects the chosen seed.

## Arguments

The user provided: $ARGUMENTS

## How It Works

Claude Code buddies have two parts:
- **Bones** (species, rarity, stats, eye, hat, shiny) — deterministically derived from `Wyhash(accountUuid + "friend-2026-401")` via Mulberry32 PRNG. Re-derived every launch.
- **Soul** (name, personality) — AI-generated on first hatch, stored locally.

The binary reads the user ID as: `oauthAccount?.accountUuid ?? userID ?? "anon"`.

To change bones, we spoof `oauthAccount.accountUuid` in `~/.claude.json`.

## Instructions

### Step 1: Run the brute-forcer

```bash
bun ${CLAUDE_PLUGIN_ROOT}/../cli/bin.ts hunt [flags]
```

Available flags:
- `--species <name>` — filter by species (duck, goose, blob, cat, dragon, octopus, owl, penguin, turtle, snail, ghost, axolotl, capybara, cactus, robot, rabbit, mushroom, chonk)
- `--rarity <level>` — filter by rarity (common, uncommon, rare, epic, legendary)
- `--shiny` — only show shiny variants (1% chance)
- `--min-stat <name>:<value>` — e.g. `--min-stat chaos:90`
- `--min-total <value>` — minimum total stat points
- `--perfect <value>` — ALL stats must be >= this value
- `--tries <n>` — number of random IDs to try (default: 1,000,000)
- `--limit <n>` — max results to show (default: 10)

### Step 2: Present results to the user

Show the results in a table format so the user can pick their favorite.

### Step 3: Inject (if requested)

```bash
bun ${CLAUDE_PLUGIN_ROOT}/../cli/bin.ts inject <seed>
```

Tell the user to restart Claude Code to meet their new buddy.

### Restore

```bash
bun ${CLAUDE_PLUGIN_ROOT}/../cli/bin.ts restore
```
