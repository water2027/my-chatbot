import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

export interface ChatCardProps {
  chatId?: string
  content: string
}

export default function ChatCard({ content }: ChatCardProps) {
  return (
    <div className="flex justify-start w-full">
      <div className="flex items-start gap-3 max-w-[85%]">
        <div className="flex flex-col items-center gap-1">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              AI
            </AvatarFallback>
          </Avatar>
          <Badge variant="secondary" className="text-xs px-2 py-0 h-5">
            助手
          </Badge>
        </div>

        <Card className="bg-muted/50 border-muted">
          <CardContent className="p-4">
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {content}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
