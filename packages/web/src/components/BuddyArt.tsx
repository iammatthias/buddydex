import type { Species, Hat } from "@buddy/engine";
import { ART, HAT_ART } from "../art.ts";

export function BuddyArt({ species, hat, className }: {
  species: Species;
  hat: Hat;
  className?: string;
}) {
  const lines = ART[species] ?? ["???"];
  const hatLine = hat !== "none" ? (HAT_ART[hat] ?? "") : "";
  const text = (hatLine ? [hatLine, ...lines] : [...lines]).join("\n");
  return <pre className={className}>{text}</pre>;
}
