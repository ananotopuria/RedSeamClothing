import { authFetch } from "./auth";
type UnknownRecord = Record<string, unknown>;

function isObject(v: unknown): v is UnknownRecord {
  return typeof v === "object" && v !== null;
}

function asArray<T = unknown>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

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

function normalizeProductDetail(apiRaw: unknown): ProductDetail {
  const api = isObject(apiRaw) ? apiRaw : {};

  const images: Array<string | { url: string }> = [];
  const rawImages = asArray(api["images"]);
  for (const it of rawImages) {
    if (typeof it === "string") {
      const u = toAbsolute(it);
      if (u) images.push(u);
    } else if (isObject(it)) {
      const u = toAbsolute(
        (it["url"] as string | undefined) ??
          (it["src"] as string | undefined) ??
          (it["image"] as string | undefined) ??
          ""
      );
      if (u) images.push({ url: u });
    }
  }

  const singleImage = toAbsolute(
    (api["image"] as string | null | undefined) ??
      (api["image_url"] as string | null | undefined) ??
      null
  );
  const thumbnail = toAbsolute(api["thumbnail"] as string | null | undefined);
  if (singleImage) images.unshift(singleImage);
  if (thumbnail) images.push(thumbnail);

  const rawColorsPrimary = api["colors"];
  const rawColorOptions = api["color_options"];
  const rawVariants = asArray(api["variants"]).map((v) =>
    isObject(v) ? v["color"] : undefined
  );
  const rawColors = rawColorsPrimary ?? rawColorOptions ?? rawVariants;

  const colors = asArray(rawColors)
    .filter(Boolean)
    .map((c, idx) => {
      const obj = isObject(c) ? c : {};
      const id = (obj["id"] as number | undefined) ?? idx;
      const name =
        (obj["name"] as string | undefined) ??
        (obj["title"] as string | undefined) ??
        String(c ?? "Color");
      const hex =
        (obj["hex"] as string | null | undefined) ??
        (obj["hex_code"] as string | null | undefined) ??
        null;
      const img =
        (obj["image"] as string | undefined) ??
        (obj["thumbnail"] as string | undefined) ??
        (obj["url"] as string | undefined) ??
        (obj["src"] as string | undefined) ??
        null;

      return { id, name, hex, image: toAbsolute(img ?? "") };
    });

  const sizeCandidatesUnknown = [
    api["sizes"],
    api["size_options"],
    api["variant_sizes"],
    isObject(api["options"])
      ? (api["options"] as UnknownRecord)["sizes"]
      : undefined,
  ];

  let sizes: string[] = [];
  for (const cand of sizeCandidatesUnknown) {
    const arr = asArray(cand);
    if (arr.length) {
      sizes = arr
        .map((s) =>
          typeof s === "string"
            ? s
            : isObject(s)
            ? (s["name"] as string | undefined) ??
              (s["value"] as string | undefined) ??
              String(s)
            : String(s)
        )
        .filter(Boolean) as string[];
      break;
    }
  }
  if (!sizes.length && api["size"]) {
    sizes = [String(api["size"])];
  }

  const brandObj = isObject(api["brand"])
    ? (api["brand"] as UnknownRecord)
    : {};
  const brandName =
    (brandObj["name"] as string | undefined) ??
    (api["brand_name"] as string | undefined) ??
    (api["manufacturer"] as string | undefined) ??
    (api["vendor"] as string | undefined) ??
    "—";
  const brandLogo = toAbsolute(
    (brandObj["logo"] as string | null | undefined) ??
      (api["brand_logo"] as string | null | undefined) ??
      null
  );

  return {
    id: Number(api["id"]),
    name:
      (api["name"] as string | undefined) ??
      (api["title"] as string | undefined) ??
      "Untitled",
    description:
      (api["description"] as string | undefined) ??
      (api["details"] as string | undefined) ??
      "",
    price: Number(
      (api["price"] as number | undefined) ?? api["current_price"] ?? 0
    ),
    brand: { name: brandName, logo: brandLogo },
    colors,
    sizes,
    image: singleImage || null,
    thumbnail: thumbnail || null,
    images,
  };
}

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
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
    from?: number | null;
    to?: number | null;
    path?: string;
    links?: PageLinks;
  };

  const items: ProductItem[] = (json.data ?? []).map((p) => ({
    id: p.id,
    title: p.title ?? p.name ?? "Untitled",
    price: p.price,
    image: pickFirstImage(p),
  }));

  const perPage = json.per_page ?? 10;
  const total = json.total ?? json.data?.length ?? 0;
  const current = json.current_page ?? 1;

  const computedFrom = total === 0 ? 0 : (current - 1) * perPage + 1;
  const computedTo = Math.min(total, current * perPage);

  return {
    items,
    meta: {
      current_page: current,
      last_page: json.last_page ?? Math.max(1, Math.ceil(total / perPage)),
      per_page: perPage,
      total,
      from: json.from ?? computedFrom,
      to: json.to ?? computedTo,
      path: json.path,
    },
    links: json.links ?? [],
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
): Promise<ProductDetail> {
  const res = await authFetch(`${PRODUCTS_URL}/${id}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error((await res.text()) || `Failed to fetch product #${id}`);
  }
  const api = await res.json();
  const data = normalizeProductDetail(api);

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
