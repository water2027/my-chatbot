// 事已至此, 暂时纯客户端吧
'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'
import AvatarSection from '@/components/AvatarSection'
import ChatContainer from '@/components/ChatContainer'
import HistoryAside from '@/components/HistoryAside'
import useChat from '@/hooks/useChat'
import { useAuthStore } from '@/store/authStore'
import localStorageHandler from '@/utils/localStorageHandler'

export default function Home() {
  const models = ['gpt-4o-mini', 'gpt-4']
  let model = models[0]
  const { isAuthenticated, signOut, initialize } = useAuthStore()
  const router = useRouter()
  const { addNewChat, deleteChat, selectChat, currentChat, chatHistory, submitMessage, node } = useChat(localStorageHandler)

  useEffect(() => {
    initialize()
  }, [initialize])

  const handleSubmit = (formData: FormData) => {
    const msg = formData.get('message') as string
    submitMessage(msg, model)
      .catch((reason) => {
        toast(reason)
      })
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
        <ChatContainer currentChat={currentChat} node={node} />
        {/* 输入框 */}
        <form action={handleSubmit} className="mt-auto mx-auto w-5/6 md:w-2/3 flex flex-row">
          <textarea className="w-full bg-blue-300 custom-scrollbar resize-none" rows={3} name="message" id="message"></textarea>
          <button type="submit" className="rounded-full bg-amber-300 h-5 w-5 flex items-center justify-center p-6 m-auto hover:bg-amber-200 transition-colors duration-200">S</button>
        </form>
      </main>
    </div>
  )
}
