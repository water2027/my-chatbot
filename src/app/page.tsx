// 事已至此, 暂时纯客户端吧
'use client'
import type { FormEvent } from 'react'
import type { ChatHistory } from '@/types/chat'
import type { Message } from '@/types/message'
import { useState } from 'react'
import ChatCard from '@/components/ChatCard'
import HistoryAside from '@/components/HistoryAside'
import { sendToAI } from '@/utils/sendToAI'

export default function Home() {
  const models = ['gpt-4o-mini', 'gpt-4']
  let model = models[0]
  const [chatHistory, setChatHistory] = useState<{
    [key: string]: ChatHistory
  }>({
    0: {
      id: '0',
      messages: [],
    },
    1: {
      id: '1',
      messages: [
        { role: 'user', content: '你好' },
        { role: 'assistant', content: '你好！有什么我可以帮助你的吗？' },
      ],
    },
    2: {
      id: '2',
      messages: [
        { role: 'user', content: '今天天气怎么样？' },
        { role: 'assistant', content: '今天天气晴朗，适合外出活动！' },
      ],
    },
    3: {
      id: '3',
      messages: [
        { role: 'user', content: '你会做饭吗？' },
        { role: 'assistant', content: '我不会做饭，但我可以给你提供食谱和烹饪建议！' },
      ],
    },
    4: {
      id: '4',
      messages: [
        { role: 'user', content: '你能帮我写代码吗？' },
        { role: 'assistant', content: '当然可以！请告诉我你需要什么样的代码。' },
      ],
    },
    5: {
      id: '5',
      messages: [
        { role: 'user', content: '你喜欢什么音乐？' },
        { role: 'assistant', content: '我没有个人喜好，但我可以推荐一些流行的音乐给你！' },
      ],
    },
    6: {
      id: '6',
      messages: [

        { role: 'user', content: '你能告诉我一些有趣的事实吗？' },
        { role: 'assistant', content: '当然！比如说，章鱼有三个心脏。' },
      ],
    },
    7: {
      id: '7',
      messages: [
        { role: 'user', content: '你能帮我学习新语言吗？' },
        { role: 'assistant', content: '当然可以！我可以帮助你学习英语、法语、西班牙语等多种语言。' },
      ],
    },
    8: {
      id: '8',
      messages: [
        { role: 'user', content: '你能推荐一些好看的电影吗？' },
        { role: 'assistant', content: '当然可以！最近的热门电影有《复仇者联盟：终局之战》和《寄生虫》。' },
      ],
    },
    9: {
      id: '9',
      messages: [
        { role: 'user', content: '你能帮我规划旅行吗？' },
        { role: 'assistant', content: '当然可以！请告诉我你的目的地和预算。' },
      ],
    },
    10: {
      id: '10',
      messages: [
        { role: 'user', content: '你能帮我解决数学问题吗？' },
        { role: 'assistant', content: '当然可以！请告诉我你的数学问题。' },
      ],
    },
    11: {
      id: '11',
      messages: [
        { role: 'user', content: '你能帮我写一篇文章吗？' },
        { role: 'assistant', content: '当然可以！请告诉我你想写什么主题的文章。' },
      ],
    },
    12: {
      id: '12',
      messages: [
        { role: 'user', content: '你能帮我做一个计划吗？' },
        { role: 'assistant', content: '当然可以！请告诉我你需要什么样的计划。' },
      ],
    },

  })
  const [currentChat, setCurrentChat] = useState<ChatHistory>({
    id: '0',
    messages: [],
  })
  const [content, setContent] = useState<string>('')

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

    const newMessage = await sendToAI([...currentChat.messages, userMessage], model, setContent)
    if (!newMessage) {
      console.error('No message returned from AI')
      return
    }
    setCurrentChat(prev => ({
      ...prev,
      messages: [...prev.messages, {
        role: 'assistant',
        content: newMessage,
      }],
    }))
    setContent('')
  }

  const onSelectChat = (chatId: string) => {
    if (chatId === currentChat.id) return
    setCurrentChat(chatHistory[chatId])
  }

  return (
    <div className="w-full h-full flex flex-row">
      <HistoryAside onSelectChat={onSelectChat} currentChatId={currentChat.id} history={chatHistory} />
      <main className="w-full bg-amber-300 h-full flex flex-col py-2 pl-16 md:px-4">
        {/* 头部栏, 放头像和模型选择 */}
        <div className="flex flex-row justify-between">
          <select name="model" id="model" onInput={(e) => { model = (e.target as HTMLSelectElement).value }}>
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
