import { authFetch } from "./auth";

const API = "https://api.redseam.redberryinternship.ge/api";

export type CartItemDTO = {
  product_id: number;
  name?: string;
  image?: string;
  brand?: string;
  color_id: number;
  color_name?: string;
  size: string;
  price: number;
  quantity: number;
};

export type CartDTO = {
  items: CartItemDTO[];
  total_quantity: number;
  total_price: number;
};

export async function getCart(): Promise<CartDTO> {
  const res = await authFetch(`${API}/cart`, { method: "GET" });
  return res.json();
}

export async function addCartProduct(
  productId: number,
  body: { color_id: number; size: string; quantity: number }
) {
  const res = await authFetch(`${API}/cart/products/${productId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json() as Promise<CartDTO>;
}

export async function updateCartProduct(
  productId: number,
  body: { color_id: number; size: string; quantity: number }
) {
  const res = await authFetch(`${API}/cart/products/${productId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json() as Promise<CartDTO>;
}

export async function removeCartProduct(
  productId: number,
  body: { color_id: number; size: string }
) {
  const res = await authFetch(`${API}/cart/products/${productId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json() as Promise<CartDTO>;
}

export async function checkoutCart() {
  const res = await authFetch(`${API}/cart/checkout`, { method: "POST" });
  return res.json();
}
