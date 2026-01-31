'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

interface FloatingWhatsappButtonProps {
  className?: string
}

export default function FloatingWhatsappButton({
  className = '',
}: FloatingWhatsappButtonProps) {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const isContactPage = pathname === '/contact'
    const isAdminPage = pathname?.startsWith('/admin')

    // Hide WhatsApp widget on contact page (where full contact options exist) and admin pages
    if (isContactPage || isAdminPage) {
      setIsVisible(false)
    } else {
      setIsVisible(true)
    }
  }, [pathname])

  if (!isVisible) return null

  const whatsappHref =
    'https://wa.me/message/DZK5ZUTOOWVEL1'

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`fixed z-50 ${className}`}
      style={{
        bottom: 'max(6rem, calc(2rem + env(safe-area-inset-bottom, 0px)))',
        right: 'max(2rem, env(safe-area-inset-right, 0px))',
      }}
    >
      <motion.a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="relative bg-[#25D366] text-white rounded-full p-4 shadow-2xl cursor-pointer group flex items-center justify-center"
        whileHover={{
          boxShadow: '0 20px 40px rgba(37, 211, 102, 0.4)',
          transition: { duration: 0.2 },
        }}
        aria-label="Chat on WhatsApp"
      >
        {/* WhatsApp Icon */}
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 19 19" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
        >
          <path 
            d="M15.255 3.713a8 8 0 0 0-5.684-2.36c-4.433 0-8.043 3.603-8.043 8.036 0 1.394.364 2.771 1.045 3.974l-1.164 4.26 4.354-1.14a8.06 8.06 0 0 0 3.8.957c4.434 0 8.044-3.61 8.044-8.043 0-2.145-.84-4.172-2.352-5.692zM4.283 13.11c-.76-.863-1.18-2.312-1.18-3.72a6.467 6.467 0 0 1 6.46-6.46 6.42 6.42 0 0 1 4.568 1.891 6.42 6.42 0 0 1 1.892 4.568 6.467 6.467 0 0 1-6.46 6.46c-1.258 0-2.596-.404-3.562-1.06l-2.343.609z" 
            fill="#fff" 
            style={{ fill: '#fff', fillOpacity: 1 }}
          />
          <path 
            d="M11.748 10.434c.182.064 1.148.539 1.346.641.198.103.333.15.38.23.048.08.048.475-.119.934s-.95.879-1.33.934c-.34.048-.768.072-1.242-.079a12 12 0 0 1-1.125-.412c-1.979-.854-3.27-2.842-3.364-2.976-.103-.143-.8-1.069-.8-2.035s.507-1.448.689-1.646a.72.72 0 0 1 .522-.246h.38c.12 0 .285-.047.444.34.166.396.562 1.362.61 1.465a.38.38 0 0 1 .015.349c-.063.134-.095.213-.198.324a8 8 0 0 1-.293.348c-.095.095-.198.206-.087.404.119.198.507.84 1.093 1.362.752.673 1.385.879 1.583.974s.309.079.428-.048c.118-.135.49-.578.625-.776s.261-.166.443-.095z" 
            fill="#fff" 
            style={{ fill: '#fff', fillOpacity: 1 }}
          />
        </svg>

        {/* Pulse Animation */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 0, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 bg-[#25D366] rounded-full"
        />
      </motion.a>
    </motion.div>
  )
}

