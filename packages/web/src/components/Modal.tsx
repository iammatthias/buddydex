import { useState, useCallback, useEffect } from "react";
import { STAT_NAMES } from "@buddy/engine/constants";
import type { SearchResult } from "../types.ts";
import { BuddyArt } from "./BuddyArt.tsx";
import { StatBar } from "./StatBar.tsx";

export function Modal({ result, onClose }: {
  result: SearchResult;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(result.seed).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  }, [result.seed]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" data-rarity={result.rarity} onClick={e => e.stopPropagation()}>
        <BuddyArt species={result.species} hat={result.hat} className="modal-art" />
        <div className="modal-name">{result.species}</div>
        <div className="modal-tags">
          <span className={`rarity-${result.rarity}`}>{result.rarity}</span>
          {result.shiny && <> &middot; <span className="shiny">shiny</span></>}
          {" "}&middot; {result.eye} &middot; {result.hat} &middot; bst {result.totalStats}
        </div>
        <div className="stats">
          {STAT_NAMES.map(n => <StatBar key={n} name={n} value={result.stats[n] ?? 0} />)}
        </div>
        <div className="seed">
          <div className="seed-row">
            <code>{result.seed}</code>
            <button className={copied ? "copied" : ""} onClick={copy}>
              {copied ? "copied!" : "copy"}
            </button>
          </div>
          <div className="seed-cmd">$ bunx buddydex inject {result.seed}</div>
        </div>
      </div>
    </div>
  );
}
