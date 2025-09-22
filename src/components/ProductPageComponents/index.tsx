import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  fetchProductById,
  getHeroImage,
  type ProductDetail,
} from "../../services/products";
import { useCart } from "../../state/useCart";

function ProductPageComponents() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [selectedColorIdx, setSelectedColorIdx] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>("");

  const { add } = useCart();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
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

  useEffect(() => {
    if (!product?.colors?.length) {
      setSelectedColorIdx(0);
      return;
    }
    if (selectedColorIdx >= product.colors.length) {
      setSelectedColorIdx(0);
    }
  }, [product?.colors?.length, selectedColorIdx]);

  const currentColor = useMemo(
    () => product?.colors?.[selectedColorIdx],
    [product, selectedColorIdx]
  );

  const heroImage = useMemo(
    () => (product ? getHeroImage(product, selectedColorIdx) : ""),
    [product, selectedColorIdx]
  );

  const canAdd =
    !!product &&
    !!currentColor &&
    !!selectedSize &&
    Number.isFinite(product.price);

  function handleAddToCart() {
    if (!product || !currentColor || !selectedSize) return;

    add({
      productId: product.id,
      colorId: currentColor.id,
      size: selectedSize,
      qty: 1,
      name: product.name,
      image: heroImage,
      colorName: currentColor.name,
      price: product.price,
    });
  }

  if (loading) return <main className="p-8">Loading…</main>;
  if (err) return <main className="p-8 text-red-600">{err}</main>;
  if (!product) return <main className="p-8">Product not found</main>;

  return (
    <main className="mx-auto max-w-4xl p-8 space-y-6">
      <h1 className="text-3xl font-semibold">{product.name}</h1>
      <p className="text-gray-700">{product.description}</p>
      <p className="mt-2 font-medium">${product.price}</p>

      {!!product.colors?.length && (
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
      )}

      {!!product.sizes?.length && (
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
      )}

      <div className="mt-2">
        {heroImage ? (
          <img
            src={heroImage}
            alt={`${product.name}${
              product.colors?.[selectedColorIdx]
                ? ` - ${product.colors[selectedColorIdx].name}`
                : ""
            }`}
            className="w-full max-w-md rounded-lg border"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="w-full max-w-md aspect-[4/3] rounded-lg border bg-zinc-100 flex items-center justify-center text-zinc-400">
            No image
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!canAdd}
        className={`rounded-md px-6 py-3 text-white ${
          canAdd
            ? "bg-black hover:bg-zinc-800"
            : "bg-zinc-400 cursor-not-allowed"
        }`}
      >
        Add to cart
      </button>
    </main>
  );
}

export default ProductPageComponents;
