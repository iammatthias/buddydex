import { initHash, rollBones, generateUuid, STAT_NAMES } from "@buddy/engine";
import type { WorkerInboundMessage, WorkerOutboundMessage, HuntFilters, SearchResult } from "./types.ts";

const BATCH_SIZE = 10_000;
const PROGRESS_INTERVAL = 50_000;

let cancelled = false;

declare const self: DedicatedWorkerGlobalScope;

self.onmessage = async (e: MessageEvent<WorkerInboundMessage>) => {
  if (e.data.type === "cancel") {
    cancelled = true;
    return;
  }

  if (e.data.type === "hunt") {
    cancelled = false;
    await initHash();
    hunt(e.data.filters);
  }
};

async function hunt(filters: HuntFilters): Promise<void> {
  const { species, rarity, shiny, minTotal, perfect, tries, limit } = filters;
  const maxResults = limit || 50;
  const results: SearchResult[] = [];
  let tried = 0;

  while (tried < tries && results.length < maxResults) {
    if (cancelled) {
      self.postMessage({ type: "cancelled" } satisfies WorkerOutboundMessage);
      return;
    }

    const batchEnd = Math.min(tried + BATCH_SIZE, tries);

    for (let i = tried; i < batchEnd && results.length < maxResults; i++) {
      const fakeId = generateUuid();
      const b = rollBones(fakeId);

      if (species && b.species !== species) continue;
      if (rarity && b.rarity !== rarity) continue;
      if (shiny && !b.shiny) continue;
      if (minTotal && b.totalStats < minTotal) continue;
      if (perfect && !STAT_NAMES.every(s => (b.stats[s] ?? 0) >= perfect)) continue;

      results.push({ seed: fakeId, ...b });
    }

    tried = batchEnd;

    if (tried % PROGRESS_INTERVAL < BATCH_SIZE) {
      self.postMessage({ type: "progress", tried, found: results.length } satisfies WorkerOutboundMessage);
    }

    await new Promise<void>(r => setTimeout(r, 0));
  }

  const rarityOrder: Record<string, number> = { legendary: 4, epic: 3, rare: 2, uncommon: 1, common: 0 };
  results.sort((a, b) => {
    const rd = (rarityOrder[b.rarity] ?? 0) - (rarityOrder[a.rarity] ?? 0);
    return rd !== 0 ? rd : b.totalStats - a.totalStats;
  });

  self.postMessage({ type: "done", results, tried } satisfies WorkerOutboundMessage);
}
