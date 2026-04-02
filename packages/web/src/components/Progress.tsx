export function Progress({ tried, total, found }: {
  tried: number;
  total: number;
  found: number;
}) {
  const pct = total > 0 ? Math.min(100, (tried / total) * 100) : 0;
  return (
    <div className="progress-wrap">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct.toFixed(1)}%` }} />
      </div>
      <span className="progress-label">
        {tried.toLocaleString()} / {total.toLocaleString()} &middot; {found} found
      </span>
    </div>
  );
}
