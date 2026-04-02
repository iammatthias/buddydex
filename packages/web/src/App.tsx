import { useState, useRef, useCallback, useEffect } from "react";
import { initHash } from "@buddy/engine";
import type { FilterState, SearchResult, WorkerInbound, WorkerOutbound } from "./types.ts";
import { Search } from "./components/Search.tsx";
import { Progress } from "./components/Progress.tsx";
import { BuddyCard } from "./components/BuddyCard.tsx";
import { Modal } from "./components/Modal.tsx";

export default function App() {
  const [ready, setReady] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    species: "", rarity: "", shiny: false, minTotal: 0, perfect: 0, tries: 1_000_000,
  });
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selected, setSelected] = useState<SearchResult | null>(null);
  const [searching, setSearching] = useState(false);
  const [progress, setProgress] = useState({ tried: 0, found: 0 });
  const [elapsed, setElapsed] = useState<string | null>(null);

  const workerRef = useRef<Worker | null>(null);
  const t0Ref = useRef(0);

  useEffect(() => {
    initHash().then(() => setReady(true));

    const w = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
    workerRef.current = w;

    w.onmessage = (e: MessageEvent<WorkerOutbound>) => {
      if (e.data.type === "progress") {
        setProgress({ tried: e.data.tried, found: e.data.found });
      } else if (e.data.type === "done") {
        setSearching(false);
        setResults(e.data.results);
        setProgress({ tried: e.data.tried, found: e.data.results.length });
        setElapsed(((Date.now() - t0Ref.current) / 1000).toFixed(2));
      } else if (e.data.type === "cancelled") {
        setSearching(false);
      }
    };

    return () => w.terminate();
  }, []);

  const updateFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const hunt = useCallback(() => {
    if (searching) {
      workerRef.current?.postMessage({ type: "cancel" } satisfies WorkerInbound);
      return;
    }
    t0Ref.current = Date.now();
    setSearching(true);
    setResults([]);
    setSelected(null);
    setProgress({ tried: 0, found: 0 });
    setElapsed(null);

    workerRef.current?.postMessage({
      type: "hunt",
      filters: {
        species: filters.species || null,
        rarity: filters.rarity || null,
        shiny: filters.shiny,
        minTotal: filters.minTotal || null,
        perfect: filters.perfect || null,
        tries: filters.tries,
        limit: 50,
      },
    } satisfies WorkerInbound);
  }, [searching, filters]);

  if (!ready) {
    return (
      <div className="app">
        <div className="header"><h1>BUDDYDEX</h1></div>
        <div className="status">loading…</div>
      </div>
    );
  }

  const status = results.length > 0
    ? `${results.length} results${elapsed ? ` · ${elapsed}s` : ""}`
    : elapsed ? "no matches — try relaxing filters or increasing iterations" : "";

  return (
    <div className="app">
      <div className="header">
        <h1>BUDDYDEX</h1>
        <nav className="header-nav"><a href="/cli.html">cli docs</a></nav>
      </div>

      <Search filters={filters} searching={searching} onFilter={updateFilter} onHunt={hunt} />

      {searching && (
        <Progress tried={progress.tried} total={filters.tries} found={progress.found} />
      )}

      {status && <div className="status">{status}</div>}

      <div className="grid">
        {results.length === 0 && !searching && (
          <div className="empty">no buddies yet — set filters and hit hunt</div>
        )}
        {results.map((r, i) => (
          <BuddyCard key={r.seed} result={r} onClick={() => setSelected(r)} />
        ))}
      </div>

      {selected && <Modal result={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
