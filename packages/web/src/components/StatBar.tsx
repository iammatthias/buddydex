import type { StatName } from "@buddy/engine";

function color(v: number): string {
  if (v >= 80) return "var(--red)";
  if (v >= 60) return "var(--purple)";
  if (v >= 40) return "var(--blue)";
  if (v >= 20) return "var(--green)";
  return "var(--dim)";
}

export function StatBar({ name, value }: { name: StatName; value: number }) {
  return (
    <div className="stat">
      <span className="stat-name">{name}</span>
      <span className="stat-val">{value}</span>
      <div className="stat-bar">
        <div className="stat-fill" style={{ width: `${value}%`, background: color(value) }} />
      </div>
    </div>
  );
}
