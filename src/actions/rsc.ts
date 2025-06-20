'use server'

import type { Message } from '@/types/message'
import { createStreamableValue } from 'ai/rsc'
import { redirect } from 'next/navigation'
import { OpenAI } from 'openai'
import UserService from '@/utils/UserService'

const openai = new OpenAI({
  apiKey: process.env.API_KEY || '',
  baseURL: process.env.BASE_URL || '',
})

export async function streamChatResponse(messages: Message[], model: string) {
  const userInfo = await UserService.getUserInfo()
  if (!userInfo || !userInfo.token) {
    redirect('/auth/login')
  }
  if (userInfo.token <= 0) {
    redirect('/auth/error?error=tokenNotEnough&error_detail=Your token is not enough, please recharge it.&redirect_uri=/')
  }
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
        else {
          const tokenUsage = chunk.usage?.total_tokens
          if (!tokenUsage && tokenUsage !== 0)
            continue
          await UserService.updateToken(-tokenUsage)
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
