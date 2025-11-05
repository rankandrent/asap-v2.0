import { useState, useEffect, useRef } from 'react'
import { X, Send, Bot, Minimize2, Maximize2, CheckCircle, XCircle, Search } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { submitRFQ } from '../../lib/rfqQueries'
import { checkPartAvailability, extractPartNumber, searchPartsByDescription } from '../../lib/partLookup'
import { generateChatResponse, type ChatMessage, type PartInfo } from '../../lib/openai'
import type { RFQFormData } from '../../types/rfq'
import type { Part } from '../../types/part'

interface Message {
  id: string
  type: 'bot' | 'user' | 'system'
  content: string
  timestamp: Date
  partInfo?: {
    available: boolean
    partNumber: string
    part?: Part
    alternatives?: Part[]
  }
}

export default function AISmartChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([])
  const [customerInfo, setCustomerInfo] = useState<{
    name?: string
    email?: string
    phone?: string
    requirements?: string
    partNumber?: string
    quantity?: number
    urgency?: 'standard' | 'urgent' | 'critical'
  }>({})
  
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
        "👋 Hi! I'm your AI assistant with access to our complete inventory of 500,000+ parts!\n\n" +
        "I can:\n" +
        "✅ Check real-time availability\n" +
        "✅ Find specific part numbers\n" +
        "✅ Suggest alternatives\n" +
        "✅ Get you instant quotes\n\n" +
        "What can I help you find today?"
      )
    }
  }, [isOpen])

  const addBotMessage = (content: string, partInfo?: Message['partInfo']) => {
    const msg: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content,
      timestamp: new Date(),
      partInfo
    }
    setMessages(prev => [...prev, msg])
    
    // Add to conversation history for GPT
    setConversationHistory(prev => [
      ...prev,
      { role: 'assistant', content }
    ])
  }

  const addUserMessage = (content: string) => {
    const msg: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, msg])
    
    // Add to conversation history for GPT
    setConversationHistory(prev => [
      ...prev,
      { role: 'user', content }
    ])
  }

  const addSystemMessage = (content: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'system',
      content,
      timestamp: new Date()
    }])
  }

  const handleUserInput = async (input: string) => {
    setIsTyping(true)

    try {
      // Step 1: Check if user mentioned a specific part number
      const partNumber = extractPartNumber(input)
      
      if (partNumber) {
        // User mentioned specific part - check availability
        addSystemMessage(`🔍 Checking availability for ${partNumber}...`)
        
        const availability = await checkPartAvailability(partNumber)
        
        if (availability.available && availability.part) {
          // Part is available!
          const partInfo: PartInfo = {
            available: true,
            partNumber: availability.part.productname,
            quantity: 100, // Assume we have stock
            category: availability.part.category,
            subcategory: availability.part.sub_category,
            description: availability.part.description
          }
          
          const gptResponse = await generateChatResponse(conversationHistory, partInfo)
          
          addBotMessage(
            gptResponse + 
            `\n\n📦 Part: ${availability.part.productname}\n` +
            `📁 Category: ${availability.part.category}\n` +
            `🏷️ Type: ${availability.part.sub_category}\n\n` +
            `How many units do you need?`,
            {
              available: true,
              partNumber: availability.part.productname,
              part: availability.part
            }
          )
          
          setCustomerInfo(prev => ({
            ...prev,
            partNumber: availability.part!.productname,
            requirements: input
          }))
        } else if (availability.alternativeParts && availability.alternativeParts.length > 0) {
          // Found similar parts
          const alternatives = availability.alternativeParts.slice(0, 3)
          const partsList = alternatives.map((p, i) => 
            `${i + 1}. ${p.productname} - ${p.sub_category}`
          ).join('\n')
          
          addBotMessage(
            `I couldn't find exact match for ${partNumber}, but I found similar parts:\n\n${partsList}\n\n` +
            `Would any of these work? Or should I check with our procurement team to source the exact part?`,
            {
              available: true,
              partNumber: partNumber,
              alternatives
            }
          )
        } else {
          // Part not available - but we can arrange it!
          const partInfo: PartInfo = {
            available: false,
            partNumber: partNumber
          }
          
          const gptResponse = await generateChatResponse(conversationHistory, partInfo)
          
          addBotMessage(
            gptResponse + 
            `\n\n💪 Our procurement team has access to:\n` +
            `• 100+ trusted suppliers worldwide\n` +
            `• Fast sourcing (24-48 hours)\n` +
            `• Competitive pricing guaranteed\n\n` +
            `How many units do you need? I'll get you a quote ASAP!`
          )
          
          setCustomerInfo(prev => ({
            ...prev,
            partNumber: partNumber,
            requirements: input
          }))
        }
      } else {
        // General query - use GPT to respond naturally
        const keywords = input.toLowerCase()
        let partInfo: PartInfo | undefined

        // Check if user is asking about categories
        if (keywords.includes('standoff') || keywords.includes('spacer') || keywords.includes('fastener')) {
          const category = keywords.includes('standoff') ? 'Standoffs' :
                          keywords.includes('spacer') ? 'Spacers' : 'Fasteners'
          
          addSystemMessage(`🔍 Searching ${category}...`)
          
          const parts = await searchPartsByDescription(category)
          
          if (parts.length > 0) {
            const sampleParts = parts.slice(0, 3)
            const partsList = sampleParts.map((p, i) => 
              `${i + 1}. ${p.productname} - ${p.sub_category}`
            ).join('\n')
            
            addBotMessage(
              `Great! We have ${parts.length}+ ${category} available. Here are some examples:\n\n${partsList}\n\n` +
              `Do you have a specific part number, or should I help you find the right one?`
            )
            
            setCustomerInfo(prev => ({
              ...prev,
              requirements: input
            }))
          }
        } else {
          // General conversation - use GPT
          const gptResponse = await generateChatResponse(conversationHistory)
          addBotMessage(gptResponse)
          
          // Check if we need to collect contact info
          if (conversationHistory.length >= 4 && !customerInfo.email) {
            setTimeout(() => {
              addBotMessage(
                "To send you a detailed quote, I'll need your:\n\n" +
                "📧 Email address\n" +
                "👤 Name\n" +
                "📞 Phone (optional)\n\n" +
                "Please share your contact info:"
              )
            }, 1000)
          }
        }
      }

      // Extract contact information if provided
      const email = extractEmail(input)
      if (email) {
        setCustomerInfo(prev => ({ ...prev, email }))
        
        // If we have enough info, submit RFQ
        if (customerInfo.partNumber || customerInfo.requirements) {
          await submitQuote({ ...customerInfo, email })
        }
      }
      
      const quantity = extractQuantity(input)
      if (quantity) {
        setCustomerInfo(prev => ({ ...prev, quantity }))
      }
      
    } catch (error) {
      console.error('Chat error:', error)
      addBotMessage(
        "I apologize for the technical difficulty. Let me connect you with our team directly:\n\n" +
        "📧 Email: quotes@asapamatom.com\n" +
        "📞 Phone: (555) 000-0000\n\n" +
        "Or try asking your question again?"
      )
    } finally {
      setIsTyping(false)
    }
  }

  const submitQuote = async (info: typeof customerInfo) => {
    try {
      if (!info.email) return

      const rfqData: RFQFormData = {
        name: info.name || 'AI Chat User',
        email: info.email,
        phone: info.phone,
        part_number: info.partNumber,
        part_description: info.requirements || 'Parts inquiry via AI Chat',
        quantity: info.quantity || 1,
        urgency: info.urgency || 'standard',
        message: `Conversation via AI Chatbot\nRequirements: ${info.requirements || 'See part number'}`
      }

      const trackingData = {
        sourcePage: 'AI Smart Chatbot',
        sourceUrl: window.location.href,
        referrer: document.referrer || undefined,
        userAgent: navigator.userAgent
      }

      await submitRFQ(rfqData, trackingData)

      addBotMessage(
        `🎉 Excellent! Your quote request has been submitted!\n\n` +
        `📧 Confirmation sent to: ${info.email}\n` +
        `📦 Part: ${info.partNumber || 'As discussed'}\n` +
        `📊 Quantity: ${info.quantity || 'TBD'}\n` +
        `⏰ Response time: Within 24 hours\n\n` +
        `Reference: #${Date.now().toString().slice(-6)}\n\n` +
        `Anything else I can help you with?`
      )
    } catch (error) {
      addBotMessage(
        "There was an issue submitting your request. Please email us directly at quotes@asapamatom.com or call (555) 000-0000."
      )
    }
  }

  const extractEmail = (text: string): string | null => {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
    const match = text.match(emailRegex)
    return match ? match[0] : null
  }

  const extractQuantity = (text: string): number | null => {
    const qtyRegex = /\b(\d{1,6})\s*(units?|pcs?|pieces?|quantity)?\b/i
    const match = text.match(qtyRegex)
    return match ? parseInt(match[1]) : null
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
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full p-4 shadow-2xl hover:scale-110 transition-transform"
      >
        <Bot className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
          AI
        </span>
      </button>
    )
  }

  return (
    <div
      className={`fixed z-50 bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ${
        isMinimized 
          ? 'bottom-6 right-6 w-80 h-16' 
          : 'bottom-6 right-6 w-[420px] h-[650px]'
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bot className="h-6 w-6" />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
          </div>
          <div>
            <div className="font-semibold flex items-center gap-2">
              AI Assistant 
              <Badge className="bg-green-500 text-xs">GPT-Powered</Badge>
            </div>
            <div className="text-xs text-blue-100">Real-time inventory access • 500K+ parts</div>
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
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((message) => (
              <div key={message.id}>
                <div
                  className={`flex ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.type === 'system' ? (
                    <div className="w-full flex items-center justify-center gap-2 text-xs text-gray-500 my-2">
                      <Search className="h-3 w-3 animate-spin" />
                      {message.content}
                    </div>
                  ) : (
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                          : 'bg-white border-2 border-gray-100 text-gray-900 shadow-sm'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
                      
                      {/* Part availability indicator */}
                      {message.partInfo && (
                        <div className={`mt-3 p-2 rounded-lg ${message.partInfo.available ? 'bg-green-50' : 'bg-yellow-50'}`}>
                          {message.partInfo.available ? (
                            <div className="flex items-center gap-2 text-xs">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-green-700 font-medium">In Stock</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-xs">
                              <XCircle className="h-4 w-4 text-yellow-600" />
                              <span className="text-yellow-700 font-medium">Can Source</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border-2 border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
                placeholder="Ask about part numbers, availability..."
                className="flex-1 border-2 border-gray-200 focus:border-blue-500"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>🤖 Powered by GPT-3.5</span>
              <span>⚡ Instant availability check</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

