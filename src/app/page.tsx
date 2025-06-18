// 事已至此, 暂时纯客户端吧
'use client'
import type { ReactNode } from 'react'
import type { ChatHistory } from '@/types/chat'
import type { Message } from '@/types/message'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { StreamChat } from '@/actions/ai'
import AvatarSection from '@/components/AvatarSection'
import ChatCard from '@/components/ChatCard'
import HistoryAside from '@/components/HistoryAside'
import { useAuthStore } from '@/store/authStore'

export default function Home() {
  const models = ['gpt-4o-mini', 'gpt-4']
  let model = models[0]
  const [latestId, setLatestId] = useState(0)
  const [chatHistory, setChatHistory] = useState<{
    [key: string]: ChatHistory
  }>({})
  const [currentChat, setCurrentChat] = useState<ChatHistory>({
    id: '-1',
    messages: [],
  })
  const [node, setNode] = useState<ReactNode | null>(null)
  const { isAuthenticated, signOut, initialize } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem('chatHistory', JSON.stringify(chatHistory))
      localStorage.setItem('latestId', latestId.toString())
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [chatHistory, latestId])

  useEffect(() => {
  // 从 localStorage 读取 latestId
    const storedId = localStorage.getItem('latestId')
    if (storedId) {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setLatestId(Number(storedId))
    }

    // 从 localStorage 读取 chatHistory
    const storedHistory = localStorage.getItem('chatHistory')
    if (storedHistory) {
      try {
        // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
        setChatHistory(JSON.parse(storedHistory))
      }
      catch (error) {
        console.error('Failed to parse chatHistory:', error)
      }
    }
    initialize()
  }, [initialize])

  useEffect(() => {
    if (currentChat.id === '-1')
      return
    const chat = chatHistory[currentChat.id]
    if (!chat) {
      chatHistory[currentChat.id] = currentChat
      return
    }
    chat.messages.splice(0, chat.messages.length, ...currentChat.messages)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChat])

  const selectChat = (chatId: string): void => {
    if (chatId === currentChat.id)
      return
    setCurrentChat((_prev) => {
      return chatHistory[chatId]
    })
  }

  const addNewChat = () => {
    const newChat: ChatHistory = {
      id: latestId.toString(),
      messages: [],
    }

    chatHistory[newChat.id] = newChat
    setLatestId(prev => prev + 1)
    selectChat(newChat.id)
  }

  const deleteChat = (chatId: string) => {
    if (chatId === currentChat.id) {
      setCurrentChat({
        id: '-1',
        messages: [],
      })
    }
    const newHistory = { ...chatHistory }
    delete newHistory[chatId]
    setChatHistory(newHistory)
  }

  const handleSubmit = async (formData: FormData) => {
    const msg = formData.get('message') as string
    if (!msg) {
      return
    }
    if (currentChat.id === '-1') {
      addNewChat()
    }
    const userMessage: Message = { role: 'user', content: msg }
    setCurrentChat(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }))

    try {
      const { node: newNode, result } = await StreamChat([...currentChat.messages, userMessage], model)
      setNode(newNode)
      result.then((finalContent) => {
        setCurrentChat(prev => ({
          ...prev,
          messages: [...prev.messages, {
            role: 'assistant',
            content: finalContent,
          }],
        }))
        setNode(null)
      })
    }
    catch (error) {
      console.error('Error during chat action:', error)
    }
  }

  const onLoginClick = () => {
    router.push('/auth/login')
  }

  const onLogoutClick = () => {
    signOut()
    router.push('/auth/login')
  }

  return (
    <div className="w-full h-full flex flex-row">
      <HistoryAside onDeleteChat={deleteChat} onAddNewChat={addNewChat} onSelectChat={selectChat} currentChatId={currentChat.id} history={chatHistory} />
      <main className="w-full h-full flex flex-col py-2 pl-16 pr-4 md:pl-8">
        {/* 头部栏, 放头像和模型选择 */}
        <div className="flex flex-row justify-between">
          <select name="model" id="model" onInput={(e) => { model = (e.target as HTMLSelectElement).value }}>
            {models.map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
          <AvatarSection isOnline={isAuthenticated} onLoginClick={onLoginClick} onLogoutClick={onLogoutClick} />
        </div>
        {/* 对话列表 */}
        <div className="custom-scrollbar h-80vh overflow-y-auto px-8">
          {currentChat.messages.map((chat, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <ChatCard markdown={true} key={`${currentChat.id}-${index}`} role={chat.role} content={chat.content} />
          ))}
          <div>
            {node}
          </div>
        </div>
        {/* 输入框 */}
        <form action={handleSubmit} className="mt-auto mx-auto w-5/6 md:w-2/3 flex flex-row">
          <textarea className="w-full bg-blue-300 custom-scrollbar resize-none" rows={3} name="message" id="message"></textarea>
          <button type="submit" className="rounded-full bg-amber-300 h-5 w-5 flex items-center justify-center p-6 m-auto hover:bg-amber-200 transition-colors duration-200">S</button>
        </form>
      </main>
    </div>
  )
}
