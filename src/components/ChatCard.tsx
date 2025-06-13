import MarkdownIt from 'markdown-it'

export interface ChatCardProps {
  chatId?: string
  role: 'user' | 'assistant' | 'system'
  content: string
  markdown: boolean
}

import 'github-markdown-css'

// 为不同角色定义配置，方便管理样式和信息
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

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})

export default function ChatCard({ role, content, markdown }: ChatCardProps) {
  const config = roleConfig[role]

  const renderedContent = () => {
    if (!markdown) {
      return (
        <div className="whitespace-pre-wrap">{content}</div>
      )
    }

    const htmlContent = md.render(content)

    return (
      <div
        className="prose prose-sm max-w-none prose-headings:text-inherit prose-p:text-inherit prose-strong:text-inherit prose-em:text-inherit prose-code:text-inherit prose-pre:bg-black/10 prose-pre:text-inherit"
        // eslint-disable-next-line react-dom/no-dangerously-set-innerhtml
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    )
  }

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
          className={`p-3 rounded-lg max-w-md lg:max-w-xl break-words shadow-md ${config.bubbleClass} ${markdown ? 'markdown-body' : ''}`}
        >
          {renderedContent()}
        </div>

      </div>
    </div>
  )
}
