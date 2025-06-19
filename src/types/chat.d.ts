import type { Message } from './message'

export interface ChatHistory {
  id: string
  title?: string
  messages: Message[]
}
