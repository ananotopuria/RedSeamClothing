import type { CartItemDTO } from "../types/cart";
import type { LocalCartItem } from "../types/cart";

export function cartItemKey(x: {
  productId: number;
  colorName: string;
  size: string;
}): string {
  return `${x.productId}::${x.colorName}::${x.size}`;
}

export function mapDtoToLocal(
  dto: CartItemDTO[],
  seed: Record<string, Partial<LocalCartItem>> = {}
): LocalCartItem[] {
  const items = dto ?? [];
  return items.map((it: CartItemDTO) => {
    const key = cartItemKey({
      productId: it.id,
      colorName: it.color_name || "",
      size: it.size,
    });
    const known = seed[key] ?? {};
    return {
      productId: it.id,
      colorName: it.color,
      size: it.size,
      qty: it.quantity,
      price: it.price ?? known.price ?? 0,
      name: it.name ?? known.name ?? "Product",
      image: it.cover_image ?? known.image ?? "",
      // colorName: it.color_name ?? known.colorName,
    };
  });
}

export function computeTotals(items: LocalCartItem[]) {
  const totalQty = items.reduce((s, it) => s + it.qty, 0);
  const totalPrice = items.reduce((s, it) => s + it.qty * it.price, 0);
  return { totalQty, totalPrice };
}
