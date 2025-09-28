import { authFetch } from "./auth";
import type { CartDTO, CartItemDTO } from "../types/cart";

const API = "https://api.redseam.redberryinternship.ge/api";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

async function readJson<T>(res: Response): Promise<T> {
  const data = (await res.json()) as unknown;
  if (isRecord(data) && "data" in data && isRecord(data.data) === false) {
    return data.data as T;
  }
  return data as T;
}

export async function getCart(): Promise<CartItemDTO[]> {
  console.debug("GET /cart");
  const res = await authFetch(`${API}/cart`, { method: "GET" });
  if (!res.ok) throw new Error(await res.text());
  return readJson<CartItemDTO[]>(res);
}

export async function addCartProduct(
  productId: number,
  body: { color: string; size: string; quantity: number }
): Promise<CartDTO> {
  console.debug("POST /cart/products/%s", productId, body);
  const res = await authFetch(`${API}/cart/products/${productId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return readJson<CartDTO>(res);
}

export async function updateCartProduct(
  productId: number,
  body: { colorName: string; size: string; quantity: number }
): Promise<CartDTO> {
  console.debug("PATCH /cart/products/%s", productId, body);
  const res = await authFetch(`${API}/cart/products/${productId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return readJson<CartDTO>(res);
}

export async function removeCartProduct(
  productId: number,
  body: { colorName: string; size: string }
): Promise<boolean> {
  console.debug("DELETE /cart/products/%s", productId, body);
  const res = await authFetch(`${API}/cart/products/${productId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(await res.text());
  return true;
}
