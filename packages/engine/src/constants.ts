export const SPECIES = [
  "duck", "goose", "blob", "cat", "dragon", "octopus", "owl", "penguin",
  "turtle", "snail", "ghost", "axolotl", "capybara", "cactus", "robot",
  "rabbit", "mushroom", "chonk",
] as const;

export const RARITIES = ["common", "uncommon", "rare", "epic", "legendary"] as const;
export const RARITY_WEIGHTS = [60, 25, 10, 4, 1] as const;
export const EYES = ["\u00B7", "\u2726", "\u00D7", "\u25C9", "@", "\u00B0"] as const;
export const HATS = ["none", "crown", "tophat", "propeller", "halo", "wizard", "beanie", "tinyduck"] as const;
export const STAT_FLOORS: Record<Rarity, number> = { common: 5, uncommon: 15, rare: 25, epic: 35, legendary: 50 };
export const STAT_NAMES = ["debugging", "patience", "chaos", "wisdom", "snark"] as const;
export const SALT = "friend-2026-401";

export type Species = (typeof SPECIES)[number];
export type Rarity = (typeof RARITIES)[number];
export type Eye = (typeof EYES)[number];
export type Hat = (typeof HATS)[number];
export type StatName = (typeof STAT_NAMES)[number];
