import type { BuddyBones, Species, Rarity } from "@buddy/engine";

export type SearchResult = BuddyBones & { seed: string };

export interface FilterState {
  species: Species | "";
  rarity: Rarity | "";
  shiny: boolean;
  minTotal: number;
  perfect: number;
  tries: number;
}

export interface HuntFilters {
  species: Species | null;
  rarity: Rarity | null;
  shiny: boolean;
  minTotal: number | null;
  perfect: number | null;
  tries: number;
  limit: number;
}

export type WorkerInbound =
  | { type: "hunt"; filters: HuntFilters }
  | { type: "cancel" };

export type WorkerOutbound =
  | { type: "progress"; tried: number; found: number }
  | { type: "done"; results: SearchResult[]; tried: number }
  | { type: "cancelled" };
