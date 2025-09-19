import { Link } from "react-router-dom";
import type { ProductItem } from "../../../services/products";

function ProductCard({ p }: { p: ProductItem }) {
  return (
    <article className="rounded-2xl border p-3 hover:shadow-md transition bg-white">
      <Link to={`/product/${p.id}`} className="block">
        <div className="aspect-[4/3] overflow-hidden rounded-xl bg-zinc-100">
          {p.image ? (
            <img
              src={p.image}
              alt={p.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : null}
        </div>
        <h3 className="mt-3 font-medium">{p.title}</h3>
        <p className="text-sm text-zinc-700">${p.price}</p>
      </Link>
    </article>
  );
}

export default ProductCard;
