import { authFetch } from "./auth";

export interface ApiProduct {
  id: number;
  title?: string;
  name?: string;
  price: number;
  image?: string;
  thumbnail?: string;
}

export type ProductItem = {
  id: number;
  title: string;
  price: number;
  image: string;
};

export type ProductDetail = {
  id: number;
  name: string;
  description: string;
  price: number;
  brand: { name: string; logo?: string | null };
  colors: { id: number; name: string; hex?: string | null; image: string }[];
  sizes: string[];
};

const API_URL = "https://api.redseam.redberryinternship.ge/api/products";

export async function fetchProducts(): Promise<ProductItem[]> {
  const res = await authFetch(API_URL);
  const json: { data: ApiProduct[] } = await res.json();
  return json.data.map((p) => ({
    id: p.id,
    title: p.title ?? p.name ?? "Untitled",
    price: p.price,
    image: p.image ?? p.thumbnail ?? "",
  }));
}

export async function fetchProductById(
  id: number | string
): Promise<ProductDetail> {
  const res = await authFetch(`${API_URL}/${id}`);
  return (await res.json()) as ProductDetail;
}
