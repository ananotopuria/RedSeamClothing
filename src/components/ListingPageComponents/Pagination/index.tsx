type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hideWhenSingle?: boolean;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function asInt(n: unknown, fallback = 1) {
  const v = Number(n);
  return Number.isFinite(v) && v > 0 ? Math.floor(v) : fallback;
}

function buildPages(current: number, last: number): (number | "...")[] {
  const delta = 1;
  const range: number[] = [];
  for (let i = 1; i <= last; i++) {
    if (
      i === 1 ||
      i === last ||
      (i >= current - delta && i <= current + delta)
    ) {
      range.push(i);
    }
  }
  const pages: (number | "...")[] = [];
  let prev: number | null = null;
  for (const n of range) {
    if (prev !== null && n - prev > 1) pages.push("...");
    pages.push(n);
    prev = n;
  }
  return pages;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  hideWhenSingle = true,
}: Props) {
  console.log("Pagination props =>", { page, totalPages });

  const total = Math.max(1, asInt(totalPages, 1));
  const curr = clamp(asInt(page, 1), 1, total);

  if (hideWhenSingle && total <= 1) return null;

  const pages = buildPages(curr, total);

  const go = (p: number) => {
    const next = clamp(p, 1, total);
    if (next !== curr) onPageChange(next);
  };

  return (
    <nav
      className="mt-6 flex items-center justify-center gap-2 select-none"
      aria-label="Pagination"
    >
      <button
        className="px-2 py-1 rounded border text-sm disabled:opacity-40"
        onClick={() => go(curr - 1)}
        disabled={curr <= 1}
        aria-label="წინა გვერდი"
      >
        ‹
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
        className="px-2 py-1 rounded border text-sm disabled:opacity-40"
        onClick={() => go(curr + 1)}
        disabled={curr >= total}
        aria-label="შემდეგი გვერდი"
      >
        ›
      </button>

      <span className="ml-3 text-sm text-zinc-600">
        გვერდი {curr} / {total}
      </span>
    </nav>
  );
}
