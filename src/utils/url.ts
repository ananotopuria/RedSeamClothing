export function toAbsolute(
  url?: string | null,
  base = "https://api.redseam.redberryinternship.ge"
) {
  if (!url) return "";
  try {
    new URL(url);
    return url;
  } catch {
    return `${base.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
  }
}
