type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hideWhenSingle?: boolean;
  adjacentCount?: number;
  fullListThreshold?: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
function asPosInt(n: unknown, fallback = 1) {
  const v = Number(n);
  return Number.isFinite(v) && v > 0 ? Math.floor(v) : fallback;
}

function buildPages(
  current: number,
  last: number,
  adjacentCount: number,
  fullListThreshold: number
): (number | "...")[] {
  if (last <= fullListThreshold) {
    return Array.from({ length: last }, (_, i) => i + 1); // 1..last
  }
  const set = new Set<number>();
  set.add(1);
  set.add(last);
  for (let i = current - adjacentCount; i <= current + adjacentCount; i++) {
    if (i >= 1 && i <= last) set.add(i);
  }
  const sorted = Array.from(set).sort((a, b) => a - b);
  const out: (number | "...")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const n = sorted[i];
    const prev = sorted[i - 1];
    if (i > 0 && n - (prev as number) > 1) out.push("...");
    out.push(n);
  }
  return out;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  hideWhenSingle = true,
  adjacentCount = 1,
  fullListThreshold = 7,
}: Props) {
  const total = Math.max(1, asPosInt(totalPages, 1));
  const curr = clamp(asPosInt(page, 1), 1, total);

  if (hideWhenSingle && total <= 1) return null;

  const pages = buildPages(curr, total, adjacentCount, fullListThreshold);

  const go = (p: number) => {
    const next = clamp(asPosInt(p, curr), 1, total);
    if (next !== curr) onPageChange(next);
  };

  return (
    <nav
      className="mt-6 flex items-center justify-center gap-2 select-none mb-[20rem]"
      aria-label="Pagination"
    >
      <button
        className="text-[2rem] disabled:opacity-40"
        onClick={() => go(curr - 1)}
        disabled={curr <= 1}
        aria-label="წინა გვერდი"
      >
        &#60;
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="px-3 py-1 text-sm text-zinc-500">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => go(p)}
            aria-current={p === curr ? "page" : undefined}
            className={
              p === curr
                ? "px-3 py-1 rounded border border-orange-500 text-orange-600 text-sm"
                : "px-3 py-1 rounded border text-sm hover:bg-zinc-50"
            }
          >
            {p}
          </button>
        )
      )}

      <button
        className="text-[2rem] disabled:opacity-40"
        onClick={() => go(curr + 1)}
        disabled={curr >= total}
        aria-label="შემდეგი გვერდი"
      >
        &#62;
      </button>
    </nav>
  );
}
