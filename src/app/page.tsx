// 事已至此, 暂时纯客户端吧
'use client'
import type { FormEvent } from 'react'
import type { ChatCardProps } from '@/components/ChatCard'
import { useState } from 'react'
import ChatCard from '@/components/ChatCard'
import StreamChat from '@/components/StreamCard'

export default function Home() {
  const [message, setMessage] = useState<string>('')
  const [chatHistory, setChatHistory] = useState<ChatCardProps[]>([
    {
      chatId: '1',
      role: 'user',
      content: '你好，AI！',
    },
    {
      chatId: '2',
      role: 'assistant',
      content: '你好！有什么我可以帮助你的吗？aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    },
    {
      chatId: '3',
      role: 'user',
      content: '请告诉我今天的天气。',
    },
    {
      chatId: '4',
      role: 'assistant',
      content: '今天的天气晴朗，适合外出。',
    },
    {
      chatId: '5',
      role: 'user',
      content: '我想知道明天的新闻。',
    },
    {
      chatId: '6',
      role: 'assistant',
      content: '明天的新闻将包括最新的科技动态和国际新闻。',
    },
    {
      chatId: '7',
      role: 'user',
      content: '请推荐一本好书。',
    },
    {
      chatId: '8',
      role: 'assistant',
      content: '我推荐《时间简史》，这是一本关于宇宙和物理学的经典著作。',
    },
    {
      chatId: '9',
      role: 'user',
      content: '谢谢你的推荐！',
    },
    {
      chatId: '10',
      role: 'assistant',
      content: '不客气！如果还有其他问题，随时问我。',
    },
  ])

  const sendMessageToAi = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const msg = formData.get('message') as string
    if (!msg) {
      return
    }
    console.log('Sending message to AI:', message)
    setMessage(msg)
    setChatHistory([...chatHistory, { chatId: '11', role: 'user', content: msg }])
    form.reset()
  }

  return (
    <div className="w-full h-full flex flex-row">
      <aside className="relative w-0 md:w-1/20 h-full hover:w-1/5 overflow-x-visible transition-all duration-300 after:w-full after:h-full after:absolute after:top-0 after:left-0 after:bg-black">
        <div className="w-10 h-10">
          {/* 展开按钮 */}
          <button
            type="button"
            className="relative w-full h-full z-10 flex flex-col justify-center items-center space-y-1.5 rounded-full transition-all duration-300 hover:bg-indigo-100 hover:backdrop-opacity-50"
            aria-label="Toggle menu"
          >
            <div
              className="w-6 h-0.5 bg-white transition-all duration-300 ease-in-out"
            >
            </div>

            <div
              className="w-6 h-0.5 bg-white transition-all duration-300 ease-in-out"
            >
            </div>

            <div
              className="w-6 h-0.5 bg-white transition-all duration-300 ease-in-out"
            >
            </div>
          </button>
          <div>
            {/* 聊天记录 */}
          </div>
        </div>
      </aside>
      <main className="w-full bg-amber-300 h-full flex flex-col py-2 pl-16 md:px-4">
        {/* 头部栏, 放头像和模型选择 */}
        <div className="flex flex-row justify-between">
          <select name="model" id="model">
            <option value="gpt-4">gpt-4</option>
          </select>
          {/* <div className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-50 p-5 text-c">
            水
          </div> */}
        </div>
        {/* 对话列表 */}
        <div className="custom-scrollbar h-80vh overflow-y-auto px-8">
          {chatHistory.map(chat => (
            <ChatCard key={chat.chatId} role={chat.role} content={chat.content} />
          ))}
          <StreamChat message={message} />
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
