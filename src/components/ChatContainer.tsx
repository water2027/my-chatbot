import type { ChatHistory } from '@/types/chat'
import ChatCard from './ChatCard'
import MarkdownCard from './MarkdownCard'

interface ChatContainerProps {
  currentChat: ChatHistory
  content: string
}

export default function ChatContainer({ currentChat, content }: ChatContainerProps) {
  return (
    <div className="custom-scrollbar h-80vh overflow-y-auto px-8">
      {currentChat.messages.map((chat, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <MarkdownCard key={`${currentChat.id}-${index}`} role={chat.role} content={chat.content} />
      ))}
      {content && (
        <ChatCard content={content}>
        </ChatCard>
      )}
    </div>
  )
}
