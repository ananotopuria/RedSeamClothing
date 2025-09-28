import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  fetchProductById,
  getHeroImage,
  type ProductDetail,
} from "../../services/products";
import { useCart } from "../../state/useCart";
import { useIsLoggedIn } from "../../hooks/useIsLoggedIn";

function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export default function ProductPageComponents() {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [selectedColorIdx, setSelectedColorIdx] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [qty, setQty] = useState<number>(1);

  const [activeImage, setActiveImage] = useState<string>("");

  const { add } = useCart();
  const [localErr, setLocalErr] = useState<string | null>(null);
  const isLoggedIn = useIsLoggedIn();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const data = await fetchProductById(id!);
        setProduct(data);
        setSelectedColorIdx(0);
        setSelectedSize(data?.sizes?.[0] ?? "");
      } catch (e) {
        setErr((e as Error).message || "Failed to load product");
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
    () => (product?.colors ? product.colors[selectedColorIdx] : undefined),
    [product, selectedColorIdx]
  );

  const computedHero = useMemo(
    () => (product ? getHeroImage(product, selectedColorIdx) : ""),
    [product, selectedColorIdx]
  );

  useEffect(() => {
    setActiveImage(computedHero || "");
  }, [computedHero, id]);

  const gallery: string[] = useMemo(() => {
    const imgs: string[] = [];

    if (Array.isArray(product?.images)) {
      for (const it of product!.images!) {
        if (typeof it === "string" && it) imgs.push(it);
        else if (it && typeof it === "object" && it.url) imgs.push(it.url);
      }
    }

    for (const c of product?.colors ?? []) {
      if (c?.image) imgs.push(c.image);
    }

    if (product?.image) imgs.push(product.image);
    if (product?.thumbnail) imgs.push(product.thumbnail);

    return Array.from(new Set(imgs.filter(Boolean)));
  }, [product]);

  const canAdd =
    !!product &&
    currentColor &&
    selectedSize &&
    Number.isFinite(product.price) &&
    qty > 0;

  function handleAddToCart() {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    console.log("🚀 ~ handleAddToCart ~ selectedSize:", selectedSize);

    if (!product || !currentColor) return;
    setLocalErr(null);
    add({
      productId: product.id,
      size: selectedSize,
      qty,
      name: product.name,
      image: activeImage || computedHero || gallery[0] || "",
      colorName: currentColor.name,
      price: product.price,
    }).catch((e) => setLocalErr((e as Error).message));
  }

  if (loading) {
    return (
      <main className="px-[10rem] mt-[3rem]">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-48 bg-zinc-200 rounded" />
          <div className="grid grid-cols-12 gap-[5rem] mt-[2rem]">
            <div className="col-span-12 lg:col-span-7">
              <div className="h-[60rem] bg-zinc-100 rounded" />
            </div>
            <div className="col-span-12 lg:col-span-5 space-y-4">
              <div className="h-8 w-3/4 bg-zinc-200 rounded" />
              <div className="h-6 w-32 bg-zinc-200 rounded" />
              <div className="h-10 w-full bg-zinc-200 rounded" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (err) {
    return (
      <main className="p-8">
        <p className="text-red-600">{err}</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="p-8">
        <p>Product not found.</p>
      </main>
    );
  }

  return (
    <main className="px-[10rem] mt-[3rem]">
      <nav className="text-[1.4rem] text-[#10151F] mb-3 leading-none">
        Listing / Product
      </nav>

      <div className="grid grid-cols-12 gap-[5rem] mt-[5rem]">
        <div className="col-span-12 lg:col-span-7">
          <div className="flex gap-[2.4rem]">
            {gallery.length > 0 && (
              <div className="hidden sm:flex flex-col gap-3 w-[12rem]">
                {gallery.slice(0, 12).map((src, i) => {
                  const active =
                    (activeImage && src === activeImage) ||
                    (!activeImage && i === 0);
                  return (
                    <button
                      key={src + i}
                      type="button"
                      aria-label={`Preview image ${i + 1}`}
                      className={classNames(
                        "aspect-[3/4] w-[12rem] h-[16rem] overflow-hidden rounded-lg border transition ring-offset-2 focus:outline-none focus:ring",
                        active
                          ? "ring-2 ring-orange-500 border-orange-500"
                          : "border-zinc-200 hover:border-zinc-300"
                      )}
                      onClick={() => {
                        setActiveImage(src);
                        const colorIdx = product.colors?.findIndex(
                          (c) => c.image && c.image === src
                        );
                        if (colorIdx != null && colorIdx >= 0) {
                          setSelectedColorIdx(colorIdx);
                        }
                      }}
                    >
                      <img
                        src={src}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex-1">
              <div className="rounded-[1rem] border bg-white p-4 w-full max-w-[70rem]">
                {activeImage ? (
                  <img
                    key={activeImage}
                    src={activeImage}
                    alt={`${product.name}${
                      currentColor ? ` - ${currentColor.name}` : ""
                    }`}
                    className="w-full max-w-[70rem] h-auto object-contain"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display =
                        "none";
                    }}
                  />
                ) : (
                  <div className="w-full max-w-[70rem] aspect-[3/4] rounded-lg border bg-zinc-100 flex items-center justify-center text-zinc-400">
                    No image
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5">
          <h1 className="text-[28px] font-semibold leading-none">
            {product.name}
          </h1>

          <div className="text-[22px] font-semibold mt-[2rem]">
            ${product.price}
          </div>

          {!!product.colors?.length && (
            <div className="mt-6">
              <div className="text-sm text-zinc-600 mb-2">
                Color:{" "}
                <span className="text-zinc-900 font-medium">
                  {currentColor?.name ?? "-"}
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((c, idx) => (
                  <button
                    key={idx}
                    type="button"
                    // title={c.name}
                    aria-label={`Select color ${c.name}`}
                    onClick={() => {
                      setSelectedColorIdx(idx);
                      const next =
                        c.image ||
                        getHeroImage(product, idx) ||
                        gallery[0] ||
                        "";
                      setActiveImage(next);
                    }}
                    className={classNames(
                      "h-9 w-9 rounded-full border flex items-center justify-center ring-offset-2 focus:outline-none focus:ring transition",
                      idx === selectedColorIdx
                        ? "border-orange-500 ring-2 ring-orange-500"
                        : "border-zinc-300 hover:border-zinc-400"
                    )}
                  >
                    <span
                      className="h-7 w-7 rounded-full block"
                      style={
                        c.name
                          ? { backgroundColor: c.name }
                          : c.image
                          ? {
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }
                          : { backgroundColor: "#e5e7eb" }
                      }
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes?.length > 0 ? (
            <div className="mt-6">
              <div className="text-sm text-zinc-600 mb-2">
                Size:{" "}
                <span className="text-zinc-900 font-medium">
                  {selectedSize || "-"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={classNames(
                      "px-3 py-1.5 rounded-md border text-sm transition focus:outline-none focus:ring ring-offset-2",
                      s === selectedSize
                        ? "border-orange-500 text-orange-600 ring-orange-400"
                        : "border-zinc-300 hover:bg-zinc-50"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>no sizes available / STYLE ASAP</div>
          )}

          <div className="mt-[5rem]">
            <label
              htmlFor="qty"
              className="block text-[1.6rem] text-[#10151F] mb-2"
            >
              Quantity
            </label>
            <select
              id="qty"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="h-10 w-28 rounded-md border px-3 bg-white"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isLoggedIn ? !canAdd : false}
              className={classNames(
                "h-12 w-full rounded-md text-white flex items-center justify-center gap-2 transition focus:outline-none focus:ring ring-offset-2",
                isLoggedIn && canAdd
                  ? "bg-[#F24A0D] hover:bg-[#e1440d] focus:ring-orange-400"
                  : "bg-zinc-400 cursor-not-allowed"
              )}
            >
              <span aria-hidden>🛒</span>
              <span>{isLoggedIn ? "Add to cart" : "Log in to add"}</span>
            </button>
            {localErr && (
              <p className="text-red-600 text-sm mt-2">{localErr}</p>
            )}
          </div>

          <hr className="my-8 border-zinc-200" />

          <section aria-labelledby="details-heading">
            <h3
              id="details-heading"
              className="text-[2rem] text-[#10151F] font-semibold mb-3"
            >
              Details
            </h3>
            {product.brand?.name && (
              <div className="text-[1.6rem] text-[#3E424A] leading-tight">
                <span className="text-zinc-600">Brand:</span>{" "}
                <span className="font-normal">{product.brand.name}</span>
              </div>
            )}
            {product.description ? (
              <p className="text-[1.6rem] text-[#3E424A] leading-normal mt-[2rem]">
                {product.description}
              </p>
            ) : (
              <p className="text-[1.6rem] text-zinc-500">
                No additional details.
              </p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
