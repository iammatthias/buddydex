import type { SearchResult } from "../types.ts";
import { BuddyArt } from "./BuddyArt.tsx";

export function BuddyCard({ result, onClick }: {
  result: SearchResult;
  onClick: () => void;
}) {
  return (
    <div
      className="card"
      data-rarity={result.rarity}
      data-shiny={result.shiny || undefined}
      onClick={onClick}
    >
      <BuddyArt species={result.species} hat={result.hat} className="card-art" />
      <div className="card-name">{result.species}</div>
      <div className="card-meta">{result.rarity} &middot; {result.totalStats}</div>
    </div>
  );
}
