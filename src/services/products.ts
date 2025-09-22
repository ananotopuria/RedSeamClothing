import { authFetch } from "./auth";

export interface ApiProduct {
  id: number;
  title?: string;
  name?: string;
  price: number;
  image?: string | null;
  thumbnail?: string | null;
  image_url?: string | null;
  images?: Array<{ url: string } | string>;
  colors?: Array<{ id: number; name: string; image?: string | null }>;
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
  image?: string | null;
  thumbnail?: string | null;
  images?: Array<{ url?: string } | string>;
};

const BASE_URL = "https://api.redseam.redberryinternship.ge";
const PRODUCTS_URL = `${BASE_URL}/api/products`;

function toAbsolute(url?: string | null): string {
  if (!url) return "";
  try {
    return new URL(url, BASE_URL + "/").href;
  } catch {
    return "";
  }
}

function pickFirstImage(p: ApiProduct): string {
  const candidates: Array<string | undefined | null> = [
    p.image,
    p.thumbnail,
    p.image_url,
    typeof p.images?.[0] === "string" ? p.images[0] : p.images?.[0]?.url,
    p.colors?.[0]?.image,
  ];
  const found = candidates.find((x) => x && x.trim().length);
  return toAbsolute(found ?? "");
}

export async function fetchProducts(): Promise<ProductItem[]> {
  const res = await authFetch(PRODUCTS_URL);
  const json = (await res.json()) as { data: ApiProduct[] };
  return json.data.map((p) => ({
    id: p.id,
    title: p.title ?? p.name ?? "Untitled",
    price: p.price,
    image: pickFirstImage(p),
  }));
}

export async function fetchProductById(
  id: number | string
): Promise<ProductDetail> {
  const res = await authFetch(`${PRODUCTS_URL}/${id}`);
  const data = (await res.json()) as ProductDetail;

  data.colors = (data.colors ?? []).map((c) => ({
    ...c,
    image: toAbsolute(c.image),
  }));
  if (data.brand?.logo) data.brand.logo = toAbsolute(data.brand.logo);
  if (data.image) data.image = toAbsolute(data.image);
  if (data.thumbnail) data.thumbnail = toAbsolute(data.thumbnail);
  if (Array.isArray(data.images)) {
    data.images = data.images.map((x) =>
      typeof x === "string" ? toAbsolute(x) : { url: toAbsolute(x.url) }
    );
  }

  return data;
}

export function getHeroImage(detail: ProductDetail, colorIdx = 0): string {
  const fromColor = detail.colors?.[colorIdx]?.image ?? "";
  const fromImagesArray =
    (Array.isArray(detail.images) &&
      (typeof detail.images[0] === "string"
        ? detail.images[0]
        : detail.images[0]?.url)) ||
    "";
  return (
    fromColor ||
    fromImagesArray ||
    (detail.image ?? "") ||
    (detail.thumbnail ?? "")
  );
}
