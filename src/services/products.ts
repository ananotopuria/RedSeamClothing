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

const API_URL = "https://api.redseam.redberryinternship.ge/api/products";

export async function fetchProducts(): Promise<ProductItem[]> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please log in first.");

  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error(`Failed to load products: ${res.status}`);

  const json: { data: ApiProduct[] } = await res.json();

  return json.data.map(
    (p): ProductItem => ({
      id: p.id,
      title: p.title ?? p.name ?? "Untitled",
      price: p.price,
      image: p.image ?? p.thumbnail ?? "",
    })
  );
}
