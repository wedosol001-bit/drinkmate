"use client"

import React, { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Banner from '@/components/layout/Banner'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ContactProvider, useContactSettings } from '@/lib/contexts/contact-settings-context'
import { useAuth } from '@/lib/contexts/auth-context'
import { useTranslation } from '@/lib/contexts/translation-context'
import { useChatStatus } from '@/lib/contexts/chat-status-context'
import { contactAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { 
  MessageCircle, 
  Mail, 
  Search, 
  CheckCircle, 
  Upload,
  X,
  ChevronDown,
  ChevronUp,
  Phone,
  Clock,
  Send,
  FileText,
  HelpCircle,
  MapPin
} from 'lucide-react'
import { toast } from 'sonner'

// Contact Option Card Component
function ContactOptionCard({ 
  icon: Icon, 
  title, 
  availability, 
  buttonText, 
  buttonAction, 
  status = 'available',
  disabled = false 
}: {
  icon: React.ElementType
  title: string
  availability: string
  buttonText: string
  buttonAction: () => void
  status?: 'available' | 'offline' | '24/7' | 'login-required'
  disabled?: boolean
}) {
  const { t } = useTranslation()
  const getStatusColor = () => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'offline': return 'bg-amber-100 text-amber-800'
      case '24/7': return 'bg-blue-100 text-blue-800'
      case 'login-required': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'available': return t('shop.contact.status.available')
      case 'offline': return t('shop.contact.status.offline')
      case '24/7': return t('shop.contact.status.always')
      case 'login-required': return t('shop.contact.status.loginRequired')
      default: return t('shop.contact.status.available')
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-[#12d6fa]/10 rounded-xl flex items-center justify-center flex-shrink-0">
            {Icon ? (
              <Icon className="h-6 w-6 text-[#12d6fa]" aria-hidden="true" />
            ) : (
              <div className="h-6 w-6 bg-[#12d6fa] rounded" aria-label="Icon placeholder" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 text-base">{title || 'Contact Option'}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor()} ml-2`}>
                {getStatusText()}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1 leading-relaxed">{availability || ''}</p>
          </div>
        </div>
      </div>
        
      <button
        onClick={buttonAction}
        disabled={disabled}
        className={`w-full h-12 rounded-xl font-medium transition-all duration-200 flex items-center justify-center ${
          disabled 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-40' 
            : status === 'login-required'
              ? 'bg-orange-500 hover:bg-orange-600 text-white hover:shadow-md'
              : 'bg-[#12d6fa] hover:bg-[#0fb8d9] text-white hover:shadow-md'
        }`}
        title={disabled ? t('shop.contact.options.chat.checking') : ""}
      >
        {buttonText || 'Contact'}
      </button>
    </div>
  )
}

// FAQ Accordion Component
function FAQAccordion({ 
  category, 
  questions, 
  isExpanded, 
  onToggle 
}: {
  category: string
  questions: Array<{ q: string; a: string }>
  isExpanded: boolean
  onToggle: () => void
}) {
  const { t } = useTranslation()
  
  // Filter out empty questions (only spaces or empty strings)
  const validQuestions = questions.filter(q => q.q && q.q.trim() && q.a && q.a.trim())
  
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <button 
        className="w-full p-4 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#12d6fa] focus:ring-inset"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 text-sm">{category || 'FAQ Category'}</h3>
          <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          {validQuestions.length > 0 ? (
            <div className="space-y-3 pt-3">
              {validQuestions.slice(0, 3).map((faq, index) => (
                <div key={index} className="border-l-2 border-[#12d6fa]/20 pl-3">
                  <h4 className="font-medium text-gray-900 text-sm mb-1">{faq.q}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
              {validQuestions.length > 3 && (
                <div className="pt-2">
                  <button className="text-xs text-[#12d6fa] hover:text-[#0fb8d9] font-medium">
                    {t('shop.contact.faq.viewAll')?.replace('{{count}}', String(validQuestions.length)) || `View all ${validQuestions.length} questions →`}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="pt-3 pb-2 text-sm text-gray-500">
              No questions available in this category yet.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Contact Form Component
function ContactForm() {
  const { settings, getText } = useContactSettings()
  const { user } = useAuth()
  const { t, isRTL, language } = useTranslation()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    reason: '',
    message: '',
    consent: false
  })
  const [files, setFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [ticketId, setTicketId] = useState('')
  const [contactResponses, setContactResponses] = useState<any[]>([])
  const [loadingResponses, setLoadingResponses] = useState(false)
  const [showResponses, setShowResponses] = useState(false)

  // Form validation
  const isFormValid = formData.name && formData.email && formData.message && formData.consent && formData.message.length >= 10

  // Fetch contact responses
  const fetchContactResponses = async () => {
    if (!formData.email) return
    
    setLoadingResponses(true)
    try {
      const response = await contactAPI.getUserContacts(formData.email)
      setContactResponses(response.contacts || [])
    } catch (error) {
      console.error('Error fetching contact responses:', error)
    } finally {
      setLoadingResponses(false)
    }
  }

  // Fetch responses when email changes
  useEffect(() => {
    if (formData.email && formData.email.includes('@')) {
      fetchContactResponses()
    }
  }, [formData.email])

  const reasons = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'order', label: 'Order Related' },
    { value: 'billing', label: 'Billing Question' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'refund', label: 'Refund Request' },
    { value: 'other', label: 'Other' }
  ]

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || [])
    
    if (files.length + newFiles.length > 3) {
      toast.error(t('shop.contact.form.errors.maxFiles'))
      return
    }

    const validFiles: File[] = []
    for (const file of newFiles) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(t('shop.contact.form.errors.fileTooLarge'))
        continue
      }
      
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
      if (!allowedTypes.includes(file.type)) {
        toast.error(t('shop.contact.form.errors.invalidType'))
        continue
      }
      
      validFiles.push(file)
    }

    setFiles(prev => [...prev, ...validFiles])
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!formData.name || !formData.email || !formData.reason || !formData.message) {
        toast.error(t('shop.contact.form.errors.fillAll'))
        return
      }

      if (!formData.consent) {
        toast.error(t('shop.contact.form.errors.consent'))
        return
      }

      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          attachments: files.map(file => ({
            name: file.name,
            url: URL.createObjectURL(file),
            type: file.type,
            size: file.size
          })),
          locale: isRTL ? 'ar' : 'en',
          source: 'contact_page'
        })
      })

      const result = await response.json()

      if (result.success) {
        setTicketId(result.ticketId)
        setShowSuccess(true)
        setFormData({
          name: '',
          email: '',
          phone: '',
          reason: '',
          message: '',
          consent: false
        })
        setFiles([])
      } else {
        toast.error(result.error || t('shop.contact.form.errors.submitFail'))
      }
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error(t('shop.contact.form.errors.submitFail'))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showSuccess) {
    return (
      <Card className="border-green-200 bg-green-50 shadow-lg">
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-800 mb-2">
            {t('shop.contact.form.success.heading')} {ticketId}
          </h3>
          <p className="text-sm text-green-700 mb-4">
            {t('shop.contact.form.success.subtitle')}
          </p>
          <Button 
            onClick={() => setShowSuccess(false)} 
            variant="outline"
            className="rounded-xl border-green-300 text-green-700 hover:bg-green-100"
          >
            {t('shop.contact.form.success.another')}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-gray-200 bg-white shadow-lg">
      <CardHeader className="p-6">
        <div>
          <CardTitle className="text-2xl font-bold text-gray-900 mb-2">{t('shop.contact.form.title')}</CardTitle>
          <p className="text-gray-600">{t('shop.contact.form.subtitle')}</p>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Reason Selection */}
          <div>
            <Label className="text-sm font-medium text-gray-900 mb-4 block">{t('shop.contact.form.reason')}</Label>
            <div className="grid grid-cols-3 gap-2">
              {reasons.map((reason) => (
                <button
                  key={reason.value}
                  type="button"
                  onClick={() => handleInputChange('reason', reason.value)}
                  className={`px-4 py-3 text-sm font-medium rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#12d6fa] focus:ring-offset-2 ${
                    formData.reason === reason.value
                      ? 'border-[#12d6fa] bg-[#12d6fa] text-white shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {t(`shop.contact.form.reasons.${reason.value}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-900 mb-2 block">
                {t('shop.contact.form.name')}
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder={t('shop.contact.form.namePlaceholder')}
                className="h-12 border-gray-200 focus:border-[#12d6fa] focus:ring-[#12d6fa] rounded-xl"
                required
              />
              {!formData.name && formData.name !== '' && (
                <p className="text-xs text-red-600 mt-1">{t('shop.contact.form.nameRequired')}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-900 mb-2 block">
                {t('shop.contact.form.email')}
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder={t('shop.contact.form.emailPlaceholder')}
                className="h-12 border-gray-200 focus:border-[#12d6fa] focus:ring-[#12d6fa] rounded-xl"
                required
              />
              {!formData.email && formData.email !== '' && (
                <p className="text-xs text-red-600 mt-1">{t('shop.contact.form.emailRequired')}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="phone" className="text-sm font-medium text-gray-900 mb-2 block">
              {t('shop.contact.form.phone')}
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder={t('shop.contact.form.phone')}
              className="h-12 border-gray-200 focus:border-[#12d6fa] focus:ring-[#12d6fa] rounded-xl"
            />
            <p className="text-xs text-gray-500 mt-1">{t('shop.contact.form.phoneHint')}</p>
          </div>

          <div>
            <Label htmlFor="message" className="text-sm font-medium text-gray-900 mb-2 block">
              {t('shop.contact.form.message')}
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder={t('shop.contact.form.messagePlaceholder')}
              rows={6}
              className="min-h-[150px] border-gray-200 focus:border-[#12d6fa] focus:ring-[#12d6fa] rounded-xl"
              required
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500">{t('shop.contact.form.messageMin')}</p>
              <p className="text-xs text-gray-400">{formData.message.length}/500</p>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <Label className="text-sm font-medium text-gray-900 mb-2 block">
              {t('shop.contact.form.attachments')}
            </Label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-[#12d6fa] transition-colors">
              <input
                id="attachments"
                type="file"
                multiple
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.gif,.pdf"
                className="hidden"
                aria-label="File attachments upload"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('attachments')?.click()}
                className="w-full h-12 rounded-xl border-gray-200 hover:border-[#12d6fa] hover:text-[#12d6fa]"
              >
                <Upload className="h-4 w-4 mr-2" />
                {t('shop.contact.form.uploadBtn')}
              </Button>
              <p className="text-xs text-gray-500 mt-2 text-center">{t('shop.contact.form.uploadHint')}</p>
            </div>

            {files.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center bg-gray-50 px-3 py-2 rounded-xl text-sm">
                    <FileText className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-gray-700">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="ml-2 text-gray-400 hover:text-red-500 rounded-full p-1 hover:bg-red-50"
                      aria-label={`Remove ${file.name}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Consent */}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="consent"
              checked={formData.consent}
              onCheckedChange={(checked) => handleInputChange('consent', checked as boolean)}
              className="mt-1"
            />
            <Label htmlFor="consent" className="text-sm text-gray-700 leading-relaxed">
              {t('shop.contact.form.consent')}
            </Label>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !isFormValid}
            className="w-full h-12 rounded-xl bg-[#12d6fa] hover:bg-[#0fb8d9] text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {t('shop.contact.form.submitting')}
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {t('shop.contact.form.submit')}
              </>
            )}
          </Button>
        </form>

        {/* Contact Responses Section */}
        {contactResponses.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{t('shop.contact.form.history.title')}</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowResponses(!showResponses)}
                className="text-sm"
              >
                {showResponses ? t('shop.contact.options.hide') : t('shop.contact.options.show')} ({contactResponses.length})
              </Button>
            </div>
            
            {showResponses && (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {contactResponses.map((contact, index) => (
                  <div key={contact._id || index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant={contact.status === 'resolved' ? 'default' : 'secondary'}>
                          {contact.status}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {contact.subject}
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-1">{t('shop.contact.form.history.yourMessage')}</p>
                      <p className="text-sm text-gray-800 bg-white p-2 rounded border">
                        {contact.message}
                      </p>
                    </div>
                    
                    {contact.response && (
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                        <p className="text-sm font-medium text-blue-800 mb-1">{t('shop.contact.form.history.ourResponse')}</p>
                        <p className="text-sm text-blue-700">
                          {contact.response.text}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          {new Date(contact.response.sentAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Main Contact Page Component
function ContactPageContent() {
  const { settings, getText } = useContactSettings()
  const { user, isAuthenticated } = useAuth()
  const { t, isRTL, language } = useTranslation()
  const { chatStatus, isLoading: isChatStatusLoading } = useChatStatus()
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)

  const handleWhatsAppClick = () => {
    // Analytics tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'contact_whatsapp_click', {
        event_category: 'Contact',
        event_label: 'WhatsApp Contact'
      })
    }
    
    const message = encodeURIComponent("Hello! I need help with my order.")
    const url = `https://wa.me/966544671116?text=${message}`
    window.open(url, '_blank')
  }

  const handleEmailClick = () => {
    // Analytics tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'contact_email_click', {
        event_category: 'Contact',
        event_label: 'Email Contact'
      })
    }
    
    const subject = encodeURIComponent('Support Request')
    const body = encodeURIComponent(`Hello,\n\nI need help with: ${user ? `Order #${user._id || user.username}` : 'my inquiry'}\n\n`)
    const url = `mailto:support@drinkmates.com?subject=${subject}&body=${body}`
    window.open(url)
  }

  const handleChatClick = () => {
    // Analytics tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'contact_chat_click', {
        event_category: 'Contact',
        event_label: 'Live Chat Contact'
      })
    }
    
    if (!isAuthenticated) {
      // Show proper login prompt with return URL
      const currentUrl = encodeURIComponent(window.location.pathname + window.location.search)
      window.location.href = `/login?returnUrl=${currentUrl}&reason=chat`
      return
    }
    
    if (!isChatOnline()) {
      const now = new Date()
      const serverTime = new Date(now.toLocaleString("en-US", { timeZone: chatStatus.timezone }))
      const currentTime = serverTime.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      })
      const [startTime, endTime] = [chatStatus.workingHours.start, chatStatus.workingHours.end]
      
      alert(`Live chat is currently offline.\n\nCurrent time: ${currentTime}\nChat hours: ${startTime} - ${endTime}\n\nPlease use our contact form or email us.`)
      return
    }
    
    // Dispatch custom event to open the chat widget
    window.dispatchEvent(new CustomEvent('openChatWidget'))
  }


  const isChatOnline = () => {
    return chatStatus.isOnline
  }

  const faqCategories = [
    {
      id: 'orders',
      title: t('shop.contact.faq.categories.orders'),
      questions: [
        { q: t('shop.contact.faq.categories.orders'), a: '' },
        { q: ' ', a: ' ' },
        { q: ' ', a: ' ' }
      ]
    },
    {
      id: 'refill',
      title: t('shop.contact.faq.categories.refill'),
      questions: [
        { q: ' ', a: ' ' },
        { q: ' ', a: ' ' },
        { q: ' ', a: ' ' }
      ]
    },
    {
      id: 'returns',
      title: t('shop.contact.faq.categories.returns'),
      questions: [
        { q: ' ', a: ' ' },
        { q: ' ', a: ' ' },
        { q: ' ', a: ' ' }
      ]
    },
    {
      id: 'payment',
      title: t('shop.contact.faq.categories.payment'),
      questions: [
        { q: ' ', a: ' ' },
        { q: ' ', a: ' ' },
        { q: ' ', a: ' ' }
      ]
    }
  ]

  const filteredFaqCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return faqCategories
    }
    const lowerCaseQuery = searchQuery.toLowerCase()
    return faqCategories.map(category => ({
      ...category,
      questions: category.questions.filter(q =>
        q.q.toLowerCase().includes(lowerCaseQuery) ||
        q.a.toLowerCase().includes(lowerCaseQuery)
      )
    })).filter(category => category.questions.length > 0)
  }, [faqCategories, searchQuery])

  return (
    <>
      <Banner />
      <Header currentPage="contact" />
      
      <main className="min-h-screen bg-surface-50">
        {/* Premium Hero Section */}
        <section className="relative py-12 md:py-16 overflow-hidden">
          {/* Background Image with Parallax Effect */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://res.cloudinary.com/dw2h8hejn/image/upload/v1757238970/background-6556413_1920_rlwos5.jpg"
              alt="Contact us background"
              fill
              className="object-cover scale-105"
              priority
            />
            {/* Clean Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          
          {/* Premium Content with Animations */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-8">
              
              {/* Main Heading with Premium Typography */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  {t('shop.contact.hero.title')}
                </h1>
              </div>
              
              {/* Description */}
              <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                {t('shop.contact.hero.subtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8 lg:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Desktop Layout - 2-Column Grid with FAQ below */}
            <div className="hidden lg:block">
              {/* Top Row - Contact Options and Contact Form */}
              <div className="grid lg:grid-cols-[380px_1fr] lg:gap-8 mb-12">
                {/* Left Column - Contact Options */}
                <div className="sticky top-24 self-start">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('shop.contact.options.heading')}</h2>
                  <div className="space-y-6">
                    <ContactOptionCard
                      icon={MessageCircle}
                      title={t('shop.contact.options.whatsapp.title')}
                      availability={t('shop.contact.options.whatsapp.availability')}
                      buttonText={t('shop.contact.options.whatsapp.button')}
                      buttonAction={handleWhatsAppClick}
                      status="24/7"
                    />
                    
                    <ContactOptionCard
                      icon={Mail}
                      title={t('shop.contact.options.email.title')}
                      availability={t('shop.contact.options.email.availability')}
                      buttonText={t('shop.contact.options.email.button')}
                      buttonAction={handleEmailClick}
                      status="available"
                    />
                    
                    <ContactOptionCard
                      icon={MessageCircle}
                      title={t('shop.contact.options.chat.title')}
                      availability={
                        isChatStatusLoading
                          ? t('shop.contact.options.chat.checking')
                          : !isAuthenticated 
                            ? t('shop.contact.options.chat.loginRequired') 
                            : isChatOnline() 
                              ? t('shop.contact.options.chat.avgReply') 
                              : `${t('shop.contact.options.chat.opensAt')} ${chatStatus.workingHours.start}`
                      }
                      buttonText={
                        isChatStatusLoading 
                          ? t('shop.contact.options.chat.buttonLoading')
                          : !isAuthenticated 
                            ? t('shop.contact.options.chat.buttonLogin') 
                            : t('shop.contact.options.chat.buttonStart')
                      }
                      buttonAction={handleChatClick}
                      status={
                        isChatStatusLoading
                          ? "offline"
                          : !isAuthenticated 
                            ? "login-required" 
                            : isChatOnline() 
                              ? "available" 
                              : "offline"
                      }
                      disabled={isChatStatusLoading || !isAuthenticated || !isChatOnline()}
                    />
                  </div>
                </div>

                {/* Right Column - Contact Form (takes remaining space) */}
                <div className="sticky top-24 self-start">
                  <ContactForm />
                </div>
              </div>

              {/* Bottom Row - FAQ Section (full width) */}
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('shop.contact.faq.heading')}</h2>
                
                {/* FAQ Search */}
                <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 shadow-sm">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder={t('shop.contact.faq.searchPlaceholder')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-0 bg-transparent focus:outline-none text-gray-900 placeholder-gray-500"
                    />
                  </div>
                </div>

                {/* FAQ Categories */}
                {filteredFaqCategories.length > 0 ? (
                  <div className="space-y-3">
                    {filteredFaqCategories.map((category) => (
                      <FAQAccordion
                        key={category.id}
                        category={category.title}
                        questions={category.questions}
                        isExpanded={expandedFAQ === category.id}
                        onToggle={() => setExpandedFAQ(expandedFAQ === category.id ? null : category.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      {language === 'AR' 
                        ? 'لا توجد نتائج للبحث. حاول استخدام كلمات مختلفة.'
                        : 'No search results found. Try using different keywords.'}
                    </p>
                  </div>
                )}
                  
                  <div className="pt-4">
                    <button
                      onClick={() => {
                        // Scroll to form
                        document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="w-full h-12 bg-[#12d6fa] hover:bg-[#0fb8d9] text-white font-medium rounded-2xl transition-colors flex items-center justify-center"
                    >
                      <HelpCircle className="h-4 w-4 mr-2" />
                      {t('shop.contact.faq.cta')}
                    </button>
                  </div>
                </div>
              </div>

            {/* Mobile Layout - Single Column */}
            <div className="lg:hidden space-y-8">
              {/* Contact Options */}
              <div>
                <h2 className="dm-heading-2 mb-6">{t('shop.contact.options.heading')}</h2>
                <div className="space-y-4">
                  <ContactOptionCard
                    icon={MessageCircle}
                    title={t('shop.contact.options.whatsapp.title')}
                    availability={`${t('shop.contact.status.always')} • ${t('shop.contact.options.whatsapp.availability')}`}
                    buttonText={t('shop.contact.options.whatsapp.button')}
                    buttonAction={handleWhatsAppClick}
                    status="24/7"
                  />
                  
                  <ContactOptionCard
                    icon={Mail}
                    title={t('shop.contact.options.email.title')}
                    availability={t('shop.contact.options.email.availability')}
                    buttonText="support@drinkmates.com"
                    buttonAction={handleEmailClick}
                    status="available"
                  />
                  
                  <ContactOptionCard
                    icon={MessageCircle}
                    title={t('shop.contact.options.chat.title')}
                    availability={
                      isChatStatusLoading
                        ? t('shop.contact.options.chat.checking')
                        : !isAuthenticated 
                          ? t('shop.contact.options.chat.loginRequired') 
                          : isChatOnline() 
                            ? `${t('shop.contact.status.available')} • ${t('shop.contact.options.chat.avgReply')}` 
                            : `${t('shop.contact.status.offline')} • ${t('shop.contact.options.chat.opensAt')} ${chatStatus.workingHours.start}`
                    }
                    buttonText={
                      isChatStatusLoading 
                        ? t('shop.contact.options.chat.buttonLoading')
                        : !isAuthenticated 
                          ? t('shop.contact.options.chat.buttonLogin') 
                          : t('shop.contact.options.chat.buttonStart')
                    }
                    buttonAction={handleChatClick}
                    status={
                      isChatStatusLoading
                        ? "offline"
                        : !isAuthenticated 
                          ? "login-required" 
                          : isChatOnline() 
                            ? "available" 
                            : "offline"
                    }
                    disabled={isChatStatusLoading || !isAuthenticated || !isChatOnline()}
                  />
                </div>
              </div>

              {/* FAQ Section */}
              <div>
                <h2 className="dm-heading-2 mb-6">{t('shop.contact.faq.heading')}</h2>
                <div className="dm-card mb-6">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder={t('shop.contact.faq.searchPlaceholder')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="dm-search w-full"
                    />
                  </div>
                </div>

                {filteredFaqCategories.length > 0 ? (
                  <div className="space-y-4">
                    {filteredFaqCategories.map((category) => (
                      <FAQAccordion
                        key={category.id}
                        category={category.title}
                        questions={category.questions}
                        isExpanded={expandedFAQ === category.id}
                        onToggle={() => setExpandedFAQ(expandedFAQ === category.id ? null : category.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      {language === 'AR' 
                        ? 'لا توجد نتائج للبحث. حاول استخدام كلمات مختلفة.'
                        : 'No search results found. Try using different keywords.'}
                    </p>
                  </div>
                )}
                  
                  <div className="text-center pt-4">
                    <button
                      onClick={() => {
                        const subject = encodeURIComponent('FAQ Question')
                        const body = encodeURIComponent('I couldn\'t find the answer to my question in the FAQ. Here\'s what I need help with:\n\n')
                        window.open(`mailto:support@drinkmates.com?subject=${subject}&body=${body}`)
                      }}
                      className="dm-btn px-8 py-3 dm-shine"
                    >
                      <HelpCircle className="h-4 w-4 mr-2" />
                      {t('shop.contact.faq.cta')}
                    </button>
                  </div>
                </div>

              {/* Contact Form */}
              <ContactForm />
            </div>
          </div>
        </section>

        {/* Maps Section */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('shop.contact.map.visit')}</h2>
              <p className="text-lg text-gray-600">{t('shop.contact.map.seeUs')}</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Map */}
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg">
                <iframe
                  src="https://maps.google.com/maps?q=As+Salamah,Jeddah,Saudi+Arabia&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 w-full h-full"
                  title="Office Location Map"
                />
                <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#12d6fa] rounded-full flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{t('shop.contact.map.city')}</h3>
                        <p className="text-sm text-gray-600">{t('shop.contact.map.country')}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <a
                        href="https://maps.google.com/?q=As+Salamah,Jeddah,Saudi+Arabia"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 bg-[#12d6fa] text-white rounded-md hover:bg-[#0fb8d9] transition-colors text-sm"
                      >
                        <MapPin className="h-3 w-3 mr-1" />
                        {t('shop.contact.map.googleMaps')}
                      </a>
                      <a
                        href="https://maps.apple.com/?q=As+Salamah,Jeddah,Saudi+Arabia"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors text-sm"
                      >
                        <MapPin className="h-3 w-3 mr-1" />
                        {t('shop.contact.map.appleMaps')}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact Information */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('shop.contact.map.officeInfo')}</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-[#12d6fa]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <MapPin className="h-4 w-4 text-[#12d6fa]" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{t('shop.contact.map.address')}</p>
                        <p className="text-gray-600">{t('shop.contact.map.city')}<br />{t('shop.contact.map.country')}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-[#12d6fa]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <Clock className="h-4 w-4 text-[#12d6fa]" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{t('shop.contact.map.businessHours')}</p>
                        <p className="text-gray-600">Sunday - Thursday: 9:00 AM - 6:00 PM<br />Friday - Saturday: Closed</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-[#12d6fa]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <Phone className="h-4 w-4 text-[#12d6fa]" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{t('shop.contact.map.phone')}</p>
                        <p className="text-gray-600">+966544671116</p>
                        <p className="text-gray-600 font-bold">TOLL FREE NUMBER: 920016893</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('shop.contact.map.getDirections')}</h3>
                  <p className="text-gray-600 mb-4">{t('shop.contact.map.getDirections')}</p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="https://maps.google.com/?q=As+Salamah,Jeddah,Saudi+Arabia"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-[#12d6fa] text-white rounded-lg hover:bg-[#0fb8d9] transition-colors"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      {t('shop.contact.map.googleMaps')}
                    </a>
                    <a
                      href="https://maps.apple.com/?q=As+Salamah,Jeddah,Saudi+Arabia"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      {t('shop.contact.map.appleMaps')}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

// Main Export with Provider
export default function ContactPage() {
  return (
    <ContactProvider>
      <ContactPageContent />
    </ContactProvider>
  )
}
