import type { Message } from "./message";

export interface ChatHistory {
    id: string;
    messages: Message[]
}