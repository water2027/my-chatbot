// 事已至此, 暂时纯客户端吧
'use client'
import type { FormEvent } from 'react'
import type { ChatHistory } from '@/types/chat'
import type { Message } from '@/types/message'
import { useState } from 'react'
import ChatCard from '@/components/ChatCard'
import HistoryAside from '@/components/HistoryAside'

export default function Home() {
  const models = ['gpt-4o-mini']
  const [model, setModel] = useState<string>(models[0])
  // const [chatHistory, setChatHistory] = useState<ChatCardProps[]>([])
  const [currentChat, setCurrentChat] = useState<ChatHistory>({
    id: '0',
    messages: [],
  })
  let [content, setContent] = useState<string>('')

  const sendMessageToAi = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const msg = formData.get('message') as string
    if (!msg) {
      return
    }
    const userMessage: Message = { role: 'user', content: msg }
    setCurrentChat(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }))
    form.reset()

    fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages: [...currentChat.messages, userMessage], model }),
    }).then(async (res) => {
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        console.error('No reader available')
        return
      }

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          console.log('Stream completed')
          break
        }

        const data = decoder.decode(value)
        content += data
        setContent(prev => prev + data)
      }
      setContent('')
      setCurrentChat(prev => ({
        ...prev,
        messages: [...prev.messages, {
          role: 'assistant',
          content,
        }],
      }))
    })

  }

  return (
    <div className="w-full h-full flex flex-row">
      <HistoryAside />
      <main className="w-full bg-amber-300 h-full flex flex-col py-2 pl-16 md:px-4">
        {/* 头部栏, 放头像和模型选择 */}
        <div className="flex flex-row justify-between">
          <select name="model" id="model" onSelect={e => setModel((e.target as HTMLSelectElement).value)}>
            {models.map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
          {/* <div className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-50 p-5 text-c">
            水
          </div> */}
        </div>
        {/* 对话列表 */}
        <div className="custom-scrollbar h-80vh overflow-y-auto px-8">
          {currentChat.messages.map((chat, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <ChatCard key={`${currentChat.id}-${index}`} role={chat.role} content={chat.content} />
          ))}
          <div className={content ? '' : 'hidden'}>
            <ChatCard role="assistant" content={content} />
          </div>
        </div>
        {/* 输入框 */}
        <form onSubmit={sendMessageToAi} className="mt-auto mx-auto bg-amber-800 w-2/3 flex flex-row">
          <textarea className="w-full" rows={3} name="message" id="message"></textarea>
          <button type="submit" className="rounded-full bg-amber-300 h-5 w-5 flex items-center justify-center p-6 m-auto">S</button>
        </form>
      </main>
    </div>
  )
}
