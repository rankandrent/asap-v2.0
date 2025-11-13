import { useState, useEffect, useRef } from 'react'
import { X, Send, Bot, Minimize2, Maximize2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { submitRFQ } from '../../lib/rfqQueries'
import type { RFQFormData } from '../../types/rfq'

interface Message {
  id: string
  type: 'bot' | 'user'
  content: string
  timestamp: Date
  quickReplies?: string[]
  suggestions?: Array<{ part: string; description: string }>
}

interface ChatState {
  stage: 'greeting' | 'requirement' | 'quantity' | 'urgency' | 'contact' | 'complete'
  data: Partial<RFQFormData & { requirements: string }>
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [chatState, setChatState] = useState<ChatState>({
    stage: 'greeting',
    data: {}
  })
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage(
        "👋 Hi! I'm your AI assistant. I can help you find parts and get quotes in seconds!\n\nWhat are you looking for today?",
        ['Standoffs', 'Fasteners', 'Spacers', 'Not sure - describe my need']
      )
    }
  }, [isOpen])

  const addBotMessage = (content: string, quickReplies?: string[], suggestions?: Array<{ part: string; description: string }>) => {
    setIsTyping(true)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'bot',
        content,
        timestamp: new Date(),
        quickReplies,
        suggestions
      }])
      setIsTyping(false)
    }, 500)
  }

  const addUserMessage = (content: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    }])
  }

  const handleQuickReply = (reply: string) => {
    addUserMessage(reply)
    handleUserInput(reply)
  }

  const handleUserInput = (input: string) => {
    const lowerInput = input.toLowerCase()

    switch (chatState.stage) {
      case 'greeting':
        // Analyze requirement
        setChatState(prev => ({
          ...prev,
          stage: 'requirement',
          data: { ...prev.data, requirements: input }
        }))
        
        if (lowerInput.includes('standoff') || lowerInput.includes('spacer') || lowerInput.includes('fastener')) {
          addBotMessage(
            `Great! I found these matching your need:\n\n🔧 ${extractCategory(input)} - Multiple options available\n\nHow many units do you need?`,
            ['1-10', '10-100', '100-500', '500+']
          )
          setChatState(prev => ({
            ...prev,
            stage: 'quantity',
            data: { ...prev.data, part_description: input }
          }))
        } else {
          addBotMessage(
            "I can help you find the right part! Could you tell me:\n\n• What material? (brass, aluminum, steel, etc.)\n• What size?\n• What's the application?",
            ['Brass Standoffs', 'Aluminum Spacers', 'Steel Fasteners', 'Browse Catalog']
          )
        }
        break

      case 'quantity':
        const qty = extractNumber(input) || 1
        setChatState(prev => ({
          ...prev,
          stage: 'urgency',
          data: { ...prev.data, quantity: qty }
        }))
        
        addBotMessage(
          `Perfect! ${qty} units noted.\n\n⏰ How urgent is this request?`,
          ['Standard (5-7 days)', 'Urgent (2-3 days)', 'Critical (Next day)']
        )
        break

      case 'urgency':
        const urgency = lowerInput.includes('urgent') ? 'urgent' : 
                       lowerInput.includes('critical') ? 'critical' : 'standard'
        
        setChatState(prev => ({
          ...prev,
          stage: 'contact',
          data: { ...prev.data, urgency }
        }))
        
        addBotMessage(
          `Got it! ${urgency === 'critical' ? '🔥 Priority request' : urgency === 'urgent' ? '⚡ Rush order' : '✅ Standard delivery'}\n\nTo send you the best quote, I need:\n\n📧 Your email address\n👤 Your name\n📞 Phone number (optional)\n\nPlease share your contact info:`,
          ["I'll fill a form instead"]
        )
        break

      case 'contact':
        const email = extractEmail(input)
        const name = extractName(input)
        
        if (email) {
          setChatState(prev => ({
            ...prev,
            stage: 'complete',
            data: { ...prev.data, email, name: name || 'Customer' }
          }))
          
          submitQuote()
        } else {
          addBotMessage(
            "I couldn't find a valid email. Could you provide:\n\n📧 email@company.com\n👤 Your Name\n📞 Phone (optional)",
            ['Use form instead']
          )
        }
        break
    }
  }

  const submitQuote = async () => {
    const { data } = chatState

    try {
      const rfqData: RFQFormData = {
        name: data.name || 'AI Chat User',
        email: data.email!,
        phone: data.phone,
        company: data.company,
        part_description: data.part_description || data.requirements || 'Parts inquiry',
        quantity: data.quantity || 1,
        urgency: data.urgency || 'standard',
        message: `From AI Chatbot - ${data.requirements || ''}`
      }

      const trackingData = {
        sourcePage: 'AI Chatbot',
        sourceUrl: window.location.href,
        referrer: document.referrer || undefined,
        userAgent: navigator.userAgent
      }

      await submitRFQ(rfqData, trackingData)

      addBotMessage(
        `✅ Perfect! Your quote request has been submitted!\n\n📧 We'll send you competitive pricing within 24 hours to ${data.email}\n\n🎉 Reference: #${Date.now().toString().slice(-6)}\n\nAnything else I can help with?`,
        ['Find more parts', 'Check order status', 'Contact support', 'Close chat']
      )
    } catch (error) {
      addBotMessage(
        "❌ Oops! Something went wrong. Let me help you another way:\n\n1. Call us: +1 (714) 705-4780\n2. Email: quotes@asap-amatom.com\n3. Or try again",
        ['Try again', 'Close chat']
      )
    }
  }

  const extractCategory = (input: string): string => {
    const lower = input.toLowerCase()
    if (lower.includes('standoff')) return 'Standoffs'
    if (lower.includes('spacer')) return 'Spacers'
    if (lower.includes('fastener')) return 'Fasteners'
    return 'Parts'
  }

  const extractNumber = (input: string): number | null => {
    const match = input.match(/(\d+)/)
    return match ? parseInt(match[1]) : null
  }

  const extractEmail = (input: string): string | null => {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
    const match = input.match(emailRegex)
    return match ? match[0] : null
  }

  const extractName = (input: string): string | null => {
    const words = input.split(/\s+/)
    const filtered = words.filter(w => !w.includes('@') && w.length > 2)
    return filtered.length >= 2 ? filtered.slice(0, 2).join(' ') : filtered[0] || null
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return
    
    addUserMessage(inputValue)
    handleUserInput(inputValue)
    setInputValue('')
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full p-4 shadow-2xl hover:scale-110 transition-transform animate-bounce"
      >
        <Bot className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
          1
        </span>
      </button>
    )
  }

  return (
    <div
      className={`fixed z-50 bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ${
        isMinimized 
          ? 'bottom-6 right-6 w-80 h-16' 
          : 'bottom-6 right-6 w-96 h-[600px]'
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bot className="h-6 w-6" />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
          </div>
          <div>
            <div className="font-semibold">AI Assistant</div>
            <div className="text-xs text-blue-100">Online • Fast Response</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-white/20 p-2 rounded-lg transition"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-white/20 p-2 rounded-lg transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div key={message.id}>
                <div
                  className={`flex ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                  </div>
                </div>

                {/* Quick Replies */}
                {message.quickReplies && (
                  <div className="flex flex-wrap gap-2 mt-2 ml-2">
                    {message.quickReplies.map((reply, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickReply(reply)}
                        className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-1 rounded-full text-xs font-medium transition"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t rounded-b-2xl">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              ⚡ Avg response time: 2 seconds
            </p>
          </div>
        </>
      )}
    </div>
  )
}

