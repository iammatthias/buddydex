#!/usr/bin/env bun

import { SPECIES, RARITIES } from "@buddy/engine/constants";

import cmdHunt from "./commands/hunt.ts";
import cmdInject from "./commands/inject.ts";
import cmdRestore from "./commands/restore.ts";
import cmdShow from "./commands/show.ts";
import cmdRoll from "./commands/roll.ts";
import cmdName from "./commands/name.ts";

const USAGE = `
  BuddyDex CLI

  Commands:
    hunt      Search for buddies matching filters
    inject    Inject a seed UUID into ~/.claude.json
    restore   Restore your original UUID from backup
    show      Show your current buddy
    roll      Roll a specific UUID to see its buddy
    name      View or set your buddy's name and personality

  Hunt options:
    --species <name>       Filter by species
    --rarity <level>       Filter by rarity (${RARITIES.join(", ")})
    --shiny                Only shiny buddies
    --min-stat <name:val>  Min value for a stat (e.g. chaos:80)
    --min-total <val>      Min total stat points (e.g. 400)
    --perfect <val>        ALL stats >= this value (e.g. 70)
    --tries <n>            UUIDs to try (default: 1000000)
    --limit <n>            Max results (default: 10)

  Inject options:
    --preview              Preview without saving

  Name options:
    --name <name>          Set buddy name
    --personality <text>   Set buddy personality

  Examples:
    buddydex hunt --species dragon --rarity legendary
    buddydex hunt --rarity legendary --perfect 70
    buddydex inject <seed>
    buddydex show
    buddydex name
    buddydex name --name "Ember" --personality "Chaotic but loyal"
`;

import pkg from "./package.json";

const [command, ...rest] = process.argv.slice(2);

if (command === "--version" || command === "-v" || command === "version") {
  console.log(pkg.version);
  process.exit(0);
}

const commands: Record<string, (argv: string[]) => void> = {
  hunt: cmdHunt,
  inject: cmdInject,
  restore: cmdRestore,
  show: cmdShow,
  roll: cmdRoll,
  name: cmdName,
};

if (command && command in commands) {
  commands[command](rest);
} else {
  console.log(USAGE);
  if (command && command !== "--help" && command !== "-h") {
    console.error(`  Unknown command: ${command}\n`);
    process.exit(1);
  }
}
