import type { ReactNode } from 'react'
import type { ChatHistory } from '@/types/chat'
import ChatCard from './ChatCard'

interface ChatContainerProps {
  currentChat: ChatHistory
  node: ReactNode | null
}

export default function ChatContainer({ currentChat, node }: ChatContainerProps) {
  return (
    <div className="custom-scrollbar h-80vh overflow-y-auto px-8">
      {currentChat.messages.map((chat, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <ChatCard markdown={true} key={`${currentChat.id}-${index}`} role={chat.role} content={chat.content} />
      ))}
      <div>
        {node}
      </div>
    </div>
  )
}
