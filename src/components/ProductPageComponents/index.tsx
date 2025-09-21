import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProductById, type ProductDetail } from "../../services/products";

function ProductPageComponents() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchProductById(id!);
        setProduct(data);
      } catch (e) {
        setErr((e as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <main className="p-8">Loading…</main>;
  if (err) return <main className="p-8 text-red-600">{err}</main>;
  if (!product) return <main className="p-8">Product not found</main>;

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-3xl font-semibold">{product.name}</h1>
      <p className="text-gray-700">{product.description}</p>
      <p className="mt-2 font-medium">${product.price}</p>
    </main>
  );
}

export default ProductPageComponents;
