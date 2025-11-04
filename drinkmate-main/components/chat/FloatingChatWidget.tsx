'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { MessageCircle, X, Send, Minimize2, Maximize2, User, Clock, CheckCircle } from 'lucide-react'
import { useSocket } from '@/lib/contexts/socket-context'
import { useAuth, getAuthToken } from '@/lib/contexts/auth-context'
import { useChatStatus } from '@/lib/contexts/chat-status-context'
import { Message } from '@/types/chat'

interface ChatSession {
  _id: string
  sessionId: string
  status: 'active' | 'closed' | 'pending'
  customer: {
    name: string
    email: string
    userId?: string
  }
  assignedTo?: {
    firstName: string
    lastName: string
  }
  lastMessageAt: Date
  messages: Message[]
}

interface FloatingChatWidgetProps {
  isOnline: boolean
}

const DESKTOP_DEFAULT = { w: 360, h: 520 }
const STORAGE_KEY = 'chat:size:v1'

export default function FloatingChatWidget({ isOnline }: FloatingChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isFull, setIsFull] = useState(false)
  const [size, setSize] = useState(DESKTOP_DEFAULT)
  const [isMobile, setIsMobile] = useState(false)
  const [chatSession, setChatSession] = useState<ChatSession | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const boxRef = useRef<HTMLDivElement>(null)

  const { socket, isConnected, joinChat, leaveChat, sendMessage, startTyping, stopTyping } = useSocket()
  const { user, isAuthenticated } = useAuth()
  const { chatStatus } = useChatStatus()

  // Listen for external chat open events
  useEffect(() => {
    const handleOpenChatEvent = () => {
      if (isAuthenticated && isChatOnline()) {
        setIsOpen(true)
      }
    }

    window.addEventListener('openChatWidget', handleOpenChatEvent)
    
    return () => {
      window.removeEventListener('openChatWidget', handleOpenChatEvent)
    }
  }, [isAuthenticated])

  const isChatOnline = () => {
    return chatStatus.isOnline
  }

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 767px)').matches)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Load/save size (desktop only)
  useEffect(() => {
    if (isMobile) return
    
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        try { 
          setSize(JSON.parse(raw)) 
        } catch (e) {
          console.warn('Failed to parse saved chat size:', e)
        }
      }
    }
  }, [isMobile])

  useEffect(() => {
    if (isMobile || typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(size))
  }, [size, isMobile])

  // Custom drag handle (works everywhere)
  useEffect(() => {
    const el = boxRef.current
    const handle = el?.querySelector<HTMLElement>('.chat-resize-handle')
    if (!el || !handle || isMobile) return

    let startX = 0, startY = 0, startW = 0, startH = 0, dragging = false
    
    const onDown = (e: MouseEvent | TouchEvent) => {
      dragging = true
      const p = 'touches' in e ? e.touches[0] : e
      startX = p.clientX
      startY = p.clientY
      startW = el.offsetWidth
      startH = el.offsetHeight
      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onUp)
      document.addEventListener('touchmove', onMove, { passive: false })
      document.addEventListener('touchend', onUp)
    }
    
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging) return
      if ('preventDefault' in e) e.preventDefault()
      const p = 'touches' in e ? e.touches[0] : e
      const w = Math.max(280, Math.min(window.innerWidth * 0.92, startW + (p.clientX - startX)))
      const h = Math.max(360, Math.min(window.innerHeight - 120, startH + (p.clientY - startY)))
      setSize({ w, h })
      el.style.width = `${w}px`
      el.style.height = `${h}px`
    }
    
    const onUp = () => {
      dragging = false
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      document.removeEventListener('touchmove', onMove as any)
      document.removeEventListener('touchend', onUp)
    }

    handle.addEventListener('mousedown', onDown)
    handle.addEventListener('touchstart', onDown, { passive: true })
    return () => {
      handle.removeEventListener('mousedown', onDown)
      handle.removeEventListener('touchstart', onDown)
      onUp()
    }
  }, [isMobile])

  // Lock body scroll for mobile full-screen
  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.classList.add('chat-open')
    } else {
      document.body.classList.remove('chat-open')
    }
    
    return () => {
      document.body.classList.remove('chat-open')
    }
  }, [isOpen, isMobile])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
    
    return undefined
  }, [isOpen])

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatSession?.messages])

  // Create or get existing chat session when opened
  useEffect(() => {
    if (isOpen && user && isAuthenticated && isConnected) {
      createOrGetChatSession()
    }
  }, [isOpen, user, isAuthenticated, isConnected])

  // Join chat room when chat session is available and socket is connected
  // CRITICAL: Must join BEFORE sending messages to receive real-time updates
  useEffect(() => {
    if (chatSession && isConnected && socket) {
      console.log('🔥 FloatingChatWidget: Joining chat room after connection:', chatSession._id)
      joinChat(chatSession._id)
    }
  }, [chatSession, isConnected, socket, joinChat])

  // Also join chat room when widget is opened
  useEffect(() => {
    if (isOpen && chatSession && isConnected && socket) {
      console.log('🔥 FloatingChatWidget: Joining chat room when widget opened:', chatSession._id)
      joinChat(chatSession._id)
    }
  }, [isOpen, chatSession, isConnected, socket, joinChat])

  // Ensure we're in the room before sending messages
  const ensureInRoom = useCallback(() => {
    if (chatSession && socket && isConnected) {
      // Join the room if not already joined (socket.io handles this gracefully)
      joinChat(chatSession._id)
    }
  }, [chatSession, socket, isConnected, joinChat])

  // Polling fallback when socket is not connected
  useEffect(() => {
    if (!chatSession || isConnected) {
      // Don't poll if socket is connected
      return
    }

    console.log('🔥 FloatingChatWidget: Socket not connected, starting polling fallback')

    const pollInterval = setInterval(async () => {
      try {
        const token = getAuthToken()
        if (!token || !chatSession) return

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/chat/${chatSession._id}/messages`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data?.chat?.messages) {
            const processedMessages = data.data.chat.messages.map((msg: any): Message => ({
              id: msg._id || msg.id,
              content: msg.content,
              sender: msg.sender === 'admin' || msg.sender === 'agent' ? 'agent' : 'customer',
              timestamp: msg.createdAt || msg.timestamp,
              isNote: msg.isNote || false,
              attachments: msg.attachments || [],
              readAt: msg.readAt,
              status: msg.status || 'sent'
            }))

            // Only update if messages changed
            setChatSession(prev => {
              if (!prev) return null
              
              const prevIds = new Set(prev.messages.map((m: Message) => m.id))
              const newIds = new Set(processedMessages.map((m: Message) => m.id))
              
              if (prev.messages.length !== processedMessages.length || 
                  prevIds.size !== newIds.size || 
                  [...prevIds].some(id => !newIds.has(id))) {
                console.log(`🔥 FloatingChatWidget: Polling detected new messages`)
                return {
                  ...prev,
                  messages: processedMessages
                }
              }
              
              return prev
            })
          }
        }
      } catch (error) {
        console.error('🔥 FloatingChatWidget: Polling error:', error)
      }
    }, 3000) // Poll every 3 seconds

    return () => {
      clearInterval(pollInterval)
    }
  }, [chatSession, isConnected, getAuthToken])

  // Socket event listeners
  useEffect(() => {
    if (!socket) {
      console.log('🔥 FloatingChatWidget: No socket available for event listeners')
      return
    }

    console.log('🔥 FloatingChatWidget: Setting up socket event listeners, chatSession:', chatSession?._id)

    const handleNewMessage = (data: { chatId: string; message: any }) => {
      console.log('🔥 FloatingChatWidget: New message received:', data)
      console.log('🔥 FloatingChatWidget: Current chat session ID:', chatSession?._id)
      console.log('🔥 FloatingChatWidget: Socket connected:', isConnected)
      console.log('🔥 FloatingChatWidget: Message sender:', data.message?.sender, 'senderId:', data.message?.senderId)
      
      // Ensure we're still in the room (in case of reconnection)
      if (chatSession && socket && isConnected) {
        ensureInRoom()
      }
      
      if (chatSession && data.chatId === chatSession._id) {
        setChatSession(prev => {
          if (!prev) return null
          
          // Extract message ID from the socket data
          const realMessageId = data.message._id || data.message.id
          
          // Check for duplicates by real database ID only
          const messageExists = prev.messages.some(msg => {
            // Check by real ID first (most reliable)
            if (realMessageId && (msg.id === realMessageId)) {
              return true
            }
            // For temporary IDs that match content, don't consider them duplicates if they're from the same sender
            // The socket message will replace the temp one
            if (msg.id.toString().startsWith('temp_') && msg.content === data.message.content) {
              const msgTime = new Date(msg.timestamp).getTime()
              const dataTime = new Date(data.message.timestamp || data.message.createdAt).getTime()
              // If timestamps are within 5 seconds and same sender, consider it a replacement candidate
              return Math.abs(msgTime - dataTime) < 5000 && msg.sender === (data.message.sender === 'admin' || data.message.sender === 'agent' ? 'agent' : 'customer')
            }
            
            return false
          })

          if (messageExists && !prev.messages.some(msg => msg.id.toString().startsWith('temp_') && msg.content === data.message.content)) {
            console.log('🔥 FloatingChatWidget: Duplicate message detected, skipping')
            return prev
          }

          // Check if we need to replace a temporary message
          const tempMessageIndex = prev.messages.findIndex(msg => {
            if (!msg.id.toString().startsWith('temp_')) {
              return false
            }
            const isSameSender = msg.sender === (data.message.sender === 'admin' || data.message.sender === 'agent' ? 'agent' : 'customer')
            const isSameContent = msg.content === data.message.content
            const msgTime = new Date(msg.timestamp).getTime()
            const dataTime = new Date(data.message.timestamp || data.message.createdAt).getTime()
            const isRecent = Math.abs(msgTime - dataTime) < 5000
            
            return isSameSender && isSameContent && isRecent
          })

          if (tempMessageIndex !== -1) {
            console.log('🔥 FloatingChatWidget: Replacing temporary message with real message')
            const updatedMessages = [...prev.messages]
            updatedMessages[tempMessageIndex] = {
              id: realMessageId || prev.messages[tempMessageIndex].id,
              content: data.message.content,
              sender: data.message.sender === 'admin' || data.message.sender === 'agent' ? 'agent' : 'customer',
              timestamp: data.message.timestamp || data.message.createdAt || new Date().toISOString(),
              isNote: data.message.isNote || false,
              attachments: data.message.attachments || [],
              readAt: data.message.readAt,
              status: data.message.status || 'sent'
            }
            return {
              ...prev,
              messages: updatedMessages
            }
          }

          // Create proper message object from socket data
          const newMessage: Message = {
            id: realMessageId || `msg_${Date.now()}`,
            content: data.message.content,
            sender: data.message.sender === 'admin' || data.message.sender === 'agent' ? 'agent' : 'customer',
            timestamp: data.message.timestamp || data.message.createdAt || new Date().toISOString(),
            isNote: data.message.isNote || false,
            attachments: data.message.attachments || [],
            readAt: data.message.readAt,
            status: data.message.status || 'sent'
          }

          console.log('🔥 FloatingChatWidget: Adding new message to chat')
          return {
            ...prev,
            messages: [...prev.messages, newMessage]
          }
        })
        
        // Increment unread count if chat is minimized or closed
        if (!isOpen) {
          setUnreadCount(prev => prev + 1)
        }
      }
    }

    const handleTyping = (data: { chatId: string; isTyping: boolean; user: string }) => {
      if (chatSession && data.chatId === chatSession._id) {
        setIsTyping(data.isTyping)
      }
    }

    const handleChatUpdate = (data: { chatId: string; status: string; assignedTo?: any }) => {
      if (chatSession && data.chatId === chatSession._id) {
        setChatSession(prev => prev ? {
          ...prev,
          status: data.status as any,
          assignedTo: data.assignedTo
        } : null)
      }
    }

    const handleChatCreated = (data: { chat: ChatSession }) => {
      // If this is a new chat for the current user, update the session
      if (data.chat.customer.email === user?.email) {
        setChatSession(data.chat)
        setIsOpen(true)
      }
    }

    const handleChatClosed = (data: { chatId: string }) => {
      if (chatSession && data.chatId === chatSession._id) {
        setChatSession(prev => prev ? {
          ...prev,
          status: 'closed'
        } : null)
      }
    }

    // Remove existing listeners first to prevent duplicates
    socket.off('new_message', handleNewMessage)
    socket.off('user_typing', handleTyping)
    socket.off('chat_updated', handleChatUpdate)
    socket.off('chat_created', handleChatCreated)
    socket.off('chat_closed', handleChatClosed)
    
    // Register new listeners
    socket.on('new_message', handleNewMessage)
    socket.on('user_typing', handleTyping)
    socket.on('chat_updated', handleChatUpdate)
    socket.on('chat_created', handleChatCreated)
    socket.on('chat_closed', handleChatClosed)

    console.log('🔥 FloatingChatWidget: Socket event listeners registered')

    return () => {
      console.log('🔥 FloatingChatWidget: Cleaning up socket event listeners')
      socket.off('new_message', handleNewMessage)
      socket.off('user_typing', handleTyping)
      socket.off('chat_updated', handleChatUpdate)
      socket.off('chat_created', handleChatCreated)
      socket.off('chat_closed', handleChatClosed)
    }
  }, [socket, chatSession, isOpen, isConnected, ensureInRoom])

  const createOrGetChatSession = async () => {
    try {
      setIsLoading(true)
      setError(null)

      if (!isAuthenticated || !user) {
        setError('Please log in to start a chat session.')
        return
      }

      const token = getAuthToken()
      
      if (!token) {
        setError('Please log in to start a chat session.')
        return
      }

      // Check if user has an existing active chat
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/chat/customer`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        const activeChat = data.data.chats.find((chat: ChatSession) => 
          chat.status === 'active' && chat.customer.userId === user?._id
        )

        if (activeChat) {
          setChatSession(activeChat)
          joinChat(activeChat._id)
        } else {
          // Create new chat session
          const newChatResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/chat`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              customer: {
                name: user?.name || user?.username || 'Unknown Customer',
                email: user?.email,
                userId: user?._id
              },
              category: 'general',
              priority: 'medium'
            })
          })

          if (newChatResponse.ok) {
            const newChatData = await newChatResponse.json()
            setChatSession(newChatData.data)
            joinChat(newChatData.data._id)
          } else {
            const errorData = await newChatResponse.json()
            throw new Error(errorData.message || 'Failed to create chat session')
          }
        }
      } else if (response.status === 401) {
        setError('Please log in to start a chat session.')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to fetch chat sessions')
      }
    } catch (err) {
      console.error('Error creating/getting chat session:', err)
      let errorMessage = 'Failed to start chat. Please try again.'
      
      if (err instanceof Error) {
        if (err.message.includes('401') || err.message.includes('Unauthorized')) {
          errorMessage = 'Please log in to start a chat session.'
        } else if (err.message.includes('403') || err.message.includes('Forbidden')) {
          errorMessage = 'You do not have permission to start a chat session.'
        } else if (err.message.includes('404') || err.message.includes('Not Found')) {
          errorMessage = 'Chat service is temporarily unavailable. Please try again later.'
        } else if (err.message.includes('500') || err.message.includes('Internal Server Error')) {
          errorMessage = 'Server error occurred. Please try again later.'
        } else if (err.message.includes('NetworkError') || err.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        } else {
          errorMessage = err.message
        }
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chatSession) return

    const messageContent = newMessage.trim()
    
    // Create optimistic message immediately
    const tempMessage: Message = {
      id: `temp_${Date.now()}`,
      content: messageContent,
      sender: 'customer',
      timestamp: new Date().toISOString(),
      isNote: false,
      attachments: [],
      status: 'sending'
    }
    
    // Add optimistic message to UI immediately
    setChatSession(prev => {
      if (!prev) return null
      return {
        ...prev,
        messages: [...prev.messages, tempMessage]
      }
    })
    
    // Clear input after adding optimistic message
    setNewMessage('')
    stopTyping(chatSession._id)

    try {
      // CRITICAL: Ensure we're in the room BEFORE sending message
      ensureInRoom()
      
      // Send via socket first (real-time)
      if (socket && isConnected) {
        sendMessage(chatSession._id, messageContent, 'text')
        // Update optimistic message status
        setChatSession(prev => {
          if (!prev) return null
          return {
            ...prev,
            messages: prev.messages.map(msg => 
              msg.id === tempMessage.id 
                ? { ...msg, status: 'sent' }
                : msg
            )
          }
        })
      }
      
      // Also send via API for persistence (fallback)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/chat/${chatSession._id}/message`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: messageContent,
          messageType: 'text'
        })
      })
      
      if (response.ok) {
        const responseData = await response.json()
        // Update optimistic message with real ID
        if (responseData.data?.message?._id) {
          setChatSession(prev => {
            if (!prev) return null
            return {
              ...prev,
              messages: prev.messages.map(msg => 
                msg.id === tempMessage.id 
                  ? { ...msg, id: responseData.data.message._id, status: 'sent' }
                  : msg
              )
            }
          })
        }
      }
    } catch (err) {
      console.error('Error sending message:', err)
      let errorMessage = 'Failed to send message. Please try again.'
      
      if (err instanceof Error) {
        if (err.message.includes('401') || err.message.includes('Unauthorized')) {
          errorMessage = 'Session expired. Please refresh the page and try again.'
        } else if (err.message.includes('403') || err.message.includes('Forbidden')) {
          errorMessage = 'You do not have permission to send messages to this chat.'
        } else if (err.message.includes('404') || err.message.includes('Not Found')) {
          errorMessage = 'Chat session not found. Please refresh the page.'
        } else if (err.message.includes('500') || err.message.includes('Internal Server Error')) {
          errorMessage = 'Server error occurred. Please try again later.'
        } else if (err.message.includes('NetworkError') || err.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        } else {
          errorMessage = err.message
        }
      }
      
      setError(errorMessage)
      
      // Mark optimistic message as failed
      setChatSession(prev => {
        if (!prev) return null
        return {
          ...prev,
          messages: prev.messages.map(msg => 
            msg.id === tempMessage.id 
              ? { ...msg, status: 'failed' }
              : msg
          )
        }
      })
      
      // Restore message to input so user can retry
      setNewMessage(messageContent)
      
      // Remove failed optimistic message after a delay
      setTimeout(() => {
        setChatSession(prev => {
          if (!prev) return null
          return {
            ...prev,
            messages: prev.messages.filter(msg => msg.id !== tempMessage.id)
          }
        })
      }, 3000)
    }
  }

  const handleTyping = () => {
    if (!chatSession) return

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    startTyping(chatSession._id)

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping(chatSession._id)
    }, 1000)
  }

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getStatusColor = () => {
    if (!chatSession) return 'bg-gray-100 text-gray-600'
    
    switch (chatSession.status) {
      case 'active':
        return 'bg-green-100 text-green-700'
      case 'closed':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-yellow-100 text-yellow-700'
    }
  }

  const getStatusText = () => {
    if (!chatSession) return 'Unknown'
    
    switch (chatSession.status) {
      case 'active':
        return chatSession.assignedTo ? 'Agent Connected' : 'Waiting for Agent'
      case 'closed':
        return 'Chat Closed'
      default:
        return 'Pending'
    }
  }


  const handleToggleChat = () => {
    if (!user) {
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

    setIsOpen(!isOpen)
    if (isOpen) {
      setUnreadCount(0)
      if (chatSession) {
        leaveChat(chatSession._id)
      }
    }
  }

  const handleCloseChat = () => {
    setIsOpen(false)
    setUnreadCount(0)
    if (chatSession) {
      leaveChat(chatSession._id)
    }
  }

  // Don't render if user is not authenticated
  if (!user || !isAuthenticated) {
    return null
  }

  // Inline size only on desktop
  const desktopStyle: React.CSSProperties = !isMobile
    ? { width: size.w, height: size.h }
    : {}

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleToggleChat}
          className="relative w-14 h-14 bg-[#04C4DB] hover:bg-[#02B4CA] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        >
          <MessageCircle className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          {!isOnline && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-400 rounded-full border-2 border-white"></div>
          )}
        </button>
      </div>

      {/* Chat Widget */}
      {isOpen && (
        <div
          ref={boxRef}
          className={`chat-widget ${isFull ? 'chat--fullscreen' : ''}`}
          style={desktopStyle}
          role="dialog"
          aria-label="Live chat"
          aria-modal={isMobile}
        >
          {/* Header */}
          <header className="chat-header">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#04C4DB] rounded-full flex items-center justify-center">
                <MessageCircle className="h-4 w-4 text-white" />
              </div>
              <div>
                <strong>Live Chat</strong>
                {chatSession && (
                  <span className="text-xs text-gray-500 ml-2">#{chatSession.sessionId.slice(-6)}</span>
                )}
              </div>
            </div>
            <div className="spacer" />
            <div className="flex items-center space-x-1">
              {/* Desktop controls */}
              {!isMobile && (
                <button 
                  onClick={() => setIsFull(v => !v)} 
                  aria-label={isFull ? 'Restore size' : 'Maximize'}
                  className="mr-2"
                >
                  {isFull ? '⤡' : '⤢'}
                </button>
              )}
              <button 
                onClick={handleCloseChat} 
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>
          </header>

          {/* Status Bar */}
          {chatSession && (
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">
                  {chatSession.assignedTo 
                    ? `Agent: ${chatSession.assignedTo.firstName} ${chatSession.assignedTo.lastName}`
                    : 'Waiting for an agent...'
                  }
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
                  {getStatusText()}
                </span>
              </div>
            </div>
          )}

          {/* Messages */}
          <main className="chat-body" role="log" aria-live="polite">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#04C4DB] mx-auto mb-2"></div>
                  <p className="text-gray-500 text-sm">Connecting...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <X className="h-4 w-4 text-red-600" />
                  </div>
                  <p className="text-red-600 text-sm mb-2">{error}</p>
                  {error.includes('log in') ? (
                    <button
                      onClick={() => window.location.href = '/login'}
                      className="px-3 py-1 bg-[#04C4DB] text-white text-xs rounded hover:bg-[#02B4CA] transition-colors"
                    >
                      Go to Login
                    </button>
                  ) : (
                    <button
                      onClick={createOrGetChatSession}
                      className="px-3 py-1 bg-[#04C4DB] text-white text-xs rounded hover:bg-[#02B4CA] transition-colors"
                    >
                      Try Again
                    </button>
                  )}
                </div>
              </div>
            ) : chatSession?.messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageCircle className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Start a conversation!</p>
                </div>
              </div>
            ) : (
              <>
                {chatSession?.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'customer' ? 'justify-end' : 'justify-start'} mb-3`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${
                        message.sender === 'customer'
                          ? 'bg-[#04C4DB] text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'customer' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatTime(new Date(message.timestamp))}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start mb-3">
                    <div className="bg-gray-100 text-gray-900 px-3 py-2 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </main>

          {/* Message Input */}
          {chatSession && chatSession.status === 'active' && (
            <footer className="chat-footer">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value)
                    handleTyping()
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#04C4DB] focus:border-transparent text-sm"
                  disabled={!isConnected}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || !isConnected}
                  className="p-2 bg-[#04C4DB] text-white rounded-full hover:bg-[#02B4CA] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </footer>
          )}

          {/* Desktop drag handle */}
          {!isMobile && <div className="chat-resize-handle" aria-hidden="true" />}
        </div>
      )}
    </>
  )
}
