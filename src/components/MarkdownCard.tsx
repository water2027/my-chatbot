/* eslint-disable react-dom/no-dangerously-set-innerhtml */
'use client'

import MarkdownIt from 'markdown-it'
import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

export interface ChatCardProps {
  chatId?: string
  role: 'user' | 'assistant' | 'system'
  content: string
}

import 'github-markdown-css'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
    catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`px-2 py-1 text-xs rounded transition-colors ${
        copied
          ? 'bg-green-500 text-white'
          : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
      }`}
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

function CodeBlock({
  children,
  language,
}: {
  children: string
  language: string
}) {
  return (
    <div className="relative group my-4">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <CopyButton text={children} />
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        PreTag="div"
        customStyle={{
          margin: 0,
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  )
}

const roleConfig = {
  user: {
    containerClass: 'justify-end',
    innerContainerClass: 'flex-row-reverse',
    bubbleClass: 'bg-blue-500 text-white',
    avatarInitial: 'U',
    avatarClass: 'bg-indigo-200 text-indigo-800',
    displayName: 'User',
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

export default function ChatCard({ role, content }: ChatCardProps) {
  const config = roleConfig[role]

  const parseContent = (text: string) => {
    const parts = []
    let currentIndex = 0

    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
    let match

    // eslint-disable-next-line no-cond-assign
    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > currentIndex) {
        const beforeText = text.slice(currentIndex, match.index)
        if (beforeText.trim()) {
          parts.push(
            <div
              key={`text-${currentIndex}`}
              className="prose prose-sm max-w-none prose-headings:text-inherit prose-p:text-inherit prose-strong:text-inherit prose-em:text-inherit"
              dangerouslySetInnerHTML={{ __html: md.render(beforeText) }}
            />,
          )
        }
      }

      const language = match[1] || 'text'
      const code = match[2]
      parts.push(
        <CodeBlock key={`code-${match.index}`} language={language}>
          {code}
        </CodeBlock>,
      )

      currentIndex = match.index + match[0].length
    }

    if (currentIndex < text.length) {
      const remainingText = text.slice(currentIndex)
      if (remainingText.trim()) {
        parts.push(
          <div
            key={`text-${currentIndex}`}
            className="prose prose-sm max-w-none prose-headings:text-inherit prose-p:text-inherit prose-strong:text-inherit prose-em:text-inherit"
            dangerouslySetInnerHTML={{ __html: md.render(remainingText) }}
          />,
        )
      }
    }

    if (parts.length === 0) {
      return (
        <div
          className="prose prose-sm max-w-none prose-headings:text-inherit prose-p:text-inherit prose-strong:text-inherit prose-em:text-inherit"
          dangerouslySetInnerHTML={{ __html: md.render(text) }}
        />
      )
    }

    return <>{parts}</>
  }

  return (
    <div className={`flex w-full my-4 ${config.containerClass}`}>
      <div className={`flex items-start gap-3 ${config.innerContainerClass}`}>
        <div className="flex flex-col items-center flex-shrink-0">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${config.avatarClass}`}
          >
            {config.avatarInitial}
          </div>
          <span className="text-xs text-gray-500 mt-1">{config.displayName}</span>
        </div>

        <div
          className={`p-3 rounded-lg max-w-md lg:max-w-xl break-words shadow-md ${config.bubbleClass} markdown-body`}
        >
          {parseContent(content)}
        </div>
      </div>
    </div>
  )
}
