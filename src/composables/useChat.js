import { ref, computed, watch } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { useStorage } from './useStorage'
import { createOpenAIService } from '../services/openai'

export function useChat() {
  const storage = useStorage()
  
  const conversations = ref(storage.getItem(storage.STORAGE_KEYS.CONVERSATIONS, []))
  const currentConversationId = ref(storage.getItem(storage.STORAGE_KEYS.CURRENT_CONVERSATION, null))
  const apiKey = ref(storage.getItem(storage.STORAGE_KEYS.API_KEY, ''))
  const settings = ref(storage.getItem(storage.STORAGE_KEYS.SETTINGS, {
    model: 'gpt-3.5-turbo',
    systemPrompt: 'You are a helpful assistant.',
    streamEnabled: true
  }))
  
  const isGenerating = ref(false)
  const error = ref(null)

  // Computed
  const currentConversation = computed(() => {
    return conversations.value.find(c => c.id === currentConversationId.value) || null
  })

  const hasApiKey = computed(() => {
    return apiKey.value && apiKey.value.length > 0
  })

  // Watch for changes and persist
  watch(conversations, (newConversations) => {
    storage.setItem(storage.STORAGE_KEYS.CONVERSATIONS, newConversations)
  }, { deep: true })

  watch(currentConversationId, (newId) => {
    storage.setItem(storage.STORAGE_KEYS.CURRENT_CONVERSATION, newId)
  })

  watch(apiKey, (newKey) => {
    storage.setItem(storage.STORAGE_KEYS.API_KEY, newKey)
  })

  watch(settings, (newSettings) => {
    storage.setItem(storage.STORAGE_KEYS.SETTINGS, newSettings)
  }, { deep: true })

  // Methods
  const createConversation = (title = 'New Chat') => {
    const conversation = {
      id: uuidv4(),
      title,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    conversations.value.push(conversation)
    currentConversationId.value = conversation.id
    return conversation
  }

  const deleteConversation = (id) => {
    const index = conversations.value.findIndex(c => c.id === id)
    if (index > -1) {
      conversations.value.splice(index, 1)
      if (currentConversationId.value === id) {
        currentConversationId.value = conversations.value[0]?.id || null
      }
    }
  }

  const selectConversation = (id) => {
    currentConversationId.value = id
  }

  const updateConversationTitle = (id, title) => {
    const conversation = conversations.value.find(c => c.id === id)
    if (conversation) {
      conversation.title = title
      conversation.updatedAt = new Date().toISOString()
    }
  }

  const addMessage = (conversationId, role, content) => {
    const conversation = conversations.value.find(c => c.id === conversationId)
    if (conversation) {
      const message = {
        id: uuidv4(),
        role,
        content,
        timestamp: new Date().toISOString()
      }
      conversation.messages.push(message)
      conversation.updatedAt = new Date().toISOString()
      
      // Auto-generate title from first user message
      if (role === 'user' && conversation.messages.filter(m => m.role === 'user').length === 1) {
        const title = content.slice(0, 50) + (content.length > 50 ? '...' : '')
        updateConversationTitle(conversationId, title)
      }
      
      return message
    }
    return null
  }

  const updateMessage = (conversationId, messageId, content) => {
    const conversation = conversations.value.find(c => c.id === conversationId)
    if (conversation) {
      const message = conversation.messages.find(m => m.id === messageId)
      if (message) {
        message.content = content
        conversation.updatedAt = new Date().toISOString()
      }
    }
  }

  const deleteMessage = (conversationId, messageId) => {
    const conversation = conversations.value.find(c => c.id === conversationId)
    if (conversation) {
      const index = conversation.messages.findIndex(m => m.id === messageId)
      if (index > -1) {
        conversation.messages.splice(index, 1)
        conversation.updatedAt = new Date().toISOString()
      }
    }
  }

  const sendMessage = async (content, onStream = null) => {
    if (!currentConversation.value) {
      createConversation()
    }

    if (!hasApiKey.value) {
      error.value = 'Please configure your OpenAI API key in settings'
      return false
    }

    error.value = null
    isGenerating.value = true

    try {
      // Add user message
      addMessage(currentConversation.value.id, 'user', content)

      // Prepare messages for API
      const messages = currentConversation.value.messages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role,
          content: m.content
        }))

      // Create OpenAI service
      const openai = createOpenAIService(apiKey.value)

      // Add temporary assistant message for streaming
      const assistantMessage = addMessage(currentConversation.value.id, 'assistant', '')

      let fullResponse = ''

      const streamCallback = settings.value.streamEnabled && onStream
        ? (chunk, done) => {
            if (!done) {
              fullResponse += chunk
              updateMessage(currentConversation.value.id, assistantMessage.id, fullResponse)
              if (onStream) onStream(fullResponse)
            }
          }
        : null

      // Send message to API
      const response = await openai.sendMessage(
        messages,
        settings.value.model,
        settings.value.systemPrompt,
        streamCallback
      )

      if (!streamCallback) {
        updateMessage(currentConversation.value.id, assistantMessage.id, response)
      }

      isGenerating.value = false
      return true
    } catch (err) {
      console.error('Error sending message:', err)
      error.value = err.message || 'Failed to send message'
      isGenerating.value = false
      
      // Remove the last user message if API call failed
      const lastMessage = currentConversation.value.messages[currentConversation.value.messages.length - 1]
      if (lastMessage && lastMessage.role === 'assistant' && lastMessage.content === '') {
        deleteMessage(currentConversation.value.id, lastMessage.id)
      }
      
      return false
    }
  }

  const regenerateLastResponse = async (onStream = null) => {
    if (!currentConversation.value || currentConversation.value.messages.length < 2) {
      return false
    }

    const messages = currentConversation.value.messages
    const lastAssistantIndex = messages.map(m => m.role).lastIndexOf('assistant')
    
    if (lastAssistantIndex > 0) {
      // Remove last assistant message
      messages.splice(lastAssistantIndex, 1)
      
      // Get the last user message
      const lastUserMessage = messages[messages.length - 1]
      if (lastUserMessage && lastUserMessage.role === 'user') {
        return await sendMessage(lastUserMessage.content, onStream)
      }
    }
    
    return false
  }

  const clearAllConversations = () => {
    conversations.value = []
    currentConversationId.value = null
  }

  const exportConversations = () => {
    const data = {
      conversations: conversations.value,
      settings: settings.value,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chatgpt-conversations-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const searchConversations = (query) => {
    if (!query) return conversations.value
    
    const lowerQuery = query.toLowerCase()
    return conversations.value.filter(conversation => {
      return conversation.title.toLowerCase().includes(lowerQuery) ||
        conversation.messages.some(m => m.content.toLowerCase().includes(lowerQuery))
    })
  }

  return {
    conversations,
    currentConversationId,
    currentConversation,
    apiKey,
    settings,
    isGenerating,
    error,
    hasApiKey,
    createConversation,
    deleteConversation,
    selectConversation,
    updateConversationTitle,
    addMessage,
    updateMessage,
    deleteMessage,
    sendMessage,
    regenerateLastResponse,
    clearAllConversations,
    exportConversations,
    searchConversations
  }
}
