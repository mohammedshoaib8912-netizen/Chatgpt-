<template>
  <div class="app-container">
    <!-- Sidebar -->
    <Sidebar
      :conversations="conversations"
      :currentConversationId="currentConversationId"
      :isOpen="sidebarOpen"
      :theme="theme"
      @new-chat="handleNewChat"
      @select-conversation="selectConversation"
      @delete-conversation="handleDeleteConversation"
      @toggle="sidebarOpen = !sidebarOpen"
      @toggle-theme="toggleTheme"
      @open-settings="settingsModalOpen = true"
      @export="exportConversations"
    />

    <!-- Main content -->
    <main class="main-content">
      <!-- Header -->
      <header class="chat-header">
        <button v-if="!sidebarOpen" @click="sidebarOpen = true" class="menu-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <h1 class="chat-title">
          {{ currentConversation ? currentConversation.title : 'ChatGPT Clone' }}
        </h1>
        <button @click="shortcutsModalOpen = true" class="shortcuts-btn" title="Keyboard shortcuts (Ctrl+/)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="4" width="20" height="16" rx="2"></rect>
            <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M7 12h10"></path>
          </svg>
        </button>
      </header>

      <!-- Chat area -->
      <div class="chat-container">
        <WelcomeScreen
          v-if="!currentConversation || currentConversation.messages.length === 0"
          :hasApiKey="hasApiKey"
          @open-settings="settingsModalOpen = true"
          @new-chat="handleNewChat"
        />
        
        <div v-else class="messages-container" ref="messagesContainer">
          <ChatMessage
            v-for="(message, index) in currentConversation.messages"
            :key="message.id"
            :message="message"
            :isLast="index === currentConversation.messages.length - 1"
            @edit="handleEditMessage"
            @regenerate="handleRegenerate"
          />
          
          <div v-if="isGenerating" class="loading-indicator">
            <div class="typing-animation">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat input -->
      <ChatInput
        v-if="currentConversation"
        ref="chatInputRef"
        :disabled="!hasApiKey"
        :isGenerating="isGenerating"
        @submit="handleSendMessage"
        @stop="handleStopGeneration"
      />
    </main>

    <!-- Modals -->
    <SettingsModal
      :isOpen="settingsModalOpen"
      :apiKey="apiKey"
      :settings="settings"
      @close="settingsModalOpen = false"
      @save="handleSaveSettings"
      @clear-all="handleClearAll"
    />

    <ShortcutsModal
      :isOpen="shortcutsModalOpen"
      @close="shortcutsModalOpen = false"
    />

    <!-- Toast notifications -->
    <Teleport to="body">
      <div v-if="toast" :class="['toast', toast.type]">
        {{ toast.message }}
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import Sidebar from './components/Sidebar.vue'
import WelcomeScreen from './components/WelcomeScreen.vue'
import ChatMessage from './components/ChatMessage.vue'
import ChatInput from './components/ChatInput.vue'
import SettingsModal from './components/SettingsModal.vue'
import ShortcutsModal from './components/ShortcutsModal.vue'
import { useChat } from './composables/useChat'
import { useTheme } from './composables/useTheme'

// Composables
const chat = useChat()
const { theme, toggleTheme } = useTheme()

// Destructure chat composable
const {
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
  sendMessage,
  regenerateLastResponse,
  clearAllConversations,
  exportConversations
} = chat

// UI state
const sidebarOpen = ref(true)
const settingsModalOpen = ref(false)
const shortcutsModalOpen = ref(false)
const messagesContainer = ref(null)
const chatInputRef = ref(null)
const toast = ref(null)

// Methods
const handleNewChat = () => {
  createConversation()
  nextTick(() => {
    chatInputRef.value?.focus()
  })
}

const handleDeleteConversation = (id) => {
  if (confirm('Are you sure you want to delete this conversation?')) {
    deleteConversation(id)
    showToast('Conversation deleted', 'success')
  }
}

const handleSendMessage = async (content) => {
  if (!hasApiKey.value) {
    showToast('Please configure your API key first', 'error')
    settingsModalOpen.value = true
    return
  }

  const success = await sendMessage(content, (streamedContent) => {
    scrollToBottom()
  })

  if (success) {
    scrollToBottom()
  } else if (error.value) {
    showToast(error.value, 'error')
  }
}

const handleRegenerate = async () => {
  const success = await regenerateLastResponse((streamedContent) => {
    scrollToBottom()
  })

  if (success) {
    scrollToBottom()
  } else if (error.value) {
    showToast(error.value, 'error')
  }
}

const handleEditMessage = (message) => {
  // Remove messages after this one
  const messageIndex = currentConversation.value.messages.findIndex(m => m.id === message.id)
  if (messageIndex > -1) {
    currentConversation.value.messages.splice(messageIndex)
    // Resend the message
    handleSendMessage(message.content)
  }
}

const handleStopGeneration = () => {
  // In a real implementation, this would abort the API request
  showToast('Generation stopped', 'success')
}

const handleSaveSettings = ({ apiKey: newApiKey, settings: newSettings }) => {
  apiKey.value = newApiKey
  Object.assign(settings.value, newSettings)
  settingsModalOpen.value = false
  showToast('Settings saved', 'success')
}

const handleClearAll = () => {
  clearAllConversations()
  settingsModalOpen.value = false
  showToast('All conversations cleared', 'success')
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const showToast = (message, type = 'success') => {
  toast.value = { message, type }
  setTimeout(() => {
    toast.value = null
  }, 3000)
}

// Keyboard shortcuts
const handleKeyboardShortcuts = (e) => {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key) {
      case 'n':
        e.preventDefault()
        handleNewChat()
        break
      case '/':
        e.preventDefault()
        shortcutsModalOpen.value = !shortcutsModalOpen.value
        break
      case 's':
        e.preventDefault()
        settingsModalOpen.value = !settingsModalOpen.value
        break
      case 'b':
        e.preventDefault()
        sidebarOpen.value = !sidebarOpen.value
        break
      case 'r':
        e.preventDefault()
        if (currentConversation.value && currentConversation.value.messages.length > 0) {
          handleRegenerate()
        }
        break
      case 'k':
        e.preventDefault()
        // Focus search (would need to implement search focus)
        break
    }
  } else if (e.key === 'Escape') {
    if (isGenerating.value) {
      handleStopGeneration()
    } else if (settingsModalOpen.value) {
      settingsModalOpen.value = false
    } else if (shortcutsModalOpen.value) {
      shortcutsModalOpen.value = false
    }
  }
}

// Watch for conversation changes and scroll to bottom
watch(currentConversationId, () => {
  nextTick(scrollToBottom)
})

watch(() => currentConversation.value?.messages, () => {
  scrollToBottom()
}, { deep: true })

// Lifecycle
onMounted(() => {
  window.addEventListener('keydown', handleKeyboardShortcuts)
  
  // Create first conversation if none exist
  if (conversations.value.length === 0) {
    // Don't create automatically, show welcome screen
  } else if (!currentConversationId.value && conversations.value.length > 0) {
    selectConversation(conversations.value[0].id)
  }
  
  // Check if API key is configured
  if (!hasApiKey.value) {
    setTimeout(() => {
      showToast('Configure your OpenAI API key to get started', 'error')
    }, 1000)
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyboardShortcuts)
})
</script>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.chat-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  min-height: 60px;
}

.menu-btn {
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background var(--transition-fast), color var(--transition-fast);
}

.menu-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.chat-title {
  flex: 1;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.shortcuts-btn {
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background var(--transition-fast), color var(--transition-fast);
}

.shortcuts-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.chat-container {
  flex: 1;
  overflow-y: auto;
  background: var(--bg-primary);
  position: relative;
}

.messages-container {
  max-width: 900px;
  margin: 0 auto;
  padding-bottom: var(--spacing-lg);
}

.loading-indicator {
  display: flex;
  padding: var(--spacing-lg);
  justify-content: center;
}

.typing-animation {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.typing-animation span {
  width: 8px;
  height: 8px;
  background: var(--accent-color);
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-animation span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-animation span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .chat-header {
    padding: var(--spacing-sm) var(--spacing-md);
  }

  .chat-title {
    font-size: 1rem;
  }

  .messages-container {
    padding-bottom: var(--spacing-md);
  }
}
</style>
