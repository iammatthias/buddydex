import { parseArgs } from "util";
import { rollBones } from "@buddy/engine";
import { printHeader, printBuddy } from "../lib/format.ts";

export default function cmdRoll(argv: string[]): void {
  const { positionals } = parseArgs({
    args: argv,
    options: {},
    allowPositionals: true,
  });

  const userId = positionals[0];
  if (!userId) {
    console.error(`\n  Usage: buddydex roll <uuid>\n`);
    process.exit(1);
  }

  printHeader();
  const bones = rollBones(userId);
  printBuddy("Roll result:", bones, userId);
  console.log();
}
