'use server'

import type { ReactNode } from 'react'
import type { Message } from '@/types/message'
import process from 'node:process'
import { OpenAI } from 'openai'
import { Suspense } from 'react'
import ChatCard from '@/components/ChatCard'

const openai = new OpenAI({
  apiKey: process.env.API_KEY || '',
  baseURL: process.env.BASE_URL || '',
})

interface StreamState {
  done: boolean
  value: ReactNode
  next: Promise<StreamState | null>
}

async function StreamRow({ next }: { next: Promise<StreamState | null> }) {
  const state = await next
  if (state?.done) {
    return state.value
  }

  return (
    <Suspense fallback={state!.value}>
      <StreamRow next={state!.next} />
    </Suspense>
  )
}

function createStreamController() {
  let resolveFunc: (value: StreamState) => void
  let rejectFunc: (reason?: any) => void

  const promise = new Promise<StreamState>((resolve, reject) => {
    resolveFunc = resolve
    rejectFunc = reject
  })

  return {
    row: <StreamRow next={promise} />,
    reject: rejectFunc!,
    resolve: resolveFunc!,
  }
}

export async function StreamChat(messages: Message[], model: string) {
  let { row, reject, resolve } = createStreamController()
  let accumulatedContent = '' // 累积内容
  const { promise: finalResult, resolve: finalResolve, reject: errReject } = Promise.withResolvers<string>()
  const updateStream = (nextContent: string) => {
    accumulatedContent += nextContent
    const nextController = createStreamController()

    resolve({
      value: (
        <ChatCard
          role="assistant"
          content={accumulatedContent}
          markdown={false}
        />
      ),
      done: false,
      next: nextController.row.props.next, // 直接使用下一个控制器的 promise
    })

    // 更新当前的 resolve 和 reject 为下一个控制器的
    resolve = nextController.resolve
    reject = nextController.reject
  }

  const finishStream = () => {
    resolve({
      value: (
        <ChatCard
          role="assistant"
          content={accumulatedContent}
          markdown={false}
        />
      ),
      done: true,
      next: Promise.resolve(null),
    })
    finalResolve(accumulatedContent)
  }

  ;(async () => {
    if (!openai.apiKey || !openai.baseURL) {
      reject(new Error('API configuration is missing'))
      errReject(new Error('API configuration is missing'))
      return
    }

    try {
      const response = await openai.chat.completions.create({
        model,
        messages,
        stream: true,
      })

      for await (const chunk of response) {
        const content = chunk.choices[0]?.delta?.content
        if (content) {
          updateStream(content)
        }
      }

      finishStream()
    }
    catch (error) {
      console.error('Chat completion error:', error)
      reject(error)
    }
  })()

  return {
    node: (
      <Suspense fallback={<div>正在加载...</div>}>
        {row}
      </Suspense>
    ),
    result: finalResult,
  }
}
