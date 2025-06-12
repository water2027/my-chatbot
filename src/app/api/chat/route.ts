import process from 'node:process'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.API_KEY || '',
  baseURL: process.env.BASE_URL || '',
})

export async function POST(request: Request) {
  if(!openai.apiKey || !openai.baseURL) return

  const { messages, model } = await request.json()

  const stream = await openai.chat.completions.create({
    model,
    messages,
    stream: true,
  })

  const encoder = new TextEncoder()

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || ''

          if (content) {
            controller.enqueue(encoder.encode(content))
          }
        }

        controller.close()
      }
      catch (error) {
        controller.error(error)
      }
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  })
}
