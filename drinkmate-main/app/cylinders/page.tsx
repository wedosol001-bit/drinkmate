"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import PageLayout from "@/components/layout/PageLayout"
import { useTranslation } from "@/lib/contexts/translation-context"
import { ArrowRight } from "lucide-react"
import SaudiRiyal from "@/components/ui/SaudiRiyal"
import QualitySlideshow from "@/components/ui/quality-slideshow"
import { getBannerSrc } from "@/lib/utils/banner-paths"
import { getAppImageUrl } from "@/lib/utils/app-images"

/** Asset paths for the cylinders mediator page - resolved via getAppImageUrl (Cloudinary or local fallback) */
const ASSETS = {
  newCylinders: "/images/madiaterPage/newSelenders.svg",
  refillCylinders: "/images/madiaterPage/refillSelenders.svg",
  clockIcon: "/images/madiaterPage/clockIcon.svg",
  bottleIcon: "/images/madiaterPage/bottelIcon.svg",
  verifiedIcon: "/images/madiaterPage/verifiedIcon.svg",
  recycleIcon: "/images/madiaterPage/recycleIcon.svg",
  exchangeBottles: "/images/madiaterPage/exchangeBottels.svg",
} as const

export default function CylindersMediatorPage() {
  const { isRTL, language, t } = useTranslation()
  const prefix = language === "AR" ? "/ar" : ""

  return (
    <PageLayout>
      {/* Top Banner - Slider: refill (shop) + co2 (shop, EN/AR) */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
          <QualitySlideshow
            items={[
              {
                id: 1,
                src: getBannerSrc("refill", { lang: language, variant: "shop" }),
                alt: t("cylinders.banner.title"),
                href: `${prefix}/refill-cylinder`,
              },
              {
                id: 2,
                src: getBannerSrc("co2", { lang: language, variant: "shop" }),
                alt: t("cylinders.cardNew.title"),
                href: `${prefix}/shop/co2-cylinders`,
              },
            ]}
            autoPlay={true}
            autoPlayInterval={5000}
            className="w-full overflow-hidden shadow-xl"
            containerHeight="min-h-[120px] aspect-[3/1] sm:aspect-auto sm:min-h-[200px] sm:h-[260px] md:h-[300px]"
            mobileContain={true}
          />
        </div>
      </section>

      {/* Two Cards: New/Spare Cylinder & Refill/Exchange */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-white to-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {/* Card 1: New / Spare Cylinder */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-[#12d6fa]/30 group">
              <div className="relative h-48 md:h-56 bg-slate-50 flex items-center justify-center p-6">
                <Image
                  src={getAppImageUrl(ASSETS.newCylinders)}
                  alt={t("cylinders.cardNew.imageAlt")}
                  width={220}
                  height={180}
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-6 md:p-8 text-center">
                <h2
                  className={`text-xl md:text-2xl font-bold text-gray-900 mb-3 ${isRTL ? "font-cairo" : "font-montserrat"}`}
                >
                  {t("cylinders.cardNew.title")}
                </h2>
                <p
                  className={`text-sm md:text-base text-gray-600 mb-4 leading-relaxed ${isRTL ? "font-noto-arabic" : "font-noto-sans"}`}
                >
                  {t("cylinders.cardNew.description")}
                </p>
                <p className="text-lg md:text-xl font-bold text-gray-900 mb-6">
                  <SaudiRiyal amount={175} size="md" />
                </p>
                <Link href={`${prefix}/shop/co2-cylinders`}>
                  <Button className="w-full sm:w-auto bg-[#12d6fa] hover:bg-[#0bc4e8] text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-md hover:scale-105">
                    {t("cylinders.cardNew.shopNow")}
                    <ArrowRight className={`w-4 h-4 ${isRTL ? "mr-2 rotate-180" : "ml-2"}`} />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Card 2: Refill / Exchange Cylinder */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-[#12d6fa]/30 group">
              <div className="relative h-48 md:h-56 bg-slate-50 flex items-center justify-center p-6">
                <Image
                  src={getAppImageUrl(ASSETS.refillCylinders)}
                  alt={t("cylinders.cardRefill.imageAlt")}
                  width={220}
                  height={180}
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-6 md:p-8 text-center">
                <h2
                  className={`text-xl md:text-2xl font-bold text-gray-900 mb-3 ${isRTL ? "font-cairo" : "font-montserrat"}`}
                >
                  {t("cylinders.cardRefill.title")}
                </h2>
                <p
                  className={`text-sm md:text-base text-gray-600 mb-4 leading-relaxed ${isRTL ? "font-noto-arabic" : "font-noto-sans"}`}
                >
                  {t("cylinders.cardRefill.description")}
                </p>
                <p className="text-lg md:text-xl font-bold text-gray-900 mb-6">
                  <SaudiRiyal amount={65} size="md" />
                </p>
                <Link href={`${prefix}/refill-cylinder`}>
                  <Button className="w-full sm:w-auto bg-[#12d6fa] hover:bg-[#0bc4e8] text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-md hover:scale-105">
                    {t("cylinders.cardRefill.shopNow")}
                    <ArrowRight className={`w-4 h-4 ${isRTL ? "mr-2 rotate-180" : "ml-2"}`} />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Effortless sparkling - 4 icon + text blocks */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2
            className={`text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10 md:mb-12 ${isRTL ? "font-cairo" : "font-montserrat"}`}
          >
            {t("cylinders.effortless.title")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-4">
                <Image src={getAppImageUrl(ASSETS.clockIcon)} alt="" width={64} height={64} className="object-contain text-[#12d6fa]" role="presentation" />
              </div>
              <p className={`text-sm md:text-base text-gray-700 font-medium ${isRTL ? "font-noto-arabic" : "font-noto-sans"}`}>
                {t("cylinders.effortless.quickRefill")}
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-4">
                <Image src={getAppImageUrl(ASSETS.bottleIcon)} alt="" width={64} height={64} className="object-contain" role="presentation" />
              </div>
              <p className={`text-sm md:text-base text-gray-700 font-medium ${isRTL ? "font-noto-arabic" : "font-noto-sans"}`}>
                {t("cylinders.effortless.spareCylinder")}
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-4">
                <Image src={getAppImageUrl(ASSETS.verifiedIcon)} alt="" width={64} height={64} className="object-contain" role="presentation" />
              </div>
              <p className={`text-sm md:text-base text-gray-700 font-medium ${isRTL ? "font-noto-arabic" : "font-noto-sans"}`}>
                {t("cylinders.effortless.foodGrade")}
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-4">
                <Image src={getAppImageUrl(ASSETS.recycleIcon)} alt="" width={64} height={64} className="object-contain" role="presentation" />
              </div>
              <p className={`text-sm md:text-base text-gray-700 font-medium ${isRTL ? "font-noto-arabic" : "font-noto-sans"}`}>
                {t("cylinders.effortless.ecoFriendly")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Banner - Exchange Made Simple (6x2 grid: text + button | image) */}
      <section className="py-12 md:py-16 bg-slate-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center rounded-3xl bg-white border border-gray-200 shadow-sm p-8 md:p-10 lg:p-12">
            <div className={`flex flex-col ${isRTL ? "lg:order-2 lg:items-end lg:text-right" : "lg:order-1"}`}>
              <h2
                className={`text-2xl md:text-3xl font-bold text-gray-900 mb-4 ${isRTL ? "font-cairo" : "font-montserrat"}`}
              >
                {t("cylinders.exchangeBanner.title")}
              </h2>
              <p
                className={`text-gray-600 text-base md:text-lg leading-relaxed mb-6 ${isRTL ? "font-noto-arabic" : "font-noto-sans"}`}
              >
                {t("cylinders.exchangeBanner.description")}
              </p>
              <Link href={`${prefix}/refill-cylinder`}>
                <Button className="bg-[#12d6fa] hover:bg-[#0bc4e8] text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-md hover:scale-105">
                  {t("cylinders.exchangeBanner.shopNow")}
                  <ArrowRight className={`w-4 h-4 ${isRTL ? "mr-2 rotate-180" : "ml-2"}`} />
                </Button>
              </Link>
            </div>
            <div className={`flex items-center justify-center ${isRTL ? "lg:order-1" : "lg:order-2"}`}>
              <Image
                src={getAppImageUrl(ASSETS.exchangeBottles)}
                alt={t("cylinders.exchangeBanner.imageAlt")}
                width={400}
                height={280}
                className="object-contain w-full max-w-md"
              />
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
