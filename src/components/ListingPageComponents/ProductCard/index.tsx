import { Link } from "react-router-dom";
import type { ProductItem } from "../../../services/products";

function ProductCard({ p }: { p: ProductItem }) {
  return (
    <article className="rounded-2xl border p-3 hover:shadow-md transition bg-white">
      <Link to={`/products/${p.id}`} className="block">
        <div className="aspect-[4/3] overflow-hidden rounded-xl bg-zinc-100 flex items-center justify-center">
          {p.image ? (
            <img
              src={p.image}
              alt={p.title}
              className="w-full h-full object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <span className="text-zinc-400 text-sm">No image</span>
          )}
        </div>
        <h3 className="mt-3 font-medium line-clamp-2">{p.title}</h3>
        <p className="text-sm text-zinc-700">${p.price}</p>
      </Link>
    </article>
  );
}

export default ProductCard;
