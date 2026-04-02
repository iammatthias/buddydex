import { parseArgs } from "util";
import { SPECIES, RARITIES, STAT_NAMES, rollBones, generateUuid } from "@buddy/engine";
import type { BuddyBones } from "@buddy/engine";
import { printHeader } from "../lib/format.ts";

interface HuntResult extends BuddyBones {
  fakeId: string;
}

export default function cmdHunt(argv: string[]): void {
  const { values: args } = parseArgs({
    args: argv,
    options: {
      species: { type: "string" },
      rarity: { type: "string" },
      shiny: { type: "boolean", default: false },
      "min-stat": { type: "string" },
      "min-total": { type: "string" },
      perfect: { type: "string" },
      tries: { type: "string", default: "1000000" },
      limit: { type: "string", default: "10" },
    },
  });

  const maxTries = parseInt(args.tries!);
  const maxResults = parseInt(args.limit!);
  const wantSpecies = args.species?.toLowerCase();
  const wantRarity = args.rarity?.toLowerCase();
  const wantShiny = args.shiny;
  const wantMinStat = args["min-stat"]?.split(":");
  const wantMinTotal = args["min-total"] ? parseInt(args["min-total"]) : null;
  const wantPerfect = args.perfect ? parseInt(args.perfect) : null;

  if (wantSpecies && !SPECIES.includes(wantSpecies as typeof SPECIES[number])) {
    console.error(`Unknown species: ${wantSpecies}\nValid: ${SPECIES.join(", ")}`);
    process.exit(1);
  }
  if (wantRarity && !RARITIES.includes(wantRarity as typeof RARITIES[number])) {
    console.error(`Unknown rarity: ${wantRarity}\nValid: ${RARITIES.join(", ")}`);
    process.exit(1);
  }

  printHeader();

  const filters = [
    `species=${wantSpecies || "any"}`,
    `rarity=${wantRarity || "any"}`,
    `shiny=${wantShiny}`,
    wantMinStat ? `min-stat=${args["min-stat"]}` : null,
    wantMinTotal ? `min-total=${wantMinTotal}` : null,
    wantPerfect ? `perfect=${wantPerfect}` : null,
  ]
    .filter(Boolean)
    .join(" ");

  console.log(`\n  Filters: ${filters}`);
  console.log(
    `  Trying ${maxTries.toLocaleString()} random UUIDs, showing up to ${maxResults} results.\n`,
  );

  const results: HuntResult[] = [];
  const startTime = Date.now();

  for (let i = 0; i < maxTries && results.length < maxResults; i++) {
    const fakeId = generateUuid();
    const bones = rollBones(fakeId);

    if (wantSpecies && bones.species !== wantSpecies) continue;
    if (wantRarity && bones.rarity !== wantRarity) continue;
    if (wantShiny && !bones.shiny) continue;
    if (wantMinStat) {
      const [statName, minVal] = wantMinStat;
      if (
        !bones.stats[statName as keyof typeof bones.stats] ||
        bones.stats[statName as keyof typeof bones.stats] < parseInt(minVal)
      )
        continue;
    }
    if (wantMinTotal && bones.totalStats < wantMinTotal) continue;
    if (wantPerfect && !STAT_NAMES.every((s) => bones.stats[s] >= wantPerfect)) continue;

    results.push({ fakeId, ...bones });
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

  if (results.length === 0) {
    console.log(`  No matches found in ${maxTries.toLocaleString()} tries (${elapsed}s).`);
    console.log(`  Try increasing --tries or relaxing filters.\n`);
  } else {
    console.log(`  Found ${results.length} match(es) in ${elapsed}s:\n`);
    for (const r of results) {
      const shinyTag = r.shiny ? " SHINY" : "";
      const statBar = STAT_NAMES.map(
        (s) => `${s.slice(0, 3).toUpperCase()}:${r.stats[s]}`,
      ).join(" ");
      console.log(
        `  ${r.rarity.toUpperCase()} ${r.species}${shinyTag}  [${r.eye}]  hat:${r.hat}  total:${r.totalStats}`,
      );
      console.log(`    Stats: ${statBar}`);
      console.log(`    Seed:  ${r.fakeId}`);
      console.log();
    }
    console.log(`  To inject: buddydex inject <seed>\n`);
  }
}
