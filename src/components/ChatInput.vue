<template>
  <div class="chat-input-container">
    <div class="input-wrapper">
      <textarea
        ref="textareaRef"
        v-model="inputText"
        @keydown="handleKeyDown"
        @input="adjustHeight"
        placeholder="Send a message..."
        :disabled="disabled"
        rows="1"
      ></textarea>
      <div class="input-actions">
        <button 
          v-if="isGenerating"
          @click="$emit('stop')"
          class="stop-btn"
          title="Stop generating"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="6" width="12" height="12" rx="2"></rect>
          </svg>
        </button>
        <button 
          v-else
          @click="handleSubmit"
          :disabled="!canSend"
          class="send-btn"
          title="Send message (Enter)"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
    <div class="input-footer">
      <span class="char-count">{{ charCount }} characters</span>
      <span class="hint">Press <kbd>Enter</kbd> to send, <kbd>Shift+Enter</kbd> for new line</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  isGenerating: {
    type: Boolean,
    default: false
  },
  initialValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['submit', 'stop'])

const textareaRef = ref(null)
const inputText = ref(props.initialValue)

const canSend = computed(() => {
  return inputText.value.trim().length > 0 && !props.disabled
})

const charCount = computed(() => {
  return inputText.value.length
})

const adjustHeight = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = `${Math.min(textareaRef.value.scrollHeight, 200)}px`
  }
}

const handleKeyDown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSubmit()
  }
}

const handleSubmit = () => {
  if (canSend.value) {
    emit('submit', inputText.value.trim())
    inputText.value = ''
    nextTick(() => {
      adjustHeight()
      textareaRef.value?.focus()
    })
  }
}

const focus = () => {
  textareaRef.value?.focus()
}

watch(() => props.initialValue, (newValue) => {
  inputText.value = newValue
  nextTick(adjustHeight)
})

defineExpose({
  focus
})
</script>

<style scoped>
.chat-input-container {
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--bg-primary);
  border-top: 1px solid var(--border-color);
}

.input-wrapper {
  display: flex;
  gap: var(--spacing-sm);
  align-items: flex-end;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  transition: border-color var(--transition-fast);
}

.input-wrapper:focus-within {
  border-color: var(--accent-color);
}

textarea {
  flex: 1;
  border: none;
  background: transparent;
  resize: none;
  font-size: 1rem;
  line-height: 1.5;
  max-height: 200px;
  overflow-y: auto;
  padding: 0;
}

textarea:focus {
  outline: none;
  border: none;
}

textarea::placeholder {
  color: var(--text-secondary);
}

.input-actions {
  display: flex;
  gap: var(--spacing-xs);
}

.send-btn,
.stop-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.send-btn {
  background: var(--accent-color);
  color: white;
}

.send-btn:hover:not(:disabled) {
  background: var(--accent-hover);
  transform: scale(1.05);
}

.send-btn:disabled {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
}

.stop-btn {
  background: var(--error-color);
  color: white;
}

.stop-btn:hover {
  background: #dc2626;
  transform: scale(1.05);
}

.input-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--spacing-sm);
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.char-count {
  font-weight: 500;
}

.hint {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

kbd {
  background: var(--bg-tertiary);
  padding: 0.15em 0.35em;
  border-radius: var(--radius-sm);
  font-family: monospace;
  font-size: 0.85em;
  border: 1px solid var(--border-color);
}

@media (max-width: 768px) {
  .chat-input-container {
    padding: var(--spacing-sm) var(--spacing-md);
  }

  .hint {
    display: none;
  }
}
</style>
