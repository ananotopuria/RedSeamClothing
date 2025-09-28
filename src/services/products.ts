import { authFetch } from "./auth";

export interface ApiProduct {
  id: number;
  title?: string;
  name?: string;
  price: number;
  image?: string | null;
  thumbnail?: string | null;
  image_url?: string | null;
  images?: Array<{ url?: string; src?: string; image?: string } | string>;
  colors?: Array<{
    id?: number;
    name?: string;
    hex?: string | null;
    image?: string | null;
    url?: string | null;
  }>;
  brand?: { name?: string; logo?: string | null };
  brand_name?: string;
  brand_logo?: string | null;
  manufacturer?: string;
  vendor?: string;
  description?: string;
  details?: string;
  current_price?: number;
  size?: string;
  sizes?: Array<string | { name?: string; value?: string }>;
  size_options?: Array<string | { name?: string; value?: string }>;
  variant_sizes?: Array<string | { name?: string; value?: string }>;
  options?: { sizes?: Array<string | { name?: string; value?: string }> };
  color_options?: unknown[];
  variants?: Array<{ color?: unknown }>;
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
  brand: { name: string | null; logo?: string | null };
  colors: ProductColor[];
  sizes: string[];
  image?: string | null;
  thumbnail?: string | null;
  images?: Array<{ url?: string } | string>;
};

export type ProductColor = {
  name: string | undefined;
  image: string | undefined;
};

const BASE_URL = "https://api.redseam.redberryinternship.ge";
const PRODUCTS_URL = `${BASE_URL}/api/products`;

function toAbsolute(url?: string | null): string {
  if (!url) return "";
  try {
    return new URL(url, `${BASE_URL}/`).href;
  } catch {
    return String(url);
  }
}

function pickFirstImage(p: ApiProduct): string {
  const firstFromImages =
    (Array.isArray(p.images) &&
      p.images.length > 0 &&
      (typeof p.images[0] === "string"
        ? p.images[0]
        : p.images[0]?.url ?? p.images[0]?.src ?? p.images[0]?.image)) ||
    null;

  const candidates: Array<string | undefined | null> = [
    p.image,
    p.thumbnail,
    p.image_url,
    firstFromImages,
    p.colors?.[0]?.image ?? p.colors?.[0]?.url,
  ];
  const found = candidates.find((x) => x && String(x).trim().length);
  return toAbsolute(found ?? "");
}

export type ProductsQuery = {
  page?: number;
  price_from?: number;
  price_to?: number;
  sort?: string;
  per_page?: number;
};

export type PageLinks = Array<{
  url: string | null;
  label: string;
  active: boolean;
}>;

export type ProductsPage = {
  items: ProductItem[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from?: number | null;
    to?: number | null;
    path?: string;
  };
  links: PageLinks;
};

export async function fetchProductsPaged(
  query: ProductsQuery = {}
): Promise<ProductsPage> {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.per_page) params.set("per_page", String(query.per_page));
  if (query.price_from != null)
    params.set("filter[price_from]", String(query.price_from));
  if (query.price_to != null)
    params.set("filter[price_to]", String(query.price_to));
  if (query.sort) params.set("sort", query.sort);

  const url = `${PRODUCTS_URL}?${params.toString()}`;
  const res = await authFetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok)
    throw new Error((await res.text()) || "Failed to fetch products");

  const json = (await res.json()) as {
    data: ApiProduct[];

    meta: {
      current_page?: number;
      last_page?: number;
      per_page?: number;
      total?: number;
      from?: number | null;
      to?: number | null;
      path?: string;
      links?: PageLinks;
    };
  };

  const items: ProductItem[] = (json.data ?? []).map((p) => ({
    id: p.id,
    title: p.title ?? p.name ?? "Untitled",
    price: p.price,
    image: pickFirstImage(p),
  }));

  const perPage = json.meta.per_page ?? 10;
  const total = json.meta.total ?? json.data?.length ?? 0;
  const current = json.meta.current_page ?? 1;

  const computedFrom = total === 0 ? 0 : (current - 1) * perPage + 1;
  const computedTo = Math.min(total, current * perPage);

  return {
    items,
    meta: {
      current_page: current,
      last_page: json.meta.last_page ?? Math.max(1, Math.ceil(total / perPage)),
      per_page: perPage,
      total,
      from: json.meta.from ?? computedFrom,
      to: json.meta.to ?? computedTo,
      path: json.meta.path,
    },
    links: json.meta.links ?? [],
  };
}

export async function fetchProducts(): Promise<ProductItem[]> {
  const res = await authFetch(PRODUCTS_URL, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error((await res.text()) || "Failed to fetch products");
  }
  const json = (await res.json()) as { data: ApiProduct[] };
  return (json.data ?? []).map((p) => ({
    id: p.id,
    title: p.title ?? p.name ?? "Untitled",
    price: p.price,
    image: pickFirstImage(p),
  }));
}

export async function fetchProductById(
  id: number | string
): Promise<ProductDetail | null> {
  const res = await authFetch(`${PRODUCTS_URL}/${id}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error((await res.text()) || `Failed to fetch product #${id}`);
  }

  const json = await res.json();
  const imagesMap = json["images"].map((x: unknown) => {
    return { url: x };
  });
  const colorsMap = json["available_colors"].map(
    (x: unknown, i: string | number) => {
      return { name: x, image: imagesMap[i].url };
    }
  );
  const data = {
    colors: colorsMap,
    sizes: json["available_sizes"],
    brand: { name: json["brand"].name, logo: json["brand"].image },
    name: json["name"],
    description: json["description"],
    price: json["price"],
    image: json["cover_image"],
    images: imagesMap,
    id: json["id"],
  } as ProductDetail;
  return data;
}

export function getHeroImage(detail: ProductDetail, colorIdx = 0): string {
  const fromColor = detail.colors?.[colorIdx]?.image ?? "";
  if (fromColor) return fromColor;

  if (Array.isArray(detail.images)) {
    for (const it of detail.images) {
      if (typeof it === "string" && it) return it;
      if (typeof it === "object" && it?.url) return it.url;
    }
  }
  if (detail.image) return detail.image;
  if (detail.thumbnail) return detail.thumbnail;
  return "";
}
