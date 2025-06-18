export interface ChatCardProps {
  chatId?: string
  content: string
}

const roleConfig = {
  assistant: {
    containerClass: 'justify-start',
    innerContainerClass: 'flex-row',
    bubbleClass: 'bg-gray-200 text-gray-800',
    avatarInitial: 'AI',
    avatarClass: 'bg-teal-200 text-teal-800',
    displayName: 'Assistant',
  },
}

export default function ChatCard({ content }: ChatCardProps) {
  const config = roleConfig.assistant

  return (
    // 外层容器，控制整行消息是靠左还是靠右 (justify-start/end)
    <div className={`flex w-full my-4 ${config.containerClass}`}>
      {/* 内层容器，控制头像和气泡的顺序 (flex-row/row-reverse) */}
      <div className={`flex items-start gap-3 ${config.innerContainerClass}`}>

        {/* 头像和名字 */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${config.avatarClass}`}
          >
            {config.avatarInitial}
          </div>
          <span className="text-xs text-gray-500 mt-1">{config.displayName}</span>
        </div>

        {/* 内容气泡 */}
        <div
          className={`p-3 rounded-lg max-w-md lg:max-w-xl break-words shadow-md ${config.bubbleClass}`}
        >
          <div className="whitespace-pre-wrap">{content}</div>
        </div>

      </div>
    </div>
  )
}
