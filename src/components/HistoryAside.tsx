import type { MouseEvent } from 'react'
import type { ChatHistory } from '@/types/chat'
import { useState } from 'react'

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
    if (el.closest('.delete-button')) {
      return
    }

    const listItem = el.closest('li') as HTMLLIElement
    const id = listItem?.id
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
    return `${firstUserMessage?.content?.slice(0, 20)}...` || '新对话'
  }

  return (
    <aside
      className={`
        relative h-full w-1/20 bg-gray-900 border-r border-gray-700 transition-all duration-300 ease-in-out
        hover:w-80 group
      `}
    >
      {/* 展开按钮 */}
      <div className="sticky top-0 z-10 bg-gray-900 p-3 border-b border-gray-700">
        <button
          type="button"
          className="w-6 h-6 flex flex-col justify-center items-center space-y-1 transition-all duration-300 hover:bg-gray-700 hover:rounded-md p-1"
          aria-label="切换菜单"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="w-4 h-0.5 bg-gray-300 transition-all duration-300"></div>
          <div className="w-4 h-0.5 bg-gray-300 transition-all duration-300"></div>
          <div className="w-4 h-0.5 bg-gray-300 transition-all duration-300"></div>
        </button>
      </div>

      {/* 聊天记录列表 */}
      <div className={`
        transition-all duration-300 group-hover:opacity-100
        h-[calc(100vh-120px)]
        ${isExpanded ? 'opacity-100' : 'opacity-0'}
      `}
      >
        <div className={`p-2 group-hover:opacity-100 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
          <div className={`
            transition-all duration-300 whitespace-nowrap
          `}
          >
            <h3 className="text-sm font-medium text-gray-300 mb-3 px-2">
              聊天记录
            </h3>
          </div>

          <ul className="space-y-1 max-h-[calc(100vh-120px)] pb-16 overflow-y-auto custom-scrollbar" onClick={handleChatSelect}>
            {Object.entries(history)
              .map(([key, chat]) => (
                <div key={key}>
                  <li id={chat.id} className="relative group/item hover:bg-gray-700 transition-colors rounded-xl duration-200">
                    <button
                      type="button"
                      className={`
                          w-full text-left p-3 pr-12 rounded-lg transition-all duration-200
                          focus:bg-gray-700 focus:outline-none
                          ${currentChatId === chat.id ? 'bg-gray-700 border-l-2 border-blue-500' : ''}
                        `}
                    >
                      <div className="flex flex-col space-y-1">
                        <div className="text-sm text-gray-200 font-medium truncate">
                          {getFirstMessage(chat.messages)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {chat.messages?.length || 0}
                          {' '}
                          条消息
                        </div>
                      </div>
                    </button>

                    {/* 删除按钮 */}
                    <button
                      type="button"
                      className="delete-button absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded opacity-0 group-hover/item:opacity-100 transition-all duration-200"
                      onClick={e => handleDeleteChat(e, chat.id)}
                      aria-label="删除对话"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </li>
                  <div>

                  </div>
                </div>
              ))}
          </ul>
        </div>
      </div>

      {/* 底部操作 */}
      <div className={`
        sticky bottom-0 left-0 right-0 p-3 border-t border-gray-700 bg-gray-900
        transition-opacity duration-300
      `}
      >
        <button
          type="button"
          className="w-8 py-2 px-3 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
          onClick={onAddNewChat}
        >
          +
        </button>
      </div>
    </aside>
  )
}
