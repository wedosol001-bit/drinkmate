"use client"
import { CylindersShopSection } from "@/components/sections/CylindersShopSection"
import PageLayout from "@/components/layout/PageLayout"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/contexts/translation-context"
import { getBannerSrc } from "@/lib/utils/banner-paths"

const faqCards = [
  {
    id: 1,
    question: "How do I exchange my empty CO2 cylinder?",
    answer:
      "Simply bring your empty cylinder to one of our partner locations or order an exchange online. You'll receive a full one instantly.",
  },
  {
    id: 2,
    question: "How long does delivery take?",
    answer:
      "Delivery typically takes 1–2 business days depending on your location. Same-day service is available in select areas.",
  },
  {
    id: 3,
    question: "Are your CO2 cylinders safe?",
    answer:
      "Yes. All of our CO2 cylinders go through strict quality checks and meet international safety standards before being refilled and reused.",
  },
  {
    id: 4,
    question: "How many liters of soda can one cylinder make?",
    answer:
      "On average, one 60L CO2 cylinder can carbonate up to 60 liters of sparkling water depending on your preferred level of carbonation.",
  },
]

const benefits = [
  {
    id: 1,
    title: "Fast Service",
    description: "Quick refill and exchange",
    icon: (
      <svg className="w-7 h-7 text-[#12d6fa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Cost Effective",
    description: "Save money with our exchange program",
    icon: (
      <svg className="w-7 h-7 text-[#12d6fa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
        />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Quality Assured",
    description: "Premium CO2 with safety guarantee",
    icon: (
      <svg className="w-7 h-7 text-[#12d6fa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    id: 4,
    title: "24/7 Support",
    description: "Always here when you need us",
    icon: (
      <svg className="w-7 h-7 text-[#12d6fa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z"
        />
      </svg>
    ),
  },
]

export default function CO2() {
  const { isRTL, t, language } = useTranslation()

  return (
    <PageLayout currentPage="shop">
      {/* CO2 banner - containerized like refill and other category pages */}
      <section className="py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div
            className="relative w-full min-h-[120px] aspect-[3/1] sm:aspect-auto sm:min-h-[200px] sm:h-[260px] md:h-[300px] lg:h-[320px] max-h-[360px] overflow-hidden shadow-xl bg-no-repeat bg-center bg-contain sm:bg-cover"
            style={{
              backgroundImage: `url(${getBannerSrc("co2", { lang: language })})`,
              backgroundRepeat: 'no-repeat',
            }}
            role="img"
            aria-label={t("shop.co2BannerHeading")}
          />
        </div>
      </section>

      {/* Shop CO2 Cylinders Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-[#f3f3f3]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <CylindersShopSection type="all" />
        </div>
      </section>

      {/* Exchange Cylinders Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black font-montserrat mb-3 sm:mb-4 tracking-tight">
              {isRTL ? 'أسطوانات الاستبدال' : 'Exchange Cylinders'}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 font-noto-sans max-w-2xl mx-auto">
              {isRTL ? 'خدمة استبدال الأسطوانات بسرعة وسهولة' : 'Quick and easy cylinder exchange service'}
            </p>
            <div className="pt-6">
              <Link href="/refill-cylinder">
                <Button className="bg-[#12d6fa] hover:bg-[#0bc4e8] text-white font-bold px-8 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105">
                  {isRTL ? 'اذهب إلى صفحة إعادة التعبئة' : 'Go to Refill Page'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    
      {/* FAQ Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <header className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <h2 className="font-bold text-black text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4 tracking-tight">{isRTL ? 'الأسئلة الشائعة عن الأسطوانات' : 'Cylinders FAQ'}</h2>
            <p className="font-semibold text-black text-base sm:text-lg md:text-xl">{isRTL ? 'كل الإجابات على أسئلتك حول الأسطوانات' : 'All the answers to your cylinders questions'}</p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {faqCards.map((card) => (
              <div
                key={card.id}
                className="bg-white rounded-2xl p-4 sm:p-6 flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-gray-100"
              >
                <h3 className="text-base sm:text-lg font-bold text-black mb-2 sm:mb-3 tracking-tight">{isRTL ?
                  (
                    card.id === 1 ? 'كيف أستبدل أسطوانة CO2 الفارغة؟' :
                    card.id === 2 ? 'كم يستغرق وقت التوصيل؟' :
                    card.id === 3 ? 'هل أسطوانات CO2 لديكم آمنة؟' :
                    'كم لتراً من الصودا يمكن أن تصنعها الأسطوانة الواحدة؟'
                  ) : card.question}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{isRTL ? (
                  card.id === 1 ? 'أحضر أسطوانتك الفارغة إلى أحد مواقع شركائنا أو اطلب الاستبدال عبر الإنترنت. ستحصل على واحدة ممتلئة فوراً.' :
                  card.id === 2 ? 'عادةً ما يستغرق التوصيل من 1 إلى 2 يوم عمل حسب موقعك. تتوفر خدمة نفس اليوم في مناطق محددة.' :
                  card.id === 3 ? 'نعم. تمر جميع أسطوانات CO2 لدينا بفحوصات جودة صارمة وتلبي معايير السلامة الدولية قبل إعادة التعبئة وإعادة الاستخدام.' :
                  'في المتوسط، يمكن لأسطوانة CO2 سعة 60 لتراً تكربن حتى 60 لتراً من الماء الفوار حسب مستوى التكربن الذي تفضله.'
                ) : card.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </PageLayout>
  )
}
