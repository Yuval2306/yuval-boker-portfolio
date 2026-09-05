// Personalized links: yuval-boker.onrender.com/?for=Wix
// The narrator greets that company and the hero says hi to their team.

export function getCompanyFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = new URLSearchParams(window.location.search).get("for");
    if (!raw) return null;
    const clean = raw.trim().replace(/\s+/g, " ").slice(0, 40);
    return clean.length > 0 ? clean : null;
  } catch {
    return null;
  }
}

export function companySlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
