/* eslint-disable react-dom/no-dangerously-set-innerhtml */
'use client'

import { Check, Copy } from 'lucide-react'
import MarkdownIt from 'markdown-it'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface ChatCardProps {
  chatId?: string
  role: 'user' | 'assistant' | 'system'
  content: string
}

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
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className={cn(
        'h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity',
        'hover:bg-background/80 backdrop-blur-sm',
        'sm:opacity-0 opacity-100', // 在移动端始终显示复制按钮
      )}
    >
      {copied
        ? (
            <Check className="h-3 w-3 text-green-500" />
          )
        : (
            <Copy className="h-3 w-3" />
          )}
    </Button>
  )
}

function CodeBlock({
  children,
  language,
}: {
  children: string
  language: string
}) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className="relative group my-4">
      <div className="absolute top-3 right-3 z-10">
        <CopyButton text={children} />
      </div>
      <div className="rounded-lg overflow-hidden border bg-muted/30">
        <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b">
          <Badge variant="outline" className="text-xs">
            {language || 'text'}
          </Badge>
        </div>
        <div className="overflow-x-auto">
          <SyntaxHighlighter
            language={language}
            style={isDark ? oneDark : oneLight}
            PreTag="div"
            customStyle={{
              margin: 0,
              background: 'transparent',
              fontSize: '0.875rem',
              padding: '1rem',
              minWidth: 'max-content', // 确保代码块不会被压缩
            }}
            wrapLines={true}
            wrapLongLines={true}
          >
            {children}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  )
}

const roleConfig = {
  user: {
    containerClass: 'justify-end',
    maxWidth: 'max-w-[85%] sm:max-w-[85%] max-w-[95%]', // 移动端占用更多宽度
    cardClass: 'bg-primary text-primary-foreground border-primary/20',
    avatarClass: 'bg-primary text-primary-foreground',
    avatarInitial: 'U',
    displayName: 'User',
    badgeVariant: 'default' as const,
  },
  assistant: {
    containerClass: 'justify-start',
    maxWidth: 'max-w-[85%] sm:max-w-[85%] max-w-[95%]', // 移动端占用更多宽度
    cardClass: 'bg-muted/50 text-foreground border-muted',
    avatarClass: 'bg-secondary text-secondary-foreground',
    avatarInitial: 'AI',
    displayName: 'Assistant',
    badgeVariant: 'secondary' as const,
  },
  system: {
    containerClass: 'justify-center',
    maxWidth: 'max-w-[70%] sm:max-w-[70%] max-w-[90%]', // 移动端占用更多宽度
    cardClass: 'bg-destructive/10 text-destructive-foreground border-destructive/20',
    avatarClass: 'bg-destructive/20 text-destructive',
    avatarInitial: 'S',
    displayName: 'System',
    badgeVariant: 'destructive' as const,
  },
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true, // 启用换行符转换
})

export default function MarkdownCard({ role, content }: ChatCardProps) {
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
              className="prose prose-sm max-w-none dark:prose-invert
                prose-headings:text-inherit prose-p:text-inherit prose-strong:text-inherit
                prose-em:text-inherit prose-code:text-inherit prose-pre:text-inherit
                prose-a:text-blue-600 dark:prose-a:text-blue-400
                prose-code:break-words prose-pre:break-words
                [&_*]:break-words [&_code]:whitespace-pre-wrap
                [&_pre]:whitespace-pre-wrap [&_pre]:overflow-x-auto"
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
            className="prose prose-sm max-w-none dark:prose-invert
              prose-headings:text-inherit prose-p:text-inherit prose-strong:text-inherit
              prose-em:text-inherit prose-code:text-inherit prose-pre:text-inherit
              prose-a:text-blue-600 dark:prose-a:text-blue-400
              prose-code:break-words prose-pre:break-words
              [&_*]:break-words [&_code]:whitespace-pre-wrap
              [&_pre]:whitespace-pre-wrap [&_pre]:overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: md.render(remainingText) }}
          />,
        )
      }
    }

    if (parts.length === 0) {
      return (
        <div
          className="prose prose-sm max-w-none dark:prose-invert
            prose-headings:text-inherit prose-p:text-inherit prose-strong:text-inherit
            prose-em:text-inherit prose-code:text-inherit prose-pre:text-inherit
            prose-a:text-blue-600 dark:prose-a:text-blue-400
            prose-code:break-words prose-pre:break-words
            [&_*]:break-words [&_code]:whitespace-pre-wrap
            [&_pre]:whitespace-pre-wrap [&_pre]:overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: md.render(text) }}
        />
      )
    }

    return <>{parts}</>
  }

  const isUser = role === 'user'

  return (
    <div className={cn('flex w-full px-2 sm:px-4', config.containerClass)}>
      <div className={cn(
        'flex items-start gap-2 sm:gap-3 min-w-0 w-full',
        config.maxWidth,
        isUser && 'flex-row-reverse',
      )}
      >
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <Avatar className="w-6 h-6 sm:w-8 sm:h-8">
            <AvatarFallback className={cn('text-xs font-semibold', config.avatarClass)}>
              {config.avatarInitial}
            </AvatarFallback>
          </Avatar>
          <Badge variant={config.badgeVariant} className="text-xs px-1 sm:px-2 py-0 h-4 sm:h-5 hidden sm:inline-flex">
            {config.displayName}
          </Badge>
        </div>

        <Card className={cn(
          'transition-colors py-2 sm:py-3 min-w-0 flex-1',
          config.cardClass,
        )}
        >
          <CardContent className="p-3 sm:p-6">
            <div className="text-sm leading-relaxed break-words overflow-hidden">
              {parseContent(content)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
