import type { ChatHistory } from '@/types/chat'
import type { Message } from '@/types/message'
import { readStreamableValue } from 'ai/rsc'
import { useCallback, useEffect, useState } from 'react'
import { streamChatResponse } from '@/actions/rsc'

interface StoreHandler {
  get: <T>(key: string, model: T) => T | undefined
  set: <T>(key: string, value: T) => void
}

export default function useChat(store: StoreHandler) {
  const models = ['gpt-4o-mini', 'gpt-4']
  const [model, setModel] = useState<string>(models[0])
  let [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [content, setContent] = useState<string>('')
  const [latestId, setLatestId] = useState(0)
  const [chatHistory, setChatHistory] = useState<{
    [key: string]: ChatHistory
  }>({})
  const [currentChat, setCurrentChat] = useState<ChatHistory>({
    id: '-1',
    messages: [],
  })

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const selectChat = (chatId: string): void => {
    if (chatId === currentChat.id)
      return
    setCurrentChat((_prev) => {
      return chatHistory[chatId]
    })
  }

  const addNewChat = () => {
    const newChat: ChatHistory = {
      id: latestId.toString(),
      messages: [],
    }

    chatHistory[newChat.id] = newChat
    setLatestId(prev => prev + 1)
    selectChat(newChat.id)
  }

  const deleteChat = (chatId: string) => {
    if (chatId === currentChat.id) {
      setCurrentChat({
        id: '-1',
        messages: [],
      })
    }
    const newHistory = { ...chatHistory }
    delete newHistory[chatId]
    setChatHistory(newHistory)
  }

  const submitMessage = async (msg: string): Promise<void> => {
    if (!msg) {
      return Promise.reject(new Error('empty content'))
    }
    if (currentChat.id === '-1') {
      addNewChat()
    }

    const userMessage: Message = { role: 'user', content: msg }
    setCurrentChat(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }))
  }

  const sendToAi = async (): Promise<void> => {
    clearError()
    try {
      const { stream } = await streamChatResponse([...currentChat.messages], model)
      let fullResponse = ''
      for await (const chunk of readStreamableValue(stream)) {
        if (chunk) {
          fullResponse += chunk
          setContent(prev => prev + chunk)
        }
      }

      setContent('')
      setCurrentChat(prev => ({
        ...prev,
        messages: [...prev.messages, {
          role: 'assistant',
          content: fullResponse,
        }],
      }))
    }
    catch (error) {
      setError(error as Error)
    }
  }

  const setTitle = (id: string, title: string): void => {
    const chat = chatHistory[id]
    if (!chat) {
      return
    }
    chat.title = title
    setChatHistory(prev => ({
      ...prev,
      [id]: chat,
    }))
  }

  useEffect(() => {
    const handleBeforeUnload = (): void => {
      store.set('chatHistory', chatHistory)
      store.set('latestId', latestId)
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [store, chatHistory, latestId])

  useEffect(() => {
    if (currentChat.id === '-1')
      return
    const chat = chatHistory[currentChat.id]
    if (!chat) {
      chatHistory[currentChat.id] = currentChat
      return
    }
    chat.messages.splice(0, chat.messages.length, ...currentChat.messages)

    if (currentChat.messages[currentChat.messages.length - 1]?.role === 'user') {
      // 如果是用户发送的, 那么就需要异步请求了
      if (isStreaming) {
        return
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isStreaming = true
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setIsStreaming(true)
      sendToAi().then(() => {
        isStreaming = false
        setIsStreaming(false)
      })
    }
  }, [currentChat])

  useEffect(() => {
    const storedId = store.get('latestId', 0)
    if (storedId) {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setLatestId(storedId)
    }

    const storedHistory = store.get<{ [key: string]: ChatHistory }>('chatHistory', {})
    if (storedHistory) {
      try {
        // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
        setChatHistory(storedHistory)
      }
      catch (error) {
        console.error('Failed to parse chatHistory:', error)
      }
    }
  }, [store])

  return {
    error,
    models,
    model,
    setModel,
    addNewChat,
    deleteChat,
    selectChat,
    currentChat,
    chatHistory,
    submitMessage,
    content,
    setTitle,
    isStreaming,
  }
}
