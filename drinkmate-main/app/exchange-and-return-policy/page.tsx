"use client"

import PageLayout from "@/components/layout/PageLayout"
import { useTranslation } from "@/lib/contexts/translation-context"
import {
  FileText,
  BookOpen,
  Scale,
  UserCheck,
  Users,
  ShoppingCart,
  CreditCard,
  Truck,
  RefreshCw,
  Key,
  Shield,
  Palette,
  AlertTriangle,
  HandCoins,
  Link2,
  Clock,
  ArrowRightLeft,
  Gavel,
  FileEdit,
  Languages,
  FileCheck,
  Lock,
} from "lucide-react"

export default function ExchangeAndReturnPolicyPage() {
  const { t, getValue, isRTL } = useTranslation()

  const sectionClass = "bg-white rounded-2xl p-8 shadow-lg"
  const headingClass = `text-2xl font-bold text-gray-900 mb-4 flex items-center ${isRTL ? "font-cairo" : "font-montserrat"}`
  const proseClass = `prose prose-lg text-gray-600 ${isRTL ? "font-noto-arabic" : "font-noto-sans"}`
  const iconClass = "w-6 h-6 text-[#12d6fa] mr-3"

  const defItems = (getValue("exchangeAndReturnPolicy.sections.definitions.items") as string[] | undefined) ?? []
  const legalLimitsItems = (getValue("exchangeAndReturnPolicy.sections.legalLimits.items") as string[] | undefined) ?? []
  const legalCapacityItems = (getValue("exchangeAndReturnPolicy.sections.legalCapacity.items") as string[] | undefined) ?? []
  const membershipItems = (getValue("exchangeAndReturnPolicy.sections.membershipPolicy.items") as string[] | undefined) ?? []
  const membershipItems2 = (getValue("exchangeAndReturnPolicy.sections.membershipPolicy.items2") as string[] | undefined) ?? []
  const purchaseItems = (getValue("exchangeAndReturnPolicy.sections.purchasePolicy.items") as string[] | undefined) ?? []
  const purchaseSubItems = (getValue("exchangeAndReturnPolicy.sections.purchasePolicy.subItems") as string[] | undefined) ?? []
  const pricesItems = (getValue("exchangeAndReturnPolicy.sections.pricesAndTaxes.items") as string[] | undefined) ?? []
  const paymentItems = (getValue("exchangeAndReturnPolicy.sections.paymentPolicy.items") as string[] | undefined) ?? []
  const shippingItems = (getValue("exchangeAndReturnPolicy.sections.shippingPolicy.items") as string[] | undefined) ?? []
  const cancellationItems = (getValue("exchangeAndReturnPolicy.sections.cancellationAndReturns.items") as string[] | undefined) ?? []
  const useLicensesItems = (getValue("exchangeAndReturnPolicy.sections.useLicenses.items") as string[] | undefined) ?? []
  const useLicensesItemsNot = (getValue("exchangeAndReturnPolicy.sections.useLicenses.itemsNot") as string[] | undefined) ?? []
  const securityItems = (getValue("exchangeAndReturnPolicy.sections.securityProtection.items") as string[] | undefined) ?? []
  const disclaimerItems = (getValue("exchangeAndReturnPolicy.sections.disclaimer.items") as string[] | undefined) ?? []

  return (
    <PageLayout currentPage="exchange-and-return-policy">
      <div className="min-h-screen bg-gradient-to-b from-white to-[#f3f3f3] py-16" dir={isRTL ? "rtl" : "ltr"}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#12d6fa] rounded-full mb-6">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h1 className={`text-4xl md:text-5xl font-bold text-gray-900 mb-4 ${isRTL ? "font-cairo" : "font-montserrat"}`}>
              {t("exchangeAndReturnPolicy.hero.title")}
            </h1>
            <p className={`text-xl text-gray-600 max-w-2xl mx-auto ${isRTL ? "font-noto-arabic" : "font-noto-sans"}`}>
              {t("exchangeAndReturnPolicy.hero.subtitle")}
            </p>
            <div className="w-24 h-1 bg-[#a8f387] mx-auto mt-6 rounded-full" />
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg mb-12">
            <div className="flex items-center space-x-3 text-gray-600">
              <Lock className="w-5 h-5" />
              <span className={`font-medium ${isRTL ? "font-noto-arabic" : "font-noto-sans"}`}>
                {t("exchangeAndReturnPolicy.hero.lastUpdated")}
              </span>
            </div>
          </div>

          <div className="space-y-12">
            <div className={sectionClass}>
              <h2 className={headingClass}>
                <BookOpen className={iconClass} />
                {t("exchangeAndReturnPolicy.sections.introduction.title")}
              </h2>
              <div className={proseClass}>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.introduction.p1")}</p>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.introduction.p2")}</p>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.introduction.p3")}</p>
              </div>
            </div>

            <div className={sectionClass}>
              <h2 className={headingClass}>
                <FileText className={iconClass} />
                {t("exchangeAndReturnPolicy.sections.definitions.title")}
              </h2>
              <div className={proseClass}>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.definitions.intro")}</p>
                <ul className="list-disc pl-6 space-y-2">
                  {defItems.map((item, i) => (
                    <li key={i} className="whitespace-pre-wrap">{item.replace(/\*\*/g, "")}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={sectionClass}>
              <h2 className={headingClass}>
                <Scale className={iconClass} />
                {t("exchangeAndReturnPolicy.sections.legalLimits.title")}
              </h2>
              <div className={proseClass}>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.legalLimits.p1")}</p>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.legalLimits.p2")}</p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  {legalLimitsItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.legalLimits.p3")}</p>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.legalLimits.p4")}</p>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.legalLimits.p5")}</p>
              </div>
            </div>

            <div className={sectionClass}>
              <h2 className={headingClass}>
                <UserCheck className={iconClass} />
                {t("exchangeAndReturnPolicy.sections.legalCapacity.title")}
              </h2>
              <div className={proseClass}>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.legalCapacity.p1")}</p>
                <ul className="list-disc pl-6 space-y-2">
                  {legalCapacityItems.map((item, i) => (
                    <li key={i}>{item.replace(/\*\*/g, "")}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={sectionClass}>
              <h2 className={headingClass}>
                <Users className={iconClass} />
                {t("exchangeAndReturnPolicy.sections.membershipPolicy.title")}
              </h2>
              <div className={proseClass}>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.membershipPolicy.p1")}</p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  {membershipItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.membershipPolicy.p2")}</p>
                <ul className="list-disc pl-6 space-y-2">
                  {membershipItems2.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={sectionClass}>
              <h2 className={headingClass}>
                <ShoppingCart className={iconClass} />
                {t("exchangeAndReturnPolicy.sections.purchasePolicy.title")}
              </h2>
              <div className={proseClass}>
                <ul className="list-disc pl-6 space-y-2">
                  {purchaseItems.map((item, i) => (
                    <li key={i}>
                      {item}
                      {item.includes("may not be accepted for the following reasons") && (
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                          {purchaseSubItems.map((sub, j) => (
                            <li key={j}>{sub}</li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={sectionClass}>
              <h2 className={headingClass}>
                <CreditCard className={iconClass} />
                {t("exchangeAndReturnPolicy.sections.pricesAndTaxes.title")}
              </h2>
              <div className={proseClass}>
                <ul className="list-disc pl-6 space-y-2">
                  {pricesItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={sectionClass}>
              <h2 className={headingClass}>
                <CreditCard className={iconClass} />
                {t("exchangeAndReturnPolicy.sections.paymentPolicy.title")}
              </h2>
              <div className={proseClass}>
                <ul className="list-disc pl-6 space-y-2">
                  {paymentItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={sectionClass}>
              <h2 className={headingClass}>
                <Truck className={iconClass} />
                {t("exchangeAndReturnPolicy.sections.shippingPolicy.title")}
              </h2>
              <div className={proseClass}>
                <ul className="list-disc pl-6 space-y-2">
                  {shippingItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={sectionClass}>
              <h2 className={headingClass}>
                <RefreshCw className={iconClass} />
                {t("exchangeAndReturnPolicy.sections.cancellationAndReturns.title")}
              </h2>
              <div className={proseClass}>
                <ul className="list-disc pl-6 space-y-2">
                  {cancellationItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={sectionClass}>
              <h2 className={headingClass}>
                <Key className={iconClass} />
                {t("exchangeAndReturnPolicy.sections.useLicenses.title")}
              </h2>
              <div className={proseClass}>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.useLicenses.p1")}</p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  {useLicensesItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p className="mb-2 font-semibold">You may not:</p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  {useLicensesItemsNot.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.useLicenses.p2")}</p>
              </div>
            </div>

            <div className={sectionClass}>
              <h2 className={headingClass}>
                <Shield className={iconClass} />
                {t("exchangeAndReturnPolicy.sections.securityProtection.title")}
              </h2>
              <div className={proseClass}>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.securityProtection.p1")}</p>
                <ul className="list-disc pl-6 space-y-2">
                  {securityItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={sectionClass}>
              <h2 className={headingClass}>
                <Palette className={iconClass} />
                {t("exchangeAndReturnPolicy.sections.intellectualProperty.title")}
              </h2>
              <div className={proseClass}>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.intellectualProperty.p1")}</p>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.intellectualProperty.p2")}</p>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.intellectualProperty.p3")}</p>
              </div>
            </div>

            <div className={sectionClass}>
              <h2 className={headingClass}>
                <AlertTriangle className={iconClass} />
                {t("exchangeAndReturnPolicy.sections.disclaimer.title")}
              </h2>
              <div className={proseClass}>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.disclaimer.p1")}</p>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.disclaimer.p2")}</p>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.disclaimer.p3")}</p>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.disclaimer.p4")}</p>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.disclaimer.p5")}</p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  {disclaimerItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.disclaimer.p6")}</p>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.disclaimer.p7")}</p>
              </div>
            </div>

            <div className={sectionClass}>
              <h2 className={headingClass}>
                <HandCoins className={iconClass} />
                {t("exchangeAndReturnPolicy.sections.compensation.title")}
              </h2>
              <div className={proseClass}>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.compensation.p1")}</p>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.compensation.p2")}</p>
              </div>
            </div>

            <div className={sectionClass}>
              <h2 className={headingClass}>
                <Link2 className={iconClass} />
                {t("exchangeAndReturnPolicy.sections.linksToSites.title")}
              </h2>
              <div className={proseClass}>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.linksToSites.p1")}</p>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.linksToSites.p2")}</p>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.linksToSites.p3")}</p>
              </div>
            </div>

            <div className={sectionClass}>
              <h2 className={headingClass}>
                <Clock className={iconClass} />
                {t("exchangeAndReturnPolicy.sections.termAndTermination.title")}
              </h2>
              <div className={proseClass}>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.termAndTermination.p1")}</p>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.termAndTermination.p2")}</p>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.termAndTermination.p3")}</p>
              </div>
            </div>

            <div className={sectionClass}>
              <h2 className={headingClass}>
                <ArrowRightLeft className={iconClass} />
                {t("exchangeAndReturnPolicy.sections.transferOfRights.title")}
              </h2>
              <div className={proseClass}>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.transferOfRights.p1")}</p>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.transferOfRights.p2")}</p>
              </div>
            </div>

            <div className={sectionClass}>
              <h2 className={headingClass}>
                <Gavel className={iconClass} />
                {t("exchangeAndReturnPolicy.sections.applicableLaw.title")}
              </h2>
              <div className={proseClass}>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.applicableLaw.p1")}</p>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.applicableLaw.p2")}</p>
              </div>
            </div>

            <div className={sectionClass}>
              <h2 className={headingClass}>
                <FileEdit className={iconClass} />
                {t("exchangeAndReturnPolicy.sections.modifications.title")}
              </h2>
              <div className={proseClass}>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.modifications.p1")}</p>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.modifications.p2")}</p>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.modifications.p3")}</p>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.modifications.p4")}</p>
              </div>
            </div>

            <div className={sectionClass}>
              <h2 className={headingClass}>
                <Languages className={iconClass} />
                {t("exchangeAndReturnPolicy.sections.theLanguage.title")}
              </h2>
              <div className={proseClass}>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.theLanguage.p1")}</p>
              </div>
            </div>

            <div className={sectionClass}>
              <h2 className={headingClass}>
                <FileCheck className={iconClass} />
                {t("exchangeAndReturnPolicy.sections.fullAgreement.title")}
              </h2>
              <div className={proseClass}>
                <p className="mb-4">{t("exchangeAndReturnPolicy.sections.fullAgreement.p1")}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border-t border-gray-100">
              <p className={`text-sm text-gray-500 italic ${isRTL ? "font-noto-arabic" : "font-noto-sans"}`}>
                {t("exchangeAndReturnPolicy.sections.rightsReserved")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
