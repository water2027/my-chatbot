'use server'

import type { Message } from '@/types/message'
import { createStreamableValue } from 'ai/rsc'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.API_KEY || '',
  baseURL: process.env.BASE_URL || '',
})

export function streamChatResponse(messages: Message[], model: string) {
  const stream = createStreamableValue('')

  ;(async () => {
    try {
      const response = await openai.chat.completions.create({
        model,
        messages,
        stream: true,
      })

      for await (const chunk of response) {
        const content = chunk.choices[0]?.delta?.content
        if (content) {
          stream.update(content)
        }
      }
    }
    catch (error) {
      console.error('Stream error:', error)
      stream.error('Failed to stream response')
    }
    finally {
      stream.done()
    }
  })()

  return { stream: stream.value }
}
