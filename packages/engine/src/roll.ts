import { hashString } from "./hash.ts";
import { Mulberry32 } from "./prng.ts";
import {
  SPECIES, RARITIES, RARITY_WEIGHTS, EYES, HATS,
  STAT_FLOORS, STAT_NAMES, SALT,
  type Rarity, type Species, type Eye, type Hat, type StatName,
} from "./constants.ts";

export type BuddyStats = Record<StatName, number>;

export interface BuddyBones {
  rarity: Rarity;
  species: Species;
  eye: Eye;
  hat: Hat;
  shiny: boolean;
  stats: BuddyStats;
  totalStats: number;
}

export function rollBones(userId: string): BuddyBones {
  const seed = hashString(userId + SALT);
  const rng = new Mulberry32(seed);

  let roll = rng.nextF64() * 100;
  let rarity: Rarity = "common";
  for (let i = 0; i < RARITY_WEIGHTS.length; i++) {
    roll -= RARITY_WEIGHTS[i];
    if (roll < 0) { rarity = RARITIES[i]; break; }
  }

  const species = SPECIES[Math.floor(rng.nextF64() * SPECIES.length) % SPECIES.length];
  const eye = EYES[Math.floor(rng.nextF64() * EYES.length) % EYES.length];
  const hat: Hat = rarity === "common"
    ? "none"
    : HATS[Math.floor(rng.nextF64() * HATS.length) % HATS.length];
  const shiny = rng.nextF64() < 0.01;

  const floor = STAT_FLOORS[rarity];
  const peakIdx = Math.floor(rng.nextF64() * 5) % 5;
  let dumpIdx = Math.floor(rng.nextF64() * 5) % 5;
  if (dumpIdx === peakIdx) dumpIdx = (dumpIdx + 1) % 5;

  const stats = {} as BuddyStats;
  for (let i = 0; i < 5; i++) {
    const name = STAT_NAMES[i];
    if (i === peakIdx) {
      stats[name] = Math.min(100, Math.floor(floor + 50 + rng.nextF64() * 30));
    } else if (i === dumpIdx) {
      stats[name] = Math.max(1, Math.floor(floor - 10 + rng.nextF64() * 15));
    } else {
      stats[name] = Math.floor(floor + rng.nextF64() * 40);
    }
  }

  const totalStats = Object.values(stats).reduce((a, b) => a + b, 0);
  return { rarity, species, eye, hat, shiny, stats, totalStats };
}
