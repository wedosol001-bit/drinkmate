"use client"

import React, { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import PageLayout from "@/components/layout/PageLayout"
import { useTranslation } from "@/lib/contexts/translation-context"

export default function SodamakerProductDetail() {
	const params = useParams()
	const router = useRouter()
	const { t, language } = useTranslation()

	const productSlug = params?.slug as string

	useEffect(() => {
		if (!productSlug) return
		const prefix = language === 'AR' ? '/ar' : ''
		router.replace(`${prefix}/shop/${productSlug}`)
	}, [productSlug, language, router])

	return (
		<PageLayout>
			<div className="container mx-auto px-4 py-8">
				<div className="flex items-center justify-center h-64">
					<div className="text-center space-y-4">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#12d6fa] mx-auto"></div>
						<div className="text-lg font-medium">{t("product.loadingDetails") || "Loading premium product details..."}</div>
						<div className="text-sm text-muted-foreground">{t("product.preparingExperience") || "Preparing the best experience for you"}</div>
					</div>
				</div>
			</div>
		</PageLayout>
	)
}
