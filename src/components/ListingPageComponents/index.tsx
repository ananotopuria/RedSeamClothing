import { useEffect, useState } from "react";
import { fetchProducts, type ProductItem } from "../../services/products";
import ProductCard from "./ProductCard";

function ListingPageComponents() {
  const [items, setItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setItems(data);
      } catch (e) {
        setErr((e as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="mx-auto w-[95%] max-w-[1200px] py-8">
      <h1 className="text-2xl font-semibold">Products</h1>

      {loading && <p>Loading…</p>}
      {err && <p className="text-red-600">{err}</p>}

      {!loading && !err && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </main>
  );
}

export default ListingPageComponents;
