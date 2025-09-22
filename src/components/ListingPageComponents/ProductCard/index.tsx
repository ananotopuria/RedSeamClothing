import { Link } from "react-router-dom";
import type { ProductItem } from "../../../services/products";

function ProductCard({ p }: { p: ProductItem }) {
  return (
    <article className="rounded-[1rem] w-[40rem] mb-[4.8rem]">
      <Link to={`/products/${p.id}`} className="block">
        <div className="flex items-center justify-center">
          {p.image ? (
            <img
              src={p.image}
              alt={p.title}
              className="w-[40rem] h-[54rem] rounded-[1rem]"
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
        <h3 className="mt-[1.2rem] font-medium text-[1.8rem] line-clamp-2 text-[#000000] leading-none tracking-normal">
          {p.title}
        </h3>
        <p className="mt-[0.5rem] text-[#000000] text-[1.6rem]">${p.price}</p>
      </Link>
    </article>
  );
}

export default ProductCard;
