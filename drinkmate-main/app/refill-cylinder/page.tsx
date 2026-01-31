"use client"

import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, Plus, Minus, ChevronDown, Star, ShoppingCart, Info, Truck, Shield, RotateCcw, CheckCircle, ArrowRight, Gift } from "lucide-react"
import PageLayout from "@/components/layout/PageLayout"
import { useTranslation } from "@/lib/contexts/translation-context"
import { useState, useEffect } from "react"
import { useCart } from "@/lib/contexts/cart-context"
import { co2API } from "@/lib/api"
import SaudiRiyal from "@/components/ui/SaudiRiyal"
import CylinderCard from "@/components/refill/CylinderCard"
import OrderSummary from "@/components/refill/OrderSummary"
import QuantityControl from "@/components/refill/QuantityControl"
import { useIsMobile } from "@/hooks/use-mobile"
import { toast } from "sonner"
import styles from "./refill-cylinder.module.css"

// Type definition for refill slides
interface RefillSlide {
  headline: string;
  description: string;
  buttonText: string;
  offerText: string;
  image?: string; // Optional image URL
}

export default function CO2() {
  const { t, isRTL } = useTranslation()
  const { addItem } = useCart()

  // Slideshow state (same as shop page)
  const refillSlides: RefillSlide[] = [
    {
      headline: t("home.refill.title"),
      description: t("home.refill.description"),
      buttonText: t("home.refill.buttonText"),
      offerText: t("home.refill.offerText"),
    },
    {
      headline: t("banner.messages.colaFlavors"),
      description: "Enjoy authentic taste with our new collection of premium Italian flavors.",
      buttonText: "",
      offerText: "",
    },
    {
      headline: t("banner.messages.firstOrderDiscount"),
      description: "Want to get into the bubble game? Enjoy 5% off your first order with Drinkmate.",
      buttonText: "",
      offerText: "",
    },
    {
      headline: "",
      description: "",
      buttonText: "",
      offerText: "",
      image: "/images/banner/Web--Cylinder--Page (1).png",
    },
  ]

  const [currentRefillSlide, setCurrentRefillSlide] = useState(0)
  const [selectedCylinder, setSelectedCylinder] = useState("drinkmate")
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("faqs")
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  // New state for button functionality (Drinkmate default so mobile UI is always active)
  const [showBlocks, setShowBlocks] = useState(true)
  const [cylinderType, setCylinderType] = useState("drinkmate") // "drinkmate" or "non-drinkmate"
  const [nonDrinkmateBrand, setNonDrinkmateBrand] = useState("")
  const [threadType, setThreadType] = useState<"standard-threaded" | "quick-connect" | "">("") // Thread type for non-drinkmate
  const [customBrandName, setCustomBrandName] = useState("") // Custom brand name for standard threaded

  // Slideshow navigation - reverse for RTL
  const nextRefillSlide = () => {
    if (isRTL) {
      setCurrentRefillSlide((prev) => (prev === 0 ? refillSlides.length - 1 : prev - 1))
    } else {
      setCurrentRefillSlide((prev) => (prev === refillSlides.length - 1 ? 0 : prev + 1))
    }
  }

  const prevRefillSlide = () => {
    if (isRTL) {
      setCurrentRefillSlide((prev) => (prev === refillSlides.length - 1 ? 0 : prev + 1))
    } else {
      setCurrentRefillSlide((prev) => (prev === 0 ? refillSlides.length - 1 : prev - 1))
    }
  }

  // State for cylinders from API
  const [cylinderBrands, setCylinderBrands] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  // Fetch cylinders from API
  useEffect(() => {
    const fetchCylinders = async () => {
      try {
        setLoading(true)
        setApiError(null)

        // Check if we're online
        const isOnline = typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
          ? navigator.onLine
          : true;

        if (!isOnline) {
          console.warn('Device appears to be offline, will use fallback data');
        }

        // Use refill API for consistency with admin panel
        const response = await fetch('/api/refill/cylinders', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          // Transform API data to match the expected format
          const transformedCylinders = data.cylinders.map((cylinder: any) => ({
            id: cylinder._id || cylinder.id, // Handle both API and fallback data
            name: cylinder.name,
            image: cylinder.image,
            price: cylinder.price,
            originalPrice: cylinder.originalPrice,
            discount: cylinder.discount,
            compatible: true,
            description: cylinder.description,
            brand: cylinder.brand,
            type: cylinder.type,
            capacity: cylinder.capacity
          }))
          setCylinderBrands(transformedCylinders)

          // Log when using fallback data
          if (data.message?.includes('fallback')) {
            console.info('Using fallback cylinder data:', data.message);
          }
        } else {
          console.error('Failed to fetch cylinders:', data.message);
          setApiError('Could not retrieve cylinder information. Please try again later.');
        }
      } catch (error: any) {
        console.error('Error fetching cylinders:', error);
        setApiError(`Error loading cylinder data: ${error.message || 'Unknown error'}`);

        // Auto-retry once after a short delay for network errors
        if (retryCount === 0 && (!error.response || error.message === 'Network Error')) {
          setRetryCount(prev => prev + 1);
          setTimeout(() => {
            fetchCylinders();
          }, 3000);
        }
      } finally {
        setLoading(false)
      }
    }

    fetchCylinders()
  }, [retryCount])

  // Get selected cylinder data
  const getCylinderData = (cylinderId: string) => {
    // Handle Quick connect
    if (cylinderId === "quick-connect") {
      return {
        id: "quick-connect",
        name: "Quick connect",
        price: 99,
        originalPrice: 99,
        discount: 0,
        description: "Quick connect CO2 cylinder refill",
        brand: "Quick connect",
        type: "refill",
        capacity: "60L"
      }
    }

    // Handle custom brand name for standard threaded
    if (cylinderId === "custom-brand" && customBrandName.trim()) {
      return {
        id: "custom-brand",
        name: customBrandName.trim(),
        price: 75,
        originalPrice: 75,
        discount: 0,
        description: `${customBrandName.trim()} CO2 cylinder refill`,
        brand: customBrandName.trim(),
        type: "refill",
        capacity: "60L"
      }
    }

    // Hardcoded cylinder data for known brands
    const cylinderDataMap: { [key: string]: any } = {
      "drinkmate": {
        id: "drinkmate",
        name: "Drinkmate",
        price: 65,
        originalPrice: 65,
        discount: 0,
        description: "Original Drinkmate CO2 cylinder refill",
        brand: "Drinkmate",
        type: "refill",
        capacity: "60L"
      },

      "sodastream": {
        id: "sodastream",
        name: "SodaStream",
        price: 72,
        originalPrice: 85,
        discount: 15,
        description: "SodaStream CO2 cylinder refill",
        brand: "SodaStream",
        type: "refill",
        capacity: "60L"
      },
      "errva": {
        id: "errva",
        name: "Errva",
        price: 68,
        originalPrice: 78,
        discount: 13,
        description: "Errva CO2 cylinder refill",
        brand: "Errva",
        type: "refill",
        capacity: "60L"
      },
      "fawwar": {
        id: "fawwar",
        name: "Fawwar",
        price: 70,
        originalPrice: 82,
        discount: 15,
        description: "Fawwar CO2 cylinder refill",
        brand: "Fawwar",
        type: "refill",
        capacity: "60L"
      },
      "phillips": {
        id: "phillips",
        name: "Phillips",
        price: 75,
        originalPrice: 90,
        discount: 17,
        description: "Phillips CO2 cylinder refill",
        brand: "Phillips",
        type: "refill",
        capacity: "60L"
      },
      "ultima-cosa": {
        id: "ultima-cosa",
        name: "Ultima Cosa",
        price: 80,
        originalPrice: 95,
        discount: 16,
        description: "Ultima Cosa CO2 cylinder refill",
        brand: "Ultima Cosa",
        type: "refill",
        capacity: "60L"
      },
      "bubble-bro": {
        id: "bubble-bro",
        name: "Bubble Bro",
        price: 73,
        originalPrice: 88,
        discount: 17,
        description: "Bubble Bro CO2 cylinder refill",
        brand: "Bubble Bro",
        type: "refill",
        capacity: "60L"
      },
      "yoco-cosa": {
        id: "yoco-cosa",
        name: "Yoco Cosa",
        price: 78,
        originalPrice: 92,
        discount: 15,
        description: "Yoco Cosa CO2 cylinder refill",
        brand: "Yoco Cosa",
        type: "refill",
        capacity: "60L"
      },
      "other-brand": {
        id: "other-brand",
        name: "Other brand cylinders",
        price: 85,
        originalPrice: 100,
        discount: 15,
        description: "Generic CO2 cylinder refill for various brand cylinders",
        brand: "Other",
        type: "refill",
        capacity: "60L"
      }
    }

    return cylinderDataMap[cylinderId] || cylinderBrands.find(brand => brand.id === cylinderId)
  }

  const selectedCylinderData = getCylinderData(selectedCylinder)

  /** Main hero image: changes when user selects Drinkmate vs Non-Drinkmate (non-Drinkmate uses same image until asset available) */
  const REFILL_MAIN_IMAGES = {
    drinkmate: "/images/refillPage/drinkmateRefill.svg",
    nonDrinkmate: "/images/refillPage/drinkmateRefill.svg",
  } as const
  const mainImageSrc = cylinderType === "drinkmate" ? REFILL_MAIN_IMAGES.drinkmate : (cylinderType === "non-drinkmate" ? REFILL_MAIN_IMAGES.nonDrinkmate : REFILL_MAIN_IMAGES.drinkmate)

  /** Free delivery when subtotal >= 150 SAR (dynamic: 3 for Drinkmate @ 65, 2 for non-Drinkmate @ 75/99) */
  const FREE_DELIVERY_THRESHOLD = 150

  // Dynamic pricing based on quantity and brand
  const getCylinderPrice = () => {
    if (!selectedCylinderData) return 65.00

    let basePrice = selectedCylinderData.price

    // Quantity discount ONLY for Drinkmate cylinders - fixed price 59 SAR for 4+
    if (selectedCylinder === "drinkmate" && quantity >= 4) {
      basePrice = 59 // Fixed price of 59 SAR per cylinder for 4+
    }

    return basePrice
  }

  const cylinderPrice = getCylinderPrice()
  const subtotal = cylinderPrice * quantity
  const deliveryCharge = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : 23.00 // Free delivery at 150+ SAR
  const total = subtotal + deliveryCharge

  /** Min cylinders needed for free delivery (derived from 150 SAR threshold and current unit price) */
  const minCylindersForFreeDelivery = Math.ceil(FREE_DELIVERY_THRESHOLD / cylinderPrice)
  const freeDeliveryActive = subtotal >= FREE_DELIVERY_THRESHOLD
  const cylindersNeededForFreeDelivery = Math.max(0, minCylindersForFreeDelivery - quantity)

  const handleAddToCart = () => {
    if (selectedCylinderData) {
      // Generate unique ID based on cylinder type
      const getCylinderId = (cylinderId: string) => {
        const idMap: { [key: string]: number } = {
          "drinkmate": 1001,
          "sodastream": 1003,
          "errva": 1004,
          "fawwar": 1005,
          "phillips": 1006,
          "ultima-cosa": 1007,
          "bubble-bro": 1008,
          "yoco-cosa": 1009,
          "other-brand": 1010,
          "quick-connect": 1011,
          "custom-brand": 1012
        }
        return idMap[cylinderId] || 9999
      }

      addItem({
        id: getCylinderId(selectedCylinder),
        name: `${selectedCylinderData.name} CO2 Cylinder Refill/Exchange`,
        price: cylinderPrice,
        quantity: quantity,
        image: selectedCylinderData.image || "/images/co2-cylinder-single.png",
        category: "co2",
      })

      // Cart toast will be shown automatically by the cart context
    }
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, quantity + change)
    setQuantity(newQuantity)
  }

  // Button handlers
  const handleDrinkmateClick = () => {
    setCylinderType("drinkmate")
    setSelectedCylinder("drinkmate")
    setThreadType("")
    setCustomBrandName("")
    setNonDrinkmateBrand("")
    setShowBlocks(true)
  }

  const handleNonDrinkmateClick = () => {
    setCylinderType("non-drinkmate")
    setThreadType("")
    setCustomBrandName("")
    setNonDrinkmateBrand("")
    setSelectedCylinder("")
    setShowBlocks(false) // Don't show blocks until thread type is selected
  }

  const handleThreadTypeChange = (type: "standard-threaded" | "quick-connect") => {
    setThreadType(type)
    if (type === "quick-connect") {
      setSelectedCylinder("quick-connect")
      setCustomBrandName("")
      setNonDrinkmateBrand("")
      setShowBlocks(true)
    } else {
      // Standard threaded - reset and wait for brand input
      setSelectedCylinder("")
      setCustomBrandName("")
      setNonDrinkmateBrand("")
      setShowBlocks(false)
    }
  }

  const handleCustomBrandChange = (brandName: string) => {
    setCustomBrandName(brandName)
    if (brandName.trim()) {
      setSelectedCylinder("custom-brand")
      setShowBlocks(true)
    } else {
      setSelectedCylinder("")
      setShowBlocks(false)
    }
  }

  if (loading) {
    return (
      <PageLayout currentPage="co2">
        <div className="flex flex-col items-center justify-center h-64 p-8">
          <div className="w-12 h-12 border-4 border-t-[#12d6fa] border-gray-200 rounded-full animate-spin mb-4"></div>
          <div className="text-lg font-medium">{t('refill.loadingTitle')}</div>
          <p className="text-gray-500 text-sm mt-2 text-center">{t('refill.loadingSubtitle')}</p>
        </div>
      </PageLayout>
    )
  }

  if (apiError && !cylinderBrands.length) {
    return (
      <PageLayout currentPage="co2">
        <div className="flex flex-col items-center justify-center h-64 p-8 max-w-md mx-auto">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Info className="w-6 h-6 text-red-500" />
          </div>
          <div className="text-lg font-medium text-center">{t('refill.errorTitle')}</div>
          <p className="text-gray-500 text-sm mt-2 text-center">{apiError}</p>
          <Button
            onClick={() => setRetryCount(prev => prev + 1)}
            className="mt-4 bg-[#12d6fa] hover:bg-[#0bc4e8] text-white"
          >
            {t('refill.retry')}
          </Button>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout currentPage="refill-cylinder">
      {/* Enhanced Refill Section Carousel */}
      <section className="py-8 md:py-16">
        <div className="max-w-7xl mx-auto bg-white border border-gray-200 rounded-3xl relative h-[280px] md:h-[320px] flex items-center justify-between px-4 md:px-6 overflow-hidden shadow-sm">
          {/* Enhanced Left Navigation Button */}
          <Button
            className="rounded-full w-12 h-12 flex items-center justify-center border-2 border-white bg-white/90 text-gray-700 shadow-sm z-10 hover:bg-white hover:border-[#12d6fa] hover:scale-110 transition-all duration-300 backdrop-blur-sm"
            onClick={prevRefillSlide}
          >
            {isRTL ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
          </Button>

          {/* Enhanced Main Content Area */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full px-0">
            {refillSlides[currentRefillSlide].image ? (
              // Image slide
              <div className="w-full h-full flex items-center justify-center">
                <Image
                  src={refillSlides[currentRefillSlide].image!}
                  alt="Banner image"
                  width={800}
                  height={320}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
            ) : (
              // Text content slide
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 px-8">
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
                    {refillSlides[currentRefillSlide].headline}
                  </h2>
                  <p className="text-gray-700 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
                    {refillSlides[currentRefillSlide].headline === t("home.refill.title") ? (
                      <>
                        {t('refill.carouselDescription.refill4').split('{amount}').map((part, i, arr) =>
                          i === arr.length - 1 ? part : (
                            <span key={i}>
                              <SaudiRiyal amount={55} size="sm" className="font-bold text-[#12d6fa]" />
                              {part}
                            </span>
                          )
                        )}
                      </>
                    ) : (
                      refillSlides[currentRefillSlide].description
                    )}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                  {refillSlides[currentRefillSlide].buttonText && (
                    <Button
                      onClick={() => window.location.href = refillSlides[currentRefillSlide].buttonText === "Shop Now" ? "/co2" : "/shop"}
                      className="bg-[#12d6fa] hover:bg-[#0bc4e8] text-white font-bold px-8 py-4 rounded-full text-lg shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
                    >
                      {refillSlides[currentRefillSlide].buttonText}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  )}
                  {refillSlides[currentRefillSlide].offerText && (
                    <span className="text-sm text-gray-600 bg-white/80 px-4 py-2 rounded-full border border-gray-200 backdrop-blur-sm">
                      {refillSlides[currentRefillSlide].offerText}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>


          {/* Enhanced Right Navigation Button */}
          <Button
            className="rounded-full w-12 h-12 flex items-center justify-center border-2 border-white bg-white/90 text-gray-700 shadow-sm z-10 hover:bg-white hover:border-[#12d6fa] hover:scale-110 transition-all duration-300 backdrop-blur-sm"
            onClick={nextRefillSlide}
          >
            {isRTL ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
          </Button>

          {/* Enhanced Slideshow Dots */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {refillSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentRefillSlide(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${index === currentRefillSlide
                  ? "bg-[#12d6fa] scale-125 shadow-sm"
                  : "bg-white/60 hover:bg-white/80 hover:scale-110"
                  }`}
                aria-label={`${t('refill.carousel.goTo')} ${index + 1}`}
                title={`${t('refill.carousel.goTo')} ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Refill / Exchange Cylinder Section - 6|6 split */}
      <section className="py-10 md:py-14">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left column (6) - Main image + compact order summary */}
            <div className="space-y-4">
              {/* Main image - fills available space, center-aligned */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="relative w-full aspect-[4/3] min-h-[280px] flex items-center justify-center bg-slate-50 overflow-hidden">
                  <Image
                    src={mainImageSrc}
                    alt="CO2 Refill / Exchange"
                    width={560}
                    height={420}
                    className="object-contain max-w-full max-h-full"
                    priority
                  />
                </div>
              </div>

              {/* Compact order summary - only when selection made (open down / close up) */}
              <AnimatePresence>
                {showBlocks && selectedCylinderData && (
                  <motion.div
                    key="refill-order-summary"
                    initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
                    animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
                    exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
                    transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
                    className="hidden lg:block overflow-hidden"
                  >
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">{t("cart.orderSummary")}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('refill.summary.co2RefillExchange')}</span>
                          <span className="font-medium">×{quantity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('refill.summary.subtotal')}</span>
                          <span className="font-medium"><SaudiRiyal amount={subtotal} size="sm" /></span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('refill.summary.delivery')}</span>
                          <span className={deliveryCharge === 0 ? 'font-semibold text-[#22c55e]' : 'font-medium'}>
                            {deliveryCharge === 0 ? t('refill.summary.free') : <SaudiRiyal amount={deliveryCharge} size="sm" />}
                          </span>
                        </div>
                        {selectedCylinder === "drinkmate" && quantity >= 4 && (65 * quantity) - subtotal > 0 && (
                          <div className="flex justify-between text-[#22c55e]">
                            <span className="font-medium">{t('refill.summary.youSave')}</span>
                            <span className="font-bold"><SaudiRiyal amount={(65 * quantity) - subtotal} size="sm" /></span>
                          </div>
                        )}
                      </div>
                      <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between items-center">
                        <span className="font-bold text-gray-900">{t('refill.summary.total')}</span>
                        <span className="text-xl font-black text-[#12d6fa]"><SaudiRiyal amount={total} size="md" /></span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">{t('refill.summary.pickupNote')}</p>
                      <p className="text-xs text-gray-600 mt-1">{t('refill.qty.deliveryInfo')} {t('refill.qty.deliveryTime')}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right column (6) - Cards, quantity, offers */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-xl font-bold text-gray-900">{t('refill.choose.heading')}</h2>
                <a href="/contact" className="inline-flex items-center gap-1 text-[#12d6fa] text-xs font-semibold hover:text-[#0bc4e8] shrink-0">
                  <Info className="w-3.5 h-3.5" />
                  {t('refill.choose.needHelp')}
                </a>
              </div>

              {/* Two cylinder type cards - select UI (images clipped to card) */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleDrinkmateClick}
                  className={`rounded-2xl border-2 p-4 text-left transition-all duration-200 hover:shadow-md flex flex-col items-center overflow-hidden ${cylinderType === "drinkmate" ? "border-[#12d6fa] bg-[#12d6fa]/5 shadow-sm" : "border-gray-200 bg-white hover:border-gray-300"}`}
                >
                  <div className="w-14 h-14 mb-2 flex-shrink-0 rounded-lg overflow-hidden flex items-center justify-center bg-slate-50 [&_img]:max-w-[56px] [&_img]:max-h-[56px] [&_img]:object-contain">
                    <Image src="/images/refillPage/drinkmateCard.svg" alt="Drinkmate" width={56} height={56} className="object-contain" />
                  </div>
                  <span className="font-bold text-gray-900 text-sm">{t('refill.choose.drinkmate')}</span>
                  <span className="text-sm font-semibold text-[#12d6fa] mt-0.5">65.00 SAR</span>
                </button>
                <button
                  type="button"
                  onClick={handleNonDrinkmateClick}
                  className={`rounded-2xl border-2 p-4 text-left transition-all duration-200 hover:shadow-md flex flex-col items-center overflow-hidden ${cylinderType === "non-drinkmate" ? "border-[#12d6fa] bg-[#12d6fa]/5 shadow-sm" : "border-gray-200 bg-white hover:border-gray-300"}`}
                >
                  <div className="w-14 h-14 mb-2 flex-shrink-0 rounded-lg overflow-hidden flex items-center justify-center bg-slate-50 [&_img]:max-w-[56px] [&_img]:max-h-[56px] [&_img]:object-contain">
                    <Image src="/images/refillPage/nonDrinkmateCard.svg" alt="Non-Drinkmate" width={56} height={56} className="object-contain" />
                  </div>
                  <span className="font-bold text-gray-900 text-sm">{t('refill.choose.nonDrinkmate')}</span>
                  <span className="text-sm font-semibold text-[#12d6fa] mt-0.5">
                    {cylinderType === "non-drinkmate" && threadType === "quick-connect"
                      ? "99.00 SAR"
                      : cylinderType === "non-drinkmate" && threadType === "standard-threaded"
                        ? "75.00 SAR"
                        : "75.00 - 99.00 SAR"}
                  </span>
                </button>
              </div>

              {/* Non-Drinkmate: thread type + brand */}
              {cylinderType === "non-drinkmate" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-4 flex-wrap">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="thread-type" checked={threadType === "standard-threaded"} onChange={() => handleThreadTypeChange("standard-threaded")} className="w-4 h-4 text-[#12d6fa]" />
                      <span className="text-sm font-semibold text-gray-900">{t('refill.choose.standardThreaded')}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="thread-type" checked={threadType === "quick-connect"} onChange={() => handleThreadTypeChange("quick-connect")} className="w-4 h-4 text-[#12d6fa]" />
                      <span className="text-sm font-semibold text-gray-900">Quick connect</span>
                    </label>
                  </div>
                  {threadType === "standard-threaded" && (
                    <Input
                      id="custom-brand"
                      type="text"
                      value={customBrandName}
                      onChange={(e) => handleCustomBrandChange(e.target.value)}
                      placeholder="Enter your brand name"
                      className="w-full h-10 border border-gray-300 rounded-xl focus:border-[#12d6fa] focus:ring-2 focus:ring-[#12d6fa]/20 text-sm"
                    />
                  )}
                </div>
              )}

              {/* Quantity + Add to cart + Offers - conditional UI (open down / close up) */}
              <AnimatePresence>
                {showBlocks && (
                  <motion.div
                    key="refill-conditional-blocks"
                    initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
                    animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
                    exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
                    transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
                    className="space-y-4 overflow-hidden"
                  >
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-900">{t('refill.qty.label')}</label>
                    <div className="flex items-center gap-3">
                      <div className="inline-flex items-center rounded-xl border-2 border-gray-200 bg-slate-50 p-1">
                        <button type="button" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 hover:bg-white disabled:opacity-50" aria-label="Decrease quantity">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-bold text-gray-900">{quantity}</span>
                        <button type="button" onClick={() => handleQuantityChange(1)} disabled={quantity >= 10} className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 hover:bg-white disabled:opacity-50" aria-label="Increase quantity">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <Button onClick={handleAddToCart} className="flex-1 bg-[#12d6fa] hover:bg-[#0bc4e8] text-white font-bold py-4 rounded-xl shrink-0">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {t('refill.cta.addToCart')}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>

                  {/* Unlock the opportunity - free delivery at 150 SAR (dynamic min qty) & 4+ 59 each */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-2">{t('refill.offers.heading')}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {/* Free delivery card - active when subtotal >= 150 SAR */}
                      <div className={`rounded-xl border-2 p-3 text-center transition-all ${freeDeliveryActive ? 'border-[#12d6fa] bg-[#12d6fa]/10' : 'border-gray-200 bg-slate-50'}`}>
                        <div className={`text-xs font-bold ${freeDeliveryActive ? 'text-[#12d6fa]' : 'text-gray-600'}`}>{t('refill.offers.buyXFreeDelivery').replace('{{count}}', String(minCylindersForFreeDelivery))}</div>
                        {freeDeliveryActive ? (
                          <span className="text-xs font-semibold text-[#22c55e] mt-1 block">{t('refill.discounts.active')}</span>
                        ) : (
                          <span className="text-xs text-gray-500 mt-1 block">{t('refill.offers.addMoreForFreeDelivery').replace('{{count}}', String(cylindersNeededForFreeDelivery))}</span>
                        )}
                      </div>
                      {/* 4+ 59 each - Drinkmate only */}
                      {cylinderType === "drinkmate" && (
                        <div className={`rounded-xl border-2 p-3 text-center transition-all ${quantity >= 4 ? 'border-[#12d6fa] bg-[#12d6fa]/10' : 'border-gray-200 bg-white'}`}>
                          <div className={`text-xs font-bold ${quantity >= 4 ? 'text-[#12d6fa]' : 'text-gray-600'}`}>{t('refill.offers.buy4PriceEach')}</div>
                          {quantity >= 4 ? (
                            <span className="text-xs font-semibold text-[#22c55e] mt-1 block">{t('refill.discounts.active')}</span>
                          ) : (
                            <span className="text-xs text-gray-500 mt-1 block">{t('refill.offers.addOneMoreForOffer').replace('{{count}}', String(4 - quantity))}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{t('refill.offers.returnNoteShort').replace('{{count}}', String(quantity))}</p>
                  </div>

                  {/* Why choose - compact */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <h4 className="text-sm font-bold text-gray-900 mb-2">{t('refill.why.title')}</h4>
                    <ul className="space-y-1.5 text-xs text-gray-700">
                      <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-[#22c55e] shrink-0" />{t('refill.why.f1')}</li>
                      <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-[#12d6fa] shrink-0" />{t('refill.why.f2')}</li>
                      <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-[#22c55e] shrink-0" />{t('refill.why.f3')}</li>
                      <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-[#12d6fa] shrink-0" />{t('refill.why.f4')}</li>
                    </ul>
                  </div>

                    {/* Order Summary - Mobile only, appears under Why Choose Our Premium Service */}
                    <div className="lg:hidden mt-6">
                      <div className="bg-white rounded-3xl border-2 border-[#12d6fa]/20 shadow-sm p-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t("cart.orderSummary")}</h3>

                        {/* Selected Cylinder Info */}
                        {selectedCylinderData && (
                          <div className="mb-6 p-4 bg-blue-50 rounded-2xl border border-blue-200">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-[#12d6fa] rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                  {selectedCylinderData.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900">{selectedCylinderData.name}</h4>
                                <p className="text-sm text-gray-600">{t('refill.summary.co2RefillExchange')}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Quantity and Return Info */}
                        <div className="mb-6 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">{t('refill.qty.title')}:</span>
                            <span className="font-semibold text-gray-900">{quantity} {t('refill.qty.cylinder')}{quantity > 1 && !isRTL ? 's' : ''}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">{t('refill.summary.requiredReturn')}</span>
                            <span className="font-semibold text-gray-900">{quantity} {t('refill.qty.emptyCylinders')}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">{t('refill.summary.deliveryTime')}</span>
                            <span className="font-semibold text-[#12d6fa]">{t('refill.qty.deliveryTime')}</span>
                          </div>
                        </div>

                        {/* Pricing Breakdown */}
                        <div className="space-y-3 mb-6">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">{t('refill.summary.unitPrice')}</span>
                            <span className="font-semibold text-gray-900">
                              <SaudiRiyal amount={cylinderPrice} size="sm" />
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 whitespace-nowrap">{t('refill.summary.subtotal')} ({quantity} × <SaudiRiyal amount={cylinderPrice} size="sm" />):</span>
                            <span className="font-semibold text-gray-900">
                              <SaudiRiyal amount={subtotal} size="sm" />
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">{t('refill.summary.delivery')}</span>
                            <span className={`font-semibold ${deliveryCharge === 0 ? 'text-[#a8f387]' : 'text-gray-900'}`}>
                              {deliveryCharge === 0 ? t('refill.summary.free') : <SaudiRiyal amount={deliveryCharge} size="sm" />}
                            </span>
                          </div>
                          {selectedCylinderData && selectedCylinder === "drinkmate" && quantity >= 4 && (65 * quantity) - subtotal > 0 && (
                            <div className="flex justify-between items-center text-[#a8f387]">
                              <span className="font-semibold">{t('refill.summary.youSave')}</span>
                              <span className="font-bold">
                                <SaudiRiyal amount={(65 * quantity) - subtotal} size="sm" />
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Total */}
                        <div className="border-t border-gray-200 pt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-xl font-bold text-gray-900">{t('refill.summary.total')}</span>
                            <span className="text-2xl font-black text-[#12d6fa]">
                              <SaudiRiyal amount={total} size="lg" />
                            </span>
                          </div>
                        </div>

                        {/* Additional Info */}
                        <div className="mt-4 text-center">
                          <p className="text-xs text-gray-500">{t('refill.summary.pickupNote')}</p>
                        </div>
                      </div>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Horizontal Divider */}
          <div className="w-full h-px bg-gray-300 my-12"></div>

          {/* Enhanced How Refill/Exchange Works Section */}
          <div className="py-16">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-black mb-6">{t('home.howItWorks.title')}</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('home.howItWorks.subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {/* Step 1 */}
              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-full h-80 bg-blue-50 rounded-3xl mb-6 flex items-center justify-center group-hover:shadow-md transition-all duration-300 border-2 border-blue-200">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-[#12d6fa] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <ShoppingCart className="w-12 h-12 text-white" />
                      </div>
                      <p className="text-[#12d6fa] font-bold text-lg">{t('refill.howItWorks.step1.label')}</p>
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-black mb-4">{t('refill.howItWorks.step1.title')}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {t('refill.howItWorks.step1.description')}
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-full h-80 bg-blue-50 rounded-3xl mb-6 flex items-center justify-center group-hover:shadow-md transition-all duration-300 border-2 border-blue-200">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-[#12d6fa] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <Truck className="w-12 h-12 text-black" />
                      </div>
                      <p className="text-[#12d6fa] font-bold text-lg">{t('refill.howItWorks.step2.label')}</p>
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-black mb-4">{t('refill.howItWorks.step2.title')}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {t('refill.howItWorks.step2.description')}
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-full h-80 bg-blue-50 rounded-3xl mb-6 flex items-center justify-center group-hover:shadow-md transition-all duration-300 border-2 border-blue-200">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-[#12d6fa] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <Shield className="w-12 h-12 text-white" />
                      </div>
                      <p className="text-[#12d6fa] font-bold text-lg">{t('refill.howItWorks.step3.label')}</p>
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-black mb-4">{t('refill.howItWorks.step3.title')}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {t('refill.howItWorks.step3.description')}
                </p>
              </div>
            </div>

          </div>

          {/* Horizontal Divider */}
          <div className="w-full h-px bg-gray-300 my-12"></div>

          {/* Enhanced Tab Section */}
          <div className="py-16">
            <div className="max-w-5xl mx-auto">
              {/* Enhanced Tab Headers */}
              <div className="flex w-full mb-12 bg-gray-100 rounded-2xl p-2">
                <button
                  onClick={() => setActiveTab("faqs")}
                  className={`flex-1 py-4 px-8 font-bold text-center transition-all duration-300 rounded-xl ${activeTab === "faqs"
                    ? "bg-[#12d6fa] text-white shadow-sm scale-105"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                    }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Info className="w-5 h-5" />
                    <span>{t('refill.tabs.faqs')}</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("description")}
                  className={`flex-1 py-4 px-8 font-bold text-center transition-all duration-300 rounded-xl ${activeTab === "description"
                    ? "bg-[#12d6fa] text-white shadow-sm scale-105"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                    }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>{t('refill.tabs.description')}</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`flex-1 py-4 px-8 font-bold text-center transition-all duration-300 rounded-xl ${activeTab === "reviews"
                    ? "bg-[#12d6fa] text-white shadow-sm scale-105"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                    }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Star className="w-5 h-5" />
                    <span>{t('refill.tabs.reviews')}</span>
                  </div>
                </button>
              </div>

              {/* Enhanced Tab Content */}
              <div className="bg-white rounded-3xl shadow-sm p-10 border border-gray-100">
                {activeTab === "faqs" && (
                  <div>
                    <div className="text-center mb-12">
                      <h3 className="text-3xl font-black text-black mb-4">{t('refill.tabs.faqsTitle')}</h3>
                      <p className="text-gray-600 text-lg">{t('refill.tabs.faqsSubtitle')}</p>
                    </div>
                    <div className="space-y-6">
                      {[
                        {
                          question: t('refill.faqs.q1'),
                          answer: t('refill.faqs.a1')
                        },
                        {
                          question: t('refill.faqs.q2'),
                          answer: t('refill.faqs.a2')
                        },
                        {
                          question: t('refill.faqs.q3'),
                          answer: t('refill.faqs.a3')
                        },
                        {
                          question: t('refill.faqs.q4'),
                          answer: t('refill.faqs.a4')
                        },
                        {
                          question: t('refill.faqs.q5'),
                          answer: t('refill.faqs.a5')
                        }
                      ].map((faq, index) => (
                        <div key={index} className="border-2 border-gray-100 rounded-2xl overflow-hidden hover:shadow-sm hover:border-[#12d6fa]/30 transition-all duration-300 group">
                          <button
                            onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                            className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-blue-50 transition-all duration-300 group-hover:scale-[1.02]"
                          >
                            <span className="font-bold text-black text-xl group-hover:text-[#12d6fa] transition-colors duration-300">{faq.question}</span>
                            <ChevronDown
                              className={`w-6 h-6 text-[#12d6fa] transition-all duration-300 group-hover:scale-110 ${openFAQ === index ? "rotate-180" : ""
                                }`}
                            />
                          </button>
                          {openFAQ === index && (
                            <div className="px-8 pb-6 bg-blue-50 border-t border-blue-200">
                              <p className="text-gray-700 leading-relaxed text-lg pt-2">{faq.answer}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "description" && (
                  <div>
                    <h3 className="text-2xl font-bold text-black mb-8">{t('refill.tabs.productDescription')}</h3>
                    <div className="grid md:grid-cols-2 gap-12">
                      {/* Left Side - Text */}
                      <div className="space-y-6">
                        <p className="text-gray-700 leading-relaxed text-lg">
                          Our CO2 cylinder refill and exchange service provides you with fresh, food-grade CO2
                          for your sparkling water maker. Each cylinder is thoroughly tested and filled to the
                          highest safety standards.
                        </p>
                        <div>
                          <h4 className="font-bold text-black text-xl mb-4">{t('refill.tabs.keyFeatures')}</h4>
                          <div className="space-y-3">
                            {[
                              "Food-grade CO2 certified for beverage use",
                              "Compatible with all major soda maker brands",
                              "Each cylinder carbonates up to 60 liters of water",
                              "Convenient home pickup and delivery service",
                              "3-5 business day turnaround time",
                              "Thoroughly tested for safety and quality",
                              "Quantity discounts for bulk orders",
                              "Free delivery for 4+ cylinders"
                            ].map((feature, index) => (
                              <div key={index} className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-[#a8f387] rounded-full mt-2 flex-shrink-0"></div>
                                <p className="text-gray-700">{feature}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          We ensure that every cylinder meets strict quality and safety standards before delivery.
                          Our refill process uses only premium CO2 that's perfect for creating delicious sparkling water.
                        </p>
                      </div>

                      {/* Right Side - Image */}
                      <div className="flex items-center justify-center">
                        <div className="bg-gray-50 rounded-2xl p-8 w-full">
                          <Image
                            src="/images/food-grade-co2-text.png"
                            alt="CO2 Cylinder Description"
                            width={300}
                            height={400}
                            className="object-contain w-full h-auto"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div>
                    <h3 className="text-2xl font-bold text-black mb-8">{t('refill.tabs.customerReviews')}</h3>
                    <div className="space-y-6">
                      {[
                        {
                          name: "Ahmed Al-Hassan",
                          rating: 5,
                          date: "2 weeks ago",
                          review: "Excellent service! The pickup and delivery was right on time, and the refilled cylinders work perfectly. Very convenient and reliable."
                        },
                        {
                          name: "Sarah Mohamed",
                          rating: 5,
                          date: "1 month ago",
                          review: "Great quality CO2 and fast turnaround time. The exchange process was smooth and hassle-free. Highly recommended!"
                        },
                        {
                          name: "Fatima Al-Zahra",
                          rating: 5,
                          date: "1 week ago",
                          review: "Perfect for our SodaStream! The CO2 quality is excellent and the home pickup service saves so much time. Will definitely use again."
                        }
                      ].map((review, index) => (
                        <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-sm transition-all duration-200">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="font-semibold text-black text-lg">{review.name}</h4>
                              <div className="flex items-center space-x-3 mt-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                        }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">{review.date}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{review.review}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}





