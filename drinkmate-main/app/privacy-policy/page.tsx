"use client"

import PageLayout from "@/components/layout/PageLayout"
import { Shield, Lock, Database, UserCheck, Share2, HardDrive, LockKeyhole, Scale, UserCog, Link2, Baby, FileEdit, Mail } from "lucide-react"
import { useTranslation } from "@/lib/contexts/translation-context"

export default function PrivacyPolicy() {
  const { t, getValue, isRTL } = useTranslation()

  const sectionClass = "bg-white rounded-2xl p-8 shadow-lg"
  const headingClass = `text-2xl font-bold text-gray-900 mb-4 flex items-center ${isRTL ? 'font-cairo' : 'font-montserrat'}`
  const proseClass = `prose prose-lg text-gray-600 ${isRTL ? 'font-noto-arabic' : 'font-noto-sans'}`
  const iconClass = "w-6 h-6 text-[#12d6fa] mr-3"

  const dataCollectionItems = (getValue("privacyPolicy.sections.dataCollection.items") as string[] | undefined) ?? []
  const limitsOnUseItems = (getValue("privacyPolicy.sections.limitsOnUse.items") as string[] | undefined) ?? []
  const dataSharingItems = (getValue("privacyPolicy.sections.dataSharing.items") as string[] | undefined) ?? []
  const dataProtectionItems = (getValue("privacyPolicy.sections.dataProtection.items") as string[] | undefined) ?? []

  return (
    <PageLayout currentPage="privacy-policy">
      <div className="min-h-screen bg-gradient-to-b from-white to-[#f3f3f3] py-16" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#12d6fa] rounded-full mb-6">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className={`text-4xl md:text-5xl font-bold text-gray-900 mb-4 ${isRTL ? 'font-cairo' : 'font-montserrat'}`}>
              {t('privacyPolicy.hero.title')}
            </h1>
            <p className={`text-xl text-gray-600 max-w-2xl mx-auto ${isRTL ? 'font-noto-arabic' : 'font-noto-sans'}`}>
              {t('privacyPolicy.hero.subtitle')}
            </p>
            <div className="w-24 h-1 bg-[#a8f387] mx-auto mt-6 rounded-full"></div>
          </div>

          {/* Last Updated */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-12">
            <div className="flex items-center space-x-3 text-gray-600">
              <Lock className="w-5 h-5" />
              <span className={`font-medium ${isRTL ? 'font-noto-arabic' : 'font-noto-sans'}`}>{t('privacyPolicy.hero.lastUpdated')}</span>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-12">
            {/* Introduction */}
            <div className={sectionClass}>
              <h2 className={headingClass}>
                <Database className={iconClass} />
                {t('privacyPolicy.sections.introduction.title')}
              </h2>
              <div className={proseClass}>
                <p className="mb-4">{t('privacyPolicy.sections.introduction.p1')}</p>
                <p className="mb-4">{t('privacyPolicy.sections.introduction.p2')}</p>
                <p className="mb-4">{t('privacyPolicy.sections.introduction.p3')}</p>
              </div>
            </div>

            {/* Data Collection */}
            <div className={sectionClass}>
              <h2 className={headingClass}>
                <Database className={iconClass} />
                {t('privacyPolicy.sections.dataCollection.title')}
              </h2>
              <div className={proseClass}>
                <p className="mb-4">{t('privacyPolicy.sections.dataCollection.intro')}</p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  {dataCollectionItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p className="mb-4">{t('privacyPolicy.sections.dataCollection.note')}</p>
              </div>
            </div>

            {/* Limits on the use of your data */}
            <div className={sectionClass}>
              <h2 className={headingClass}>
                <UserCheck className={iconClass} />
                {t('privacyPolicy.sections.limitsOnUse.title')}
              </h2>
              <div className={proseClass}>
                <p className="mb-4">{t('privacyPolicy.sections.limitsOnUse.intro')}</p>
                <ul className="list-disc pl-6 space-y-2">
                  {limitsOnUseItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Data Sharing */}
            <div className={sectionClass}>
              <h2 className={headingClass}>
                <Share2 className={iconClass} />
                {t('privacyPolicy.sections.dataSharing.title')}
              </h2>
              <div className={proseClass}>
                <p className="mb-4">{t('privacyPolicy.sections.dataSharing.intro')}</p>
                <ul className="list-disc pl-6 space-y-2">
                  {dataSharingItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Data Storage */}
            <div className={sectionClass}>
              <h2 className={headingClass}>
                <HardDrive className={iconClass} />
                {t('privacyPolicy.sections.dataStorage.title')}
              </h2>
              <div className={proseClass}>
                <p className="mb-4">{t('privacyPolicy.sections.dataStorage.p1')}</p>
              </div>
            </div>

            {/* Data protection and security */}
            <div className={sectionClass}>
              <h2 className={headingClass}>
                <LockKeyhole className={iconClass} />
                {t('privacyPolicy.sections.dataProtection.title')}
              </h2>
              <div className={proseClass}>
                <p className="mb-4">{t('privacyPolicy.sections.dataProtection.intro')}</p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  {dataProtectionItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p className="mb-4">{t('privacyPolicy.sections.dataProtection.note')}</p>
              </div>
            </div>

            {/* Compliance and cooperation with regulators */}
            <div className={sectionClass}>
              <h2 className={headingClass}>
                <Scale className={iconClass} />
                {t('privacyPolicy.sections.compliance.title')}
              </h2>
              <div className={proseClass}>
                <p className="mb-4">{t('privacyPolicy.sections.compliance.p1')}</p>
              </div>
            </div>

            {/* Your responsibilities */}
            <div className={sectionClass}>
              <h2 className={headingClass}>
                <UserCog className={iconClass} />
                {t('privacyPolicy.sections.yourResponsibilities.title')}
              </h2>
              <div className={proseClass}>
                <p className="mb-4">{t('privacyPolicy.sections.yourResponsibilities.p1')}</p>
                <p className="mb-4">{t('privacyPolicy.sections.yourResponsibilities.p2')}</p>
              </div>
            </div>

            {/* Third Party Links */}
            <div className={sectionClass}>
              <h2 className={headingClass}>
                <Link2 className={iconClass} />
                {t('privacyPolicy.sections.thirdPartyLinks.title')}
              </h2>
              <div className={proseClass}>
                <p className="mb-4">{t('privacyPolicy.sections.thirdPartyLinks.p1')}</p>
                <p className="mb-4">{t('privacyPolicy.sections.thirdPartyLinks.p2')}</p>
                <p className="mb-4">{t('privacyPolicy.sections.thirdPartyLinks.p3')}</p>
                <p className="mb-4">{t('privacyPolicy.sections.thirdPartyLinks.p4')}</p>
              </div>
            </div>

            {/* Children's privacy */}
            <div className={sectionClass}>
              <h2 className={headingClass}>
                <Baby className={iconClass} />
                {t('privacyPolicy.sections.childrenPrivacy.title')}
              </h2>
              <div className={proseClass}>
                <p className="mb-4">{t('privacyPolicy.sections.childrenPrivacy.p1')}</p>
                <p className="mb-4">{t('privacyPolicy.sections.childrenPrivacy.p2')}</p>
              </div>
            </div>

            {/* Modifications */}
            <div className={sectionClass}>
              <h2 className={headingClass}>
                <FileEdit className={iconClass} />
                {t('privacyPolicy.sections.modifications.title')}
              </h2>
              <div className={proseClass}>
                <p className="mb-4">{t('privacyPolicy.sections.modifications.p1')}</p>
                <p className="mb-4">{t('privacyPolicy.sections.modifications.p2')}</p>
                <p className="mb-4">{t('privacyPolicy.sections.modifications.p3')}</p>
              </div>
            </div>

            {/* Contact us */}
            <div className={sectionClass}>
              <h2 className={headingClass}>
                <Mail className={iconClass} />
                {t('privacyPolicy.sections.contactUs.title')}
              </h2>
              <div className={proseClass}>
                <p className="mb-4">{t('privacyPolicy.sections.contactUs.intro')}</p>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p><strong>{t('privacyPolicy.sections.contactUs.emailLabel')}</strong> {t('privacyPolicy.sections.contactUs.email')}</p>
                  <p><strong>{t('privacyPolicy.sections.contactUs.phoneLabel')}</strong> {t('privacyPolicy.sections.contactUs.phone')}</p>
                </div>
                <p className="mb-4">{t('privacyPolicy.sections.contactUs.acknowledgment')}</p>
                <p className="text-sm text-gray-500 italic">{t('privacyPolicy.sections.contactUs.rightsReserved')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
