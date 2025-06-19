import type { MouseEvent } from 'react'
import type { ChatHistory } from '@/types/chat'
import {
  Menu,
  MessageSquare,
  Plus,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export interface ChatHistoryProps {
  history: {
    [key: string]: ChatHistory
  }
  onSelectChat: (chatId: string) => void
  onAddNewChat: () => void
  onDeleteChat: (chatId: string) => void
  currentChatId: string
}

export default function HistoryAside({
  history,
  onSelectChat,
  currentChatId,
  onAddNewChat,
  onDeleteChat,
}: ChatHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleChatSelect = (event: MouseEvent) => {
    const el = event.target as HTMLElement
    // 检查是否点击了删除按钮
    if (el.closest('[data-delete-button]')) {
      return
    }

    const listItem = el.closest('[data-chat-item]') as HTMLElement
    const id = listItem?.dataset.chatId
    if (!listItem || !id)
      return
    onSelectChat(id)
  }

  const handleDeleteChat = (event: MouseEvent, chatId: string) => {
    event.stopPropagation()
    onDeleteChat(chatId)
  }

  const getFirstMessage = (messages: any[]) => {
    if (!messages || messages.length === 0)
      return '新对话'
    const firstUserMessage = messages.find(msg => msg.role === 'user')
    return `${firstUserMessage?.content?.slice(0, 10)}...` || '新对话'
  }

  return (
    <TooltipProvider>
      <aside
        className={cn(
          'h-full bg-background border-r-3 transition-all duration-300 ease-in-out relative',
          'w-0 md:w-14',
          'hover:w-80 group',
          isExpanded && 'absolute w-4/5 md:relative md:w-80 z-50',
        )}
      >
        {/* 展开按钮 */}
        <div className="sticky top-0 z-10 p-3 bg-background border-b">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <Menu className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{isExpanded ? '取消固定' : '固定菜单'}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* 聊天记录列表 */}
        <div className={cn(
          'transition-all duration-300 h-[calc(100vh-120px)]',
          'group-hover:opacity-100',
          isExpanded ? 'opacity-100' : 'opacity-0 md:opacity-0',
        )}
        >
          <div className={cn(
            'p-3 transition-all duration-300',
            'group-hover:opacity-100',
            isExpanded ? 'opacity-100' : 'opacity-0',
          )}
          >
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-medium text-foreground whitespace-nowrap">
                聊天记录
              </h3>
            </div>

            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-1" onClick={handleChatSelect}>
                {Object.entries(history).map(([key, chat]) => (
                  <div
                    key={key}
                    data-chat-item
                    data-chat-id={chat.id}
                    className={cn(
                      'group/item rounded-lg transition-colors duration-200',
                      'hover:bg-accent cursor-pointer flex items-center p-3',
                      currentChatId === chat.id && 'bg-accent border-l-2 border-primary',
                    )}
                    onClick={handleChatSelect}
                  >
                    {/* 聊天内容区域 */}
                    <div className="flex-1 min-w-0 mr-2">
                      <div className="text-sm font-medium text-foreground truncate">
                        {getFirstMessage(chat.messages)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {chat.messages?.length || 0}
                        {' '}
                        条消息
                      </div>
                    </div>

                    {/* 删除按钮 */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      data-delete-button
                      onClick={e => handleDeleteChat(e, chat.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <Separator />

        {/* 底部操作 */}
        <div className={cn(
          'sticky bottom-0 p-3 bg-background',
          'transition-opacity duration-300',
          isExpanded ? '' : 'hidden md:block',
        )}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8"
                onClick={onAddNewChat}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>新建对话</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  )
}
