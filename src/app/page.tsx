'use client'
import { Menu } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import AvatarSection from '@/components/AvatarSection'
import ChatContainer from '@/components/ChatContainer'
import HistoryAside from '@/components/HistoryAside'
import { MessageForm } from '@/components/MessageForm'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  TooltipProvider,
} from '@/components/ui/tooltip'
import useChat from '@/hooks/useChat'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import localStorageHandler from '@/utils/localStorageHandler'

export default function Home() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const { isAuthenticated, signOut, initialize } = useAuthStore()
  const router = useRouter()
  const {
    error,
    models,
    model,
    setModel,
    addNewChat,
    deleteChat,
    selectChat,
    currentChat,
    chatHistory,
    submitMessage,
    content,
  } = useChat(localStorageHandler)

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    if (error) {
      toast.error(error.message || 'An error occurred')
      console.error('Chat error:', error)
    }
  }, [error])

  const handleSubmit = (formData: FormData) => {
    const msg = formData.get('message') as string
    submitMessage(msg)
  }

  const onLoginClick = () => {
    router.push('/auth/login')
  }

  const onLogoutClick = () => {
    signOut()
    router.push('/auth/login')
  }

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded)
  }

  const closeSidebar = () => {
    setSidebarExpanded(false)
  }

  return (
    <TooltipProvider>
      <div className="w-full h-screen flex flex-row bg-background relative">
        {sidebarExpanded && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={closeSidebar}
          />
        )}

        <HistoryAside
          onDeleteChat={deleteChat}
          onAddNewChat={addNewChat}
          onSelectChat={selectChat}
          currentChatId={currentChat.id}
          history={chatHistory}
          isExpanded={sidebarExpanded}
          onClose={closeSidebar}
        />

        <main className={cn(
          'flex-1 h-full flex flex-col min-w-0 transition-all duration-300 p-4',
          'md:ml-0',
        )}
        >
          <header className="flex-shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-4 p-4">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden flex-shrink-0"
                onClick={toggleSidebar}
              >
                <Menu className="h-4 w-4" />
              </Button>

              <div className="flex-1 flex items-center justify-center md:justify-start">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground hidden sm:inline">
                    Model:
                  </span>
                  <Select value={model} onValueChange={setModel}>
                    <SelectTrigger className="w-[140px] sm:w-[180px]">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map(modelOption => (
                        <SelectItem key={modelOption} value={modelOption}>
                          {modelOption}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex-shrink-0">
                <AvatarSection
                  isOnline={isAuthenticated}
                  onLoginClick={onLoginClick}
                  onLogoutClick={onLogoutClick}
                />
              </div>
            </div>
          </header>

          <div className="flex-1 flex flex-col min-h-0">
            <ChatContainer
              currentChat={currentChat}
              content={content}
            />

            <div className="flex-shrink-0 border-t mt-auto bg-background p-4">
              <div className="max-w-4xl mx-auto">
                <MessageForm handleSubmit={handleSubmit} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </TooltipProvider>
  )
}
