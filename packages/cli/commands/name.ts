import { parseArgs } from "util";
import { CONFIG_PATH, readJson, writeConfig } from "../lib/config.ts";
import { printHeader } from "../lib/format.ts";

export default function cmdName(argv: string[]): void {
  const { values: args } = parseArgs({
    args: argv,
    options: {
      name: { type: "string" },
      personality: { type: "string" },
    },
  });

  const config = readJson(CONFIG_PATH);
  if (!config) {
    console.error(`\n  Cannot read ${CONFIG_PATH}\n`);
    process.exit(1);
  }

  printHeader();

  const companion = (config.companion ?? {}) as Record<string, unknown>;

  // No flags — show current
  if (!args.name && !args.personality) {
    if (!config.companion) {
      console.log(`\n  No companion data found. Launch Claude Code to hatch your buddy first.\n`);
    } else {
      console.log(`\n  Name:        ${companion.name || "(none)"}`);
      console.log(`  Personality: ${companion.personality || "(none)"}\n`);
    }
    return;
  }

  if (args.name) companion.name = args.name;
  if (args.personality) companion.personality = args.personality;

  config.companion = companion;
  writeConfig(config);

  console.log(`\n  Updated companion:`);
  console.log(`  Name:        ${companion.name || "(none)"}`);
  console.log(`  Personality: ${companion.personality || "(none)"}`);
  console.log(`\n  Restart Claude Code to see the changes.\n`);
}
