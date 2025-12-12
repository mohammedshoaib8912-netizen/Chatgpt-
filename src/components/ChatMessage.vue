<template>
  <div :class="['message', `message-${message.role}`]">
    <div class="message-avatar">
      <div class="avatar-icon">
        {{ message.role === 'user' ? '👤' : '🤖' }}
      </div>
    </div>
    <div class="message-content">
      <div class="message-header">
        <span class="message-role">{{ message.role === 'user' ? 'You' : 'Assistant' }}</span>
        <span class="message-timestamp">{{ formatTime(message.timestamp) }}</span>
      </div>
      <div 
        v-if="message.role === 'assistant'" 
        class="message-text markdown-content" 
        v-html="renderedContent"
        ref="contentRef"
      ></div>
      <div v-else class="message-text">{{ message.content }}</div>
      <div class="message-actions">
        <button @click="copyMessage" class="action-btn" title="Copy message">
          <svg v-if="!copied" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </button>
        <button 
          v-if="message.role === 'user' && !isLast"
          @click="$emit('edit', message)" 
          class="action-btn" 
          title="Edit and resend"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button 
          v-if="message.role === 'assistant' && isLast"
          @click="$emit('regenerate')" 
          class="action-btn" 
          title="Regenerate response"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10"></polyline>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { parseMarkdown, setupCodeCopyButtons } from '../utils/markdown'

const props = defineProps({
  message: {
    type: Object,
    required: true
  },
  isLast: {
    type: Boolean,
    default: false
  }
})

defineEmits(['edit', 'regenerate'])

const contentRef = ref(null)
const copied = ref(false)

const renderedContent = computed(() => {
  return parseMarkdown(props.message.content)
})

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const copyMessage = async () => {
  try {
    await navigator.clipboard.writeText(props.message.content)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

watch(renderedContent, async () => {
  await nextTick()
  if (contentRef.value) {
    setupCodeCopyButtons(contentRef.value)
  }
})

onMounted(() => {
  if (contentRef.value) {
    setupCodeCopyButtons(contentRef.value)
  }
})
</script>

<style scoped>
.message {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  animation: fadeIn 0.3s ease;
}

.message-user {
  background: var(--user-message-bg);
}

.message-assistant {
  background: var(--ai-message-bg);
}

.message-avatar {
  flex-shrink: 0;
}

.avatar-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.message-role {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-primary);
}

.message-timestamp {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.message-text {
  color: var(--text-primary);
  line-height: 1.6;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.markdown-content {
  font-size: 0.95rem;
}

.message-actions {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.message:hover .message-actions {
  opacity: 1;
}

.action-btn {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 0.875rem;
}

.action-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

/* Markdown content styles */
.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4),
.markdown-content :deep(h5),
.markdown-content :deep(h6) {
  margin: var(--spacing-lg) 0 var(--spacing-sm) 0;
  font-weight: 600;
  color: var(--text-primary);
}

.markdown-content :deep(h1) { font-size: 1.8rem; }
.markdown-content :deep(h2) { font-size: 1.5rem; }
.markdown-content :deep(h3) { font-size: 1.25rem; }

.markdown-content :deep(p) {
  margin: var(--spacing-sm) 0;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin: var(--spacing-sm) 0;
  padding-left: var(--spacing-xl);
}

.markdown-content :deep(li) {
  margin: var(--spacing-xs) 0;
}

.markdown-content :deep(a) {
  color: var(--accent-color);
  text-decoration: underline;
}

.markdown-content :deep(blockquote) {
  border-left: 3px solid var(--accent-color);
  padding-left: var(--spacing-md);
  margin: var(--spacing-md) 0;
  color: var(--text-secondary);
}

.markdown-content :deep(.code-block-wrapper) {
  position: relative;
  margin: var(--spacing-md) 0;
}

.markdown-content :deep(.code-block-header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-tertiary);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  font-size: 0.875rem;
}

.markdown-content :deep(.code-block-lang) {
  color: var(--text-secondary);
  font-weight: 500;
}

.markdown-content :deep(.copy-code-btn) {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.markdown-content :deep(.copy-code-btn:hover) {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.markdown-content :deep(pre) {
  margin: 0;
  border-radius: 0 0 var(--radius-md) var(--radius-md);
}

.markdown-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: var(--spacing-md) 0;
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
  border: 1px solid var(--border-color);
  padding: var(--spacing-sm);
  text-align: left;
}

.markdown-content :deep(th) {
  background: var(--bg-secondary);
  font-weight: 600;
}

@media (max-width: 768px) {
  .message {
    padding: var(--spacing-md);
  }

  .avatar-icon {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }
}
</style>
