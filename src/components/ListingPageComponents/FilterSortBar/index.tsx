import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiSliders, FiChevronDown } from "react-icons/fi";

type Props = {
  from?: number | null;
  to?: number | null;
  total: number;
};

const SORTS = [
  { value: "-created_at", label: "New products first" },
  { value: "price", label: "Price, low to high" },
  { value: "-price", label: "Price, high to low" },
];

function parseNumParam(v: string | null): number | "" {
  if (v == null || v === "") return "";
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : "";
}

function useClickOutside<T extends HTMLElement>(onClose: () => void) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);
  return ref;
}

export default function FilterSortBar({ from, to, total }: Props) {
  const [params, setParams] = useSearchParams();

  const initial = useMemo(() => {
    const price_from = parseNumParam(params.get("price_from"));
    const price_to = parseNumParam(params.get("price_to"));
    const sort = params.get("sort") ?? "-created_at";
    return { price_from, price_to, sort } as const;
  }, [params]);

  const [priceFrom, setPriceFrom] = useState<number | "">(initial.price_from);
  const [priceTo, setPriceTo] = useState<number | "">(initial.price_to);
  const [sort, setSort] = useState<string>(initial.sort);

  useEffect(() => {
    setPriceFrom(initial.price_from);
    setPriceTo(initial.price_to);
    setSort(initial.sort);
  }, [initial.price_from, initial.price_to, initial.sort]);

  const [openFilter, setOpenFilter] = useState(false);
  const [openSort, setOpenSort] = useState(false);
  const filterRef = useClickOutside<HTMLDivElement>(() => setOpenFilter(false));
  const sortRef = useClickOutside<HTMLDivElement>(() => setOpenSort(false));

  const applyFilters = () => {
    const next = new URLSearchParams(params);
    next.set("page", "1");

    if (priceFrom !== "" && !Number.isNaN(priceFrom)) {
      next.set("price_from", String(priceFrom));
    } else {
      next.delete("price_from");
    }

    if (priceTo !== "" && !Number.isNaN(priceTo)) {
      next.set("price_to", String(priceTo));
    } else {
      next.delete("price_to");
    }

    if (sort) next.set("sort", sort);
    else next.set("sort", "-created_at");

    setParams(next, { replace: false });
    setOpenFilter(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const applySort = (value: string) => {
    const next = new URLSearchParams(params);
    next.set("page", "1");
    if (value) {
      next.set("sort", value);
    } else {
      next.delete("sort");
    }
    setParams(next, { replace: false });
    setOpenSort(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentSortLabel =
    SORTS.find((o) => o.value === sort)?.label ?? "New products first";

  return (
    <div className="mt-4 mb-2 flex items-center justify-between gap-4">
      <div className="text-sm text-zinc-600">
        {total > 0 ? (
          <>
            Showing {from ?? 0}–{to ?? 0} of {total} results
          </>
        ) : (
          <>No results</>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="relative" ref={filterRef}>
          <button
            type="button"
            onClick={() => {
              setOpenFilter((v) => !v);
              setOpenSort(false);
            }}
            className="flex items-center gap-2 text-[15px]"
          >
            <FiSliders className="text-[18px]" />
            <span>Filter</span>
          </button>

          {openFilter && (
            <div className="absolute right-0 z-20 mt-3 w-[320px] rounded-md border bg-white p-4 shadow-lg">
              <h4 className="mb-3 text-[15px] font-semibold">Select price</h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">
                    From *
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={priceFrom}
                    onChange={(e) =>
                      setPriceFrom(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    placeholder="e.g. 100"
                    className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-500 mb-1">
                    To *
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={priceTo}
                    onChange={(e) =>
                      setPriceTo(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    placeholder="e.g. 500"
                    className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={applyFilters}
                  className="rounded bg-[#F24A0D] px-5 py-2 text-white text-sm"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={sortRef}>
          <button
            type="button"
            onClick={() => {
              setOpenSort((v) => !v);
              setOpenFilter(false);
            }}
            className="flex items-center gap-2 text-[15px]"
          >
            <span className="whitespace-nowrap">{currentSortLabel}</span>
            <FiChevronDown />
          </button>

          {openSort && (
            <div className="absolute right-0 z-20 mt-3 w-[22rem] h-[18rem] rounded-[8px] border bg-white p-2 shadow-lg">
              <div className="px-3 py-2 text-[12px] text-zinc-500">Sort by</div>
              {SORTS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => applySort(opt.value)}
                  className={`block w-full text-left px-3 py-2 rounded text-sm hover:bg-zinc-50 ${
                    sort === opt.value ? "font-medium" : ""
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
