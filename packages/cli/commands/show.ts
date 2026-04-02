import { rollBones } from "@buddy/engine";
import { getRealUserId, getEffectiveUserId } from "../lib/config.ts";
import { printHeader, printBuddy } from "../lib/format.ts";

export default function cmdShow(): void {
  printHeader();

  const realId = getRealUserId();
  const effectiveId = getEffectiveUserId();

  const realBones = rollBones(realId);
  printBuddy("Your buddy:", realBones, realId);

  if (effectiveId !== realId) {
    const currentBones = rollBones(effectiveId);
    printBuddy("Currently active (spoofed):", currentBones, effectiveId);
  }

  console.log();
}
