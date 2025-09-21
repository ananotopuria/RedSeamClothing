import type { CartItem } from "./cart-context";

export function cartItemKey(item: CartItem) {
  return `${item.productId}::${item.colorId}::${item.size}`;
}
