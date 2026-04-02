import { STAT_NAMES } from "@buddy/engine/constants";
import type { BuddyBones } from "@buddy/engine";

const isBun: boolean = typeof Bun !== "undefined";

export function printHeader(hashMode?: string): void {
  const effectiveHash =
    hashMode === "fnv1a"
      ? "FNV-1a (forced)"
      : isBun
        ? "Bun.hash (Wyhash)"
        : "Wyhash (WASM)";

  console.log(`\n  BuddyDex`);
  console.log(`  Runtime: ${isBun ? "Bun" : "Node.js"}  Hash: ${effectiveHash}`);
}

export function printBuddy(label: string, bones: BuddyBones, userId?: string): void {
  const shinyTag = bones.shiny ? " SHINY" : "";
  const statBar = STAT_NAMES.map(
    (s) => `${s.slice(0, 3).toUpperCase()}:${bones.stats[s]}`,
  ).join(" ");

  console.log(`\n  ${label}`);
  if (userId) {
    const display = userId.length > 24 ? userId.slice(0, 12) + "..." : userId;
    console.log(`  ID:     ${display}`);
  }
  console.log(`  Result: ${bones.rarity.toUpperCase()} ${bones.species}${shinyTag}`);
  console.log(`  Eye: ${bones.eye}  Hat: ${bones.hat}  Total: ${bones.totalStats}`);
  console.log(`  Stats:  ${statBar}`);
}
