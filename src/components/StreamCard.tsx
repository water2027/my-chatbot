import { useEffect, useState } from 'react'

export interface StreamChatProps {
  message: string
}

const roleConfig = {
  user: {
    // 将整个消息块推到右侧
    containerClass: 'justify-end',
    // flex-row-reverse 会让头像显示在气泡右侧
    innerContainerClass: 'flex-row-reverse',
    // 气泡样式
    bubbleClass: 'bg-blue-500 text-white',
    // 头像样式和内容
    avatarInitial: '你',
    avatarClass: 'bg-indigo-200 text-indigo-800',
    displayName: 'You',
  },
  assistant: {
    containerClass: 'justify-start',
    innerContainerClass: 'flex-row',
    bubbleClass: 'bg-gray-200 text-gray-800',
    avatarInitial: 'AI',
    avatarClass: 'bg-teal-200 text-teal-800',
    displayName: 'Assistant',
  },
  system: {
    containerClass: 'justify-start',
    innerContainerClass: 'flex-row',
    bubbleClass: 'bg-gray-200 text-gray-800',
    avatarInitial: 'S',
    avatarClass: 'bg-gray-300 text-gray-900',
    displayName: 'System',
  },
}

export default function StreamChat({ message }: StreamChatProps) {
  const config = roleConfig.assistant
  const [content, setContent] = useState<string>('')
  useEffect(() => {
    if (!message) return
    fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    }).then(async (res) => {
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        console.error('No reader available')
        return
      }

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          console.log('Stream completed')
          break
        }

        const data = decoder.decode(value)
        setContent((prev) => prev + data)
      }
    })
  }, [message])

  return message &&(
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
          {content}
        </div>

      </div>
    </div>
  )
}
