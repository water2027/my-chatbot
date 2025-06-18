import type { ReactNode } from 'react'
import type { ChatHistory } from '@/types/chat'
import type { Message } from '@/types/message'
import { useEffect, useState } from 'react'
import { StreamChat } from '@/actions/ai'

interface StoreHandler {
  get: <T>(key: string, model: T) => T | undefined
  set: <T>(key: string, value: T) => void
}

export default function useChat(store: StoreHandler) {
  const [node, setNode] = useState<ReactNode | null>(null)
  const [latestId, setLatestId] = useState(0)
  const [chatHistory, setChatHistory] = useState<{
    [key: string]: ChatHistory
  }>({})
  const [currentChat, setCurrentChat] = useState<ChatHistory>({
    id: '-1',
    messages: [],
  })
  useEffect(() => {
    const handleBeforeUnload = () => {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const submitMessage = async (content: string, model: string) : Promise<void> => {
    if (!content) {
      return Promise.reject(new Error('empty content'))
    }
    if (currentChat.id === '-1') {
      addNewChat()
    }

    const userMessage: Message = { role: 'user', content }
    setCurrentChat(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }))

    try {
      const { node: newNode, result } = await StreamChat([...currentChat.messages, userMessage], model)
      setNode(newNode)
      result.then((finalContent) => {
        setCurrentChat(prev => ({
          ...prev,
          messages: [...prev.messages, {
            role: 'assistant',
            content: finalContent,
          }],
        }))
        setNode(null)
      })
    }
    catch (error) {
      return Promise.reject(error)
    }
  }

  return {
    addNewChat,
    deleteChat,
    selectChat,
    currentChat,
    chatHistory,
    submitMessage,
    node,
  }
}
