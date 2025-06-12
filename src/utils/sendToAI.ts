import type { Message } from "@/types/message"

export async function sendToAI(messages: Message[], model: string, callback: (content: any) => void) {
    const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages, model }),
    })
    const reader = res.body?.getReader()
    const decoder = new TextDecoder()
    if (!reader) {
        console.error('No reader available')
        return
    }
    let text = ''
    while (true) {
        const { done, value: value_1 } = await reader.read()

        if (done) {
            console.log('Stream completed')
            break
        }

        const data = decoder.decode(value_1)
        text += data
        callback((prev: string) => prev + data)
    }
    return text
}