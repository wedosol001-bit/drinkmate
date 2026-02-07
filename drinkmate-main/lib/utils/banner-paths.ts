/**
 * Central helper for /images/bannerNew banner assets.
 * - Default variant: static banner; switch EN/AR by language.
 * - Shop variant: clickable banner for home/shop sliders; links to relevant shop page.
 * Uses exact filenames as on disk (including existing typos).
 */

const BASE = "/images/bannerNew"

export type BannerLang = "EN" | "AR"
export type BannerVariant = "default" | "shop"

export type BannerKey =
  | "shop"
  | "accessories"
  | "italianSyrup"
  | "refill"
  | "sodamaker"
  | "co2"
  | "flavour"
  | "recipes"
  | "co2Banner"
  | "sodaMakerBanner"
  | "refillBanner"
  | "premiumItalianSyrup"
  | "colaBundleBanner"

/** Map (key, lang, variant) -> filename (no path). */
const MAP: Record<
  BannerKey,
  { default: { EN: string; AR: string }; shop?: { EN: string; AR: string } }
> = {
  shop: {
    default: { EN: "shop.png", AR: "shopArbaic.png" },
    shop: { EN: "shopShop.png", AR: "shopArabicShop.png" },
  },
  accessories: {
    default: { EN: "accessorice.png", AR: "accessoriceArabic.png" },
    shop: { EN: "accessoriceShop.png", AR: "accessoriceArabicshop.png" },
  },
  italianSyrup: {
    default: { EN: "italianSyrup.png", AR: "italianSyrpArabic.png" },
    shop: { EN: "italianSyrupShop.png", AR: "italianSyrupShopArabic.png" },
  },
  refill: {
    default: { EN: "refill.png", AR: "refill.png" },
    shop: { EN: "refillShop.png", AR: "refillShop.png" },
  },
  sodamaker: {
    default: { EN: "sodaMakerBanner.png", AR: "sodamakerArabic.png" },
    shop: { EN: "sodamaker.png", AR: "sodamakerArabic.png" },
  },
  co2: {
    default: { EN: "co2.png", AR: "co2Arabic.png" },
    shop: { EN: "co2.png", AR: "co2Arabic.png" },
  },
  flavour: {
    default: { EN: "flavour.png", AR: "flavourArabic.png" },
  },
  recipes: {
    default: { EN: "recipes.png", AR: "recipes.png" },
  },
  co2Banner: {
    default: { EN: "co2Banner.png", AR: "co2Banner.png" },
  },
  sodaMakerBanner: {
    default: { EN: "sodaMakerBanner.png", AR: "sodamakerArabic.png" },
  },
  refillBanner: {
    default: { EN: "refillBanner.png", AR: "refillArabic.png" },
  },
  premiumItalianSyrup: {
    default: { EN: "preminumItalianSyrup.png", AR: "preminumItalianSyrup.png" },
  },
  colaBundleBanner: {
    default: { EN: "colaBundleBanner.png", AR: "colaBundleBanner.png" },
  },
}

/**
 * Returns the full banner image path for a given key, language, and variant.
 */
export function getBannerSrc(
  key: BannerKey,
  options: { lang: BannerLang; variant?: BannerVariant }
): string {
  const { lang, variant = "default" } = options
  const entry = MAP[key]
  if (!entry) return `${BASE}/shop.png`
  const variantEntry = variant === "shop" && entry.shop ? entry.shop : entry.default
  const filename = variantEntry[lang] ?? variantEntry.EN
  return `${BASE}/${filename}`
}
