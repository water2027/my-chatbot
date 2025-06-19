import type { MouseEvent } from 'react'
import type { ChatHistory } from '@/types/chat'
import {
  Menu,
  MessageSquare,
  Plus,
  Trash2,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
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
  isExpanded: boolean
  onClose: () => void
}

export default function HistoryAside({
  history,
  onSelectChat,
  currentChatId,
  onAddNewChat,
  onDeleteChat,
  isExpanded,
  onClose,
}: ChatHistoryProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPinned, setIsPinned] = useState(false)

  const handleChatSelect = (event: MouseEvent) => {
    const el = event.target as HTMLElement
    if (el.closest('[data-delete-button]')) {
      return
    }

    const listItem = el.closest('[data-chat-item]') as HTMLElement
    const id = listItem?.dataset.chatId
    if (!listItem || !id)
      return

    onSelectChat(id)
    if (window.innerWidth < 768) {
      onClose()
    }
  }

  const handleDeleteChat = (event: MouseEvent, chatId: string) => {
    event.stopPropagation()
    onDeleteChat(chatId)
  }

  const handleAddNewChat = () => {
    onAddNewChat()
    if (window.innerWidth < 768) {
      onClose()
    }
  }

  const handleTogglePin = () => {
    setIsPinned(!isPinned)
  }

  const getFirstMessage = (messages: any[]) => {
    if (!messages || messages.length === 0)
      return '新对话'
    const firstUserMessage = messages.find(msg => msg.role === 'user')
    return `${firstUserMessage?.content?.slice(0, 20)}...` || '新对话'
  }

  const shouldShowContent = isExpanded || (typeof window !== 'undefined' && window.innerWidth >= 768 && (isPinned || isHovered))

  return (
    <aside
      className={cn(
        'h-full bg-background border-r transition-all duration-300 ease-in-out',
        'flex flex-col',
        'fixed left-0 top-0 z-50',
        'md:relative md:left-auto md:top-auto md:z-auto',
        isExpanded || (isPinned && typeof window !== 'undefined' && window.innerWidth >= 768)
          ? 'w-80'
          : 'w-0 md:w-14 overflow-hidden',
        isExpanded ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        !isPinned && 'md:hover:w-80',
      )}
      onMouseEnter={() => !isPinned && setIsHovered(true)}
      onMouseLeave={() => !isPinned && setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex-shrink-0 p-3 bg-background border-b">
        <div className="flex items-center justify-between">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'h-8 w-8 hidden md:flex',
                  isPinned && 'bg-accent',
                )}
                onClick={handleTogglePin}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{isPinned ? '取消固定侧边栏' : '固定侧边栏'}</p>
            </TooltipContent>
          </Tooltip>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 md:hidden"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className={cn(
            'flex items-center gap-2 transition-opacity duration-200',
            shouldShowContent ? 'opacity-100' : 'opacity-0',
          )}
          >
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium whitespace-nowrap">
              聊天记录
            </span>
          </div>

          <div className="w-8 hidden md:block" />
        </div>
      </div>

      <div className={cn(
        'flex-1 min-h-0 transition-opacity duration-200',
        shouldShowContent ? 'opacity-100' : 'opacity-0',
      )}
      >
        <ScrollArea className="h-full">
          <div className="p-3 space-y-1">
            {Object.entries(history).length === 0
              ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">暂无对话记录</p>
                  </div>
                )
              : (
                  <div className="space-y-1" onClick={handleChatSelect}>
                    {Object.entries(history).map(([key, chat]) => (
                      <div
                        key={key}
                        data-chat-item
                        data-chat-id={chat.id}
                        className={cn(
                          'group/item rounded-lg transition-all duration-200',
                          'hover:bg-accent cursor-pointer p-3',
                          'border border-transparent hover:border-border',
                          currentChatId === chat.id
                          && 'bg-accent border-primary shadow-sm',
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-foreground line-clamp-2 mb-1">
                              {getFirstMessage(chat.messages)}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>
                                {chat.messages?.length || 0}
                                {' '}
                                条消息
                              </span>
                            </div>
                          </div>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                  'h-6 w-6 text-muted-foreground flex-shrink-0',
                                  'hover:text-destructive hover:bg-destructive/10',
                                  'opacity-0 group-hover/item:opacity-100 transition-opacity',
                                )}
                                data-delete-button
                                onClick={e => handleDeleteChat(e, chat.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>删除对话</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
          </div>
        </ScrollArea>
      </div>

      <Separator />

      <div className="flex-shrink-0 p-3 bg-background">
        {shouldShowContent
          ? (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleAddNewChat}
              >
                <Plus className="h-4 w-4 mr-2" />
                新建对话
              </Button>
            )
          : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 mx-auto"
                    onClick={handleAddNewChat}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>新建对话</p>
                </TooltipContent>
              </Tooltip>
            )}
      </div>
    </aside>
  )
}
