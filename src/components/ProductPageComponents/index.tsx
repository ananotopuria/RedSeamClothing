import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProductById, type ProductDetail } from "../../services/products";
import { useCart } from "../../state/useCart";

function ProductPageComponents() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");

  const { add } = useCart();

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchProductById(id!);
        setProduct(data);

        setSelectedColorIdx(0);
        setSelectedSize(data.sizes?.[0] ?? "");
      } catch (e) {
        setErr((e as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  function handleAddToCart() {
    if (!product) return;
    const color = product.colors?.[selectedColorIdx];
    if (!color || !selectedSize) return;

    add({
      productId: product.id,
      colorId: color.id,
      size: selectedSize,
      qty: 1,
      name: "",
      image: "",
      colorName: "",
      price: 0,
    });
  }

  if (loading) return <main className="p-8">Loading…</main>;
  if (err) return <main className="p-8 text-red-600">{err}</main>;
  if (!product) return <main className="p-8">Product not found</main>;

  const currentColor = product.colors?.[selectedColorIdx];

  return (
    <main className="mx-auto max-w-4xl p-8 space-y-6">
      <h1 className="text-3xl font-semibold">{product.name}</h1>
      <p className="text-gray-700">{product.description}</p>
      <p className="mt-2 font-medium">${product.price}</p>

      {product.colors?.length ? (
        <div>
          <h3 className="mb-2 font-medium">Color</h3>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c, idx) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedColorIdx(idx)}
                className={`px-3 py-2 rounded-md border ${
                  idx === selectedColorIdx
                    ? "border-black ring-2 ring-black"
                    : "border-gray-300"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {product.sizes?.length ? (
        <div>
          <h3 className="mb-2 font-medium">Size</h3>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="border rounded-md p-2"
          >
            {product.sizes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {currentColor?.image ? (
        <img
          src={currentColor.image}
          alt={`${product.name} - ${currentColor.name}`}
          className="w-full max-w-md rounded-lg border"
        />
      ) : null}

      <button
        type="button"
        onClick={handleAddToCart}
        className="rounded-md bg-black text-white px-6 py-3"
      >
        Add to cart
      </button>
    </main>
  );
}

export default ProductPageComponents;
