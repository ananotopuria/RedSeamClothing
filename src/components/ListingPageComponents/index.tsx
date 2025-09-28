import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchProductsPaged, type ProductItem } from "../../services/products";
import PaginationComp from "./Pagination";
import ProductCard from "./ProductCard";
import FilterSortBar from "./FilterSortBar";

function ListingPageComponents() {
  const [items, setItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [from, setFrom] = useState<number | null>(null);
  const [to, setTo] = useState<number | null>(null);
  const [total, setTotal] = useState(0);

  const [params, setParams] = useSearchParams();

  const query = useMemo(() => {
    const qPage = Number(params.get("page") || 1);
    const price_from = params.get("price_from");
    const price_to = params.get("price_to");
    const sort = params.get("sort") || "-created_at";
    return {
      page: Number.isFinite(qPage) && qPage > 0 ? qPage : 1,
      price_from: price_from ? Number(price_from) : undefined,
      price_to: price_to ? Number(price_to) : undefined,
      sort,
    };
  }, [params]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await fetchProductsPaged({ ...query, per_page: 10 });
        if (!alive) return;
        setItems(res.items);
        setPage(res.meta.current_page);
        setTotalPages(res.meta.last_page);
        setFrom(res.meta.from ?? null);
        setTo(res.meta.to ?? null);
        setTotal(res.meta.total);
      } catch (e) {
        if (!alive) return;
        setErr((e as Error).message);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [query]);

  const handlePageChange = (next: number) => {
    const nextParams = new URLSearchParams(params);
    nextParams.set("page", String(next));
    setParams(nextParams, { replace: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="mt-[7rem] px-[10rem]">
      <h1 className="text-[4.2rem] font-semibold text-[#10151F]">Products</h1>

      <FilterSortBar
        from={from ?? undefined}
        to={to ?? undefined}
        total={total}
      />

      {loading && <p>Loading…</p>}
      {err && <p className="text-red-600">{err}</p>}

      {!loading && !err && (
        <>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {items.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>

          <div className="mt-6">
            <PaginationComp
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              hideWhenSingle={false}
            />
          </div>
        </>
      )}
    </main>
  );
}

export default ListingPageComponents;
