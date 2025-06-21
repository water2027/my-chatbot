import type { KeyboardEvent } from 'react'
import { Send } from 'lucide-react'
import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export function MessageForm({ handleSubmit }: { handleSubmit: (formData: FormData) => void }) {
  const formRef = useRef<HTMLFormElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()

      // Create FormData and submit
      if (formRef.current && textareaRef.current) {
        const formData = new FormData(formRef.current)
        const message = textareaRef.current.value.trim()

        if (message) {
          handleSubmit(formData)
          textareaRef.current.value = ''
        }
      }
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="mx-auto w-5/6 md:w-2/3">
      <div className="flex gap-2 p-4 border rounded-lg bg-background shadow-sm">
        <Textarea
          ref={textareaRef}
          name="message"
          id="message"
          placeholder="输入您的消息... (Enter发送, Shift+Enter换行)"
          className="flex-1 min-h-[80px] resize-none border-input"
          rows={3}
          onKeyDown={handleKeyDown}
        />
        <Button
          type="submit"
          size="icon"
          className="h-12 w-12 rounded-full shrink-0 self-end"
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">发送消息</span>
        </Button>
      </div>
    </form>
  )
}
