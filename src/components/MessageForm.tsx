import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export function MessageForm({ handleSubmit }: { handleSubmit: (formData: FormData) => void }) {
  return (
    <form action={handleSubmit} className="mt-auto mx-auto w-5/6 md:w-2/3">
      <div className="flex gap-2 p-4 border rounded-lg bg-background shadow-sm">
        <Textarea
          name="message"
          id="message"
          placeholder="输入您的消息..."
          className="flex-1 min-h-[80px] resize-none border-input"
          rows={3}
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
