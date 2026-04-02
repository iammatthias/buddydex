import { SPECIES, RARITIES } from "@buddy/engine/constants";
import type { FilterState } from "../types.ts";

export function Search({ filters, searching, onFilter, onHunt }: {
  filters: FilterState;
  searching: boolean;
  onFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onHunt: () => void;
}) {
  return (
    <div className="search">
      <select
        value={filters.species}
        onChange={e => onFilter("species", e.target.value as FilterState["species"])}
      >
        <option value="">any species</option>
        {SPECIES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      <select
        value={filters.rarity}
        onChange={e => onFilter("rarity", e.target.value as FilterState["rarity"])}
      >
        <option value="">any rarity</option>
        {RARITIES.map(r => <option key={r} value={r}>{r}</option>)}
      </select>

      <select
        value={filters.minTotal}
        onChange={e => onFilter("minTotal", parseInt(e.target.value))}
      >
        <option value={0}>any bst</option>
        {[200, 250, 300, 350, 400].map(v => <option key={v} value={v}>{v}+</option>)}
      </select>

      <select
        value={filters.perfect}
        onChange={e => onFilter("perfect", parseInt(e.target.value))}
      >
        <option value={0}>any stats</option>
        {[40, 50, 60, 70, 80].map(v => <option key={v} value={v}>&ge;{v}</option>)}
      </select>

      <select
        value={filters.tries}
        onChange={e => onFilter("tries", parseInt(e.target.value))}
      >
        {[1e5, 5e5, 1e6, 5e6, 1e7].map(v => {
          const label = v >= 1e6 ? `${v / 1e6}m` : `${v / 1e3}k`;
          return <option key={v} value={v}>{label}</option>;
        })}
      </select>

      <label>
        <input
          type="checkbox"
          checked={filters.shiny}
          onChange={e => onFilter("shiny", e.target.checked)}
        />
        shiny
      </label>

      <button className="search-go" disabled={searching} onClick={onHunt}>
        {searching ? "..." : "hunt"}
      </button>
    </div>
  );
}
