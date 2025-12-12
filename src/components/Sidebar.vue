<template>
  <aside :class="['sidebar', { 'sidebar-collapsed': !isOpen }]">
    <div class="sidebar-header">
      <button @click="$emit('new-chat')" class="new-chat-btn" title="New chat (Ctrl+N)">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>New Chat</span>
      </button>
      <button @click="$emit('toggle')" class="toggle-btn" title="Toggle sidebar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="9" y1="3" x2="9" y2="21"></line>
        </svg>
      </button>
    </div>

    <div class="search-container">
      <div class="search-wrapper">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search conversations..."
          class="search-input"
        />
      </div>
    </div>

    <div class="conversations-list">
      <div v-if="filteredConversations.length === 0" class="empty-state">
        <p>{{ searchQuery ? 'No conversations found' : 'No conversations yet' }}</p>
      </div>
      <button
        v-for="conversation in filteredConversations"
        :key="conversation.id"
        :class="['conversation-item', { active: conversation.id === currentConversationId }]"
        @click="$emit('select-conversation', conversation.id)"
        :title="conversation.title"
      >
        <div class="conversation-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <span class="conversation-title">{{ conversation.title }}</span>
        <button
          @click.stop="$emit('delete-conversation', conversation.id)"
          class="delete-btn"
          title="Delete conversation"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </button>
    </div>

    <div class="sidebar-footer">
      <button @click="$emit('export')" class="footer-btn" title="Export conversations">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        <span>Export</span>
      </button>
      <button @click="$emit('toggle-theme')" class="footer-btn" :title="`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`">
        <svg v-if="theme === 'light'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        <span>{{ theme === 'light' ? 'Dark' : 'Light' }}</span>
      </button>
      <button @click="$emit('open-settings')" class="footer-btn" title="Settings">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M12 1v6m0 6v6m6-12h-6m-6 0H1m5.636 5.636L2.222 21.778m19.556 0L17.364 17.364M1 12h6m6 0h6"></path>
        </svg>
        <span>Settings</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  conversations: {
    type: Array,
    required: true
  },
  currentConversationId: {
    type: String,
    default: null
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  theme: {
    type: String,
    default: 'light'
  }
})

defineEmits([
  'new-chat',
  'select-conversation',
  'delete-conversation',
  'toggle',
  'toggle-theme',
  'open-settings',
  'export'
])

const searchQuery = ref('')

const filteredConversations = computed(() => {
  if (!searchQuery.value) {
    return [...props.conversations].reverse()
  }

  const query = searchQuery.value.toLowerCase()
  return props.conversations
    .filter(conv => {
      return conv.title.toLowerCase().includes(query) ||
        conv.messages.some(msg => msg.content.toLowerCase().includes(query))
    })
    .reverse()
})
</script>

<style scoped>
.sidebar {
  width: 260px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  transition: transform var(--transition-normal), width var(--transition-normal);
  position: relative;
}

.sidebar-collapsed {
  transform: translateX(-100%);
  width: 0;
}

.sidebar-header {
  padding: var(--spacing-md);
  display: flex;
  gap: var(--spacing-sm);
  border-bottom: 1px solid var(--border-color);
}

.new-chat-btn {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--accent-color);
  color: white;
  border-radius: var(--radius-md);
  font-weight: 500;
  transition: background var(--transition-fast);
}

.new-chat-btn:hover {
  background: var(--accent-hover);
}

.toggle-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  transition: background var(--transition-fast), color var(--transition-fast);
}

.toggle-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.search-container {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
}

.search-wrapper {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
}

.search-wrapper svg {
  color: var(--text-secondary);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.875rem;
  padding: 0;
}

.search-input:focus {
  outline: none;
  border: none;
}

.conversations-list {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-sm);
}

.empty-state {
  padding: var(--spacing-xl) var(--spacing-md);
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.conversation-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-xs);
  width: 100%;
  text-align: left;
  color: var(--text-primary);
  transition: background var(--transition-fast);
  position: relative;
  group;
}

.conversation-item:hover {
  background: var(--bg-hover);
}

.conversation-item.active {
  background: var(--bg-tertiary);
}

.conversation-icon {
  color: var(--text-secondary);
  flex-shrink: 0;
}

.conversation-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.875rem;
}

.delete-btn {
  opacity: 0;
  padding: var(--spacing-xs);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  transition: opacity var(--transition-fast), background var(--transition-fast), color var(--transition-fast);
}

.conversation-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background: var(--error-color);
  color: white;
}

.sidebar-footer {
  padding: var(--spacing-md);
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.footer-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  color: var(--text-primary);
  transition: background var(--transition-fast);
}

.footer-btn:hover {
  background: var(--bg-hover);
}

.footer-btn svg {
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .sidebar {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 100;
    box-shadow: var(--shadow-lg);
  }

  .sidebar-collapsed {
    transform: translateX(-100%);
  }
}
</style>
