import { parseArgs } from "util";
import { rollBones } from "@buddy/engine";
import {
  CONFIG_PATH,
  BACKUP_PATH,
  readJson,
  isValidUuid,
  backup,
  writeConfig,
} from "../lib/config.ts";
import { printHeader, printBuddy } from "../lib/format.ts";

export default function cmdInject(argv: string[]): void {
  const { values: args, positionals } = parseArgs({
    args: argv,
    options: { preview: { type: "boolean", default: false } },
    allowPositionals: true,
  });

  const seed = positionals[0];
  if (!seed) {
    console.error(`\n  Usage: buddydex inject <seed> [--preview]\n`);
    process.exit(1);
  }

  const config = readJson(CONFIG_PATH);
  if (!config) {
    console.error(`\n  Cannot read ${CONFIG_PATH}\n`);
    process.exit(1);
  }

  const isOAuth = !!config.oauthAccount?.accountUuid;

  printHeader();
  console.log(`  Auth: ${isOAuth ? "OAuth (accountUuid)" : "Legacy (userID)"}`);

  if (isOAuth && !isValidUuid(seed)) {
    console.error(`\n  ERROR: Seed "${seed}" is not a valid UUID.`);
    console.error(
      `  The binary expects 32 hex chars. Non-UUID values crash on launch.\n`,
    );
    process.exit(1);
  }

  const bones = rollBones(seed);
  printBuddy("New buddy:", bones, seed);

  if (args.preview) {
    console.log(`\n  (preview only)\n`);
    process.exit(0);
  }

  backup(config);

  if (isOAuth) {
    config.oauthAccount!.accountUuid = seed;
    console.log(`\n  Spoofed oauthAccount.accountUuid`);
  } else {
    config.userID = seed;
    console.log(`\n  Spoofed userID`);
  }

  delete config.companion;
  writeConfig(config);

  console.log(`  Companion soul cleared.`);
  console.log(`\n  Restart Claude Code to meet your new buddy!`);
  console.log(`  Run: buddydex restore\n`);
}
