// OpenAI API integration for AI Chatbot

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || ''

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface PartInfo {
  available: boolean
  partNumber: string
  quantity?: number
  category?: string
  subcategory?: string
  description?: string
}

export const generateChatResponse = async (
  messages: ChatMessage[],
  partInfo?: PartInfo
): Promise<string> => {
  try {
    // Build system prompt with part information
    const systemPrompt = buildSystemPrompt(partInfo)
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 200
      })
    })

    if (!response.ok) {
      throw new Error('OpenAI API error')
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error('OpenAI API Error:', error)
    // Fallback to template responses if API fails
    return generateFallbackResponse(partInfo)
  }
}

function buildSystemPrompt(partInfo?: PartInfo): string {
  let prompt = `You are a helpful sales assistant for ASAP-Amatom.com, a supplier of aerospace and industrial parts. 

Your goals:
1. Help customers find the parts they need
2. Check part availability in real-time
3. Gather customer information quickly
4. Convert conversations to quote requests in 3-5 messages

Tone: Professional, friendly, helpful, and persuasive.
Keep responses SHORT (2-3 sentences max).
Always be optimistic and solution-oriented.`

  if (partInfo) {
    if (partInfo.available) {
      prompt += `\n\nCURRENT PART STATUS:
✅ AVAILABLE: ${partInfo.partNumber}
Category: ${partInfo.category || 'Parts'}
Subcategory: ${partInfo.subcategory || 'Various'}
${partInfo.description ? `Description: ${partInfo.description}` : ''}
${partInfo.quantity ? `Stock: ${partInfo.quantity}+ units available` : 'In stock'}

Tell the customer this part IS AVAILABLE and you can get them a competitive quote within 24 hours!`
    } else {
      prompt += `\n\nCURRENT PART STATUS:
⚠️ NOT IN STOCK: ${partInfo.partNumber}

IMPORTANT: Don't say "we don't have it" directly. Instead:
1. Acknowledge the request positively
2. Say "Let me check with our procurement team"
3. Emphasize that you can SOURCE it from trusted suppliers
4. Mention 24-48 hour response time with pricing and availability
5. Say "We have extensive supplier network" or "We can arrange this for you"
6. Be confident that your team will find it

Keep customer engaged and optimistic!`
    }
  }

  return prompt
}

function generateFallbackResponse(partInfo?: PartInfo): string {
  if (!partInfo) {
    return "I'd be happy to help you find the right parts! Could you tell me what you're looking for?"
  }

  if (partInfo.available) {
    return `Great news! ✅ ${partInfo.partNumber} is available in our inventory. We have ${partInfo.quantity || 'multiple'} units in stock. How many do you need?`
  } else {
    return `I see you're looking for ${partInfo.partNumber}. While this specific part isn't currently in our warehouse, we have an extensive supplier network and can arrange it for you. Our procurement team can source it within 24-48 hours. How many units do you need? Let me get you a competitive quote!`
  }
}

export const generatePartLookupPrompt = (userMessage: string): string => {
  return `User is asking about: "${userMessage}"

Extract ANY part numbers, product codes, or specific part names mentioned.
Common formats:
- Alphanumeric: 17300-B-0256-0, MS21209-C4, NAS1149
- With dashes/underscores: ABC-123-XYZ
- Model numbers: 12345-A, PART-789

Return ONLY the part number if found, or "NONE" if no specific part is mentioned.`
}

