export interface ChatCardProps {
  chatId?: string
  content: string
}

export default function ChatCard({ content }: ChatCardProps) {
  return (
    // 外层容器，控制整行消息是靠左还是靠右 (justify-start/end)
    <div className="flex w-full my-4 justify-start">
      {/* 内层容器，控制头像和气泡的顺序 (flex-row/row-reverse) */}
      <div className="flex items-start gap-3 flex-row">

        {/* 头像和名字 */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm bg-teal-200 text-teal-800"
          >
            AI
          </div>
          <span className="text-xs text-gray-500 mt-1">Assistant</span>
        </div>

        {/* 内容气泡 */}
        <div
          className="p-3 rounded-lg max-w-md lg:max-w-xl break-words shadow-md bg-gray-200 text-gray-800"
        >
          <div className="whitespace-pre-wrap">{content}</div>
        </div>

      </div>
    </div>
  )
}
