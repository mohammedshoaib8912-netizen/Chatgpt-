<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content settings-modal">
        <div class="modal-header">
          <h2>Settings</h2>
          <button @click="$emit('close')" class="close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="settings-section">
            <h3>OpenAI API Configuration</h3>
            <div class="form-group">
              <label for="apiKey">API Key</label>
              <div class="api-key-input">
                <input
                  id="apiKey"
                  v-model="localApiKey"
                  :type="showApiKey ? 'text' : 'password'"
                  placeholder="sk-..."
                  class="input-field"
                />
                <button @click="showApiKey = !showApiKey" class="toggle-visibility-btn">
                  <svg v-if="showApiKey" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                  <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </div>
              <p class="help-text">
                Get your API key from 
                <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">
                  OpenAI Dashboard
                </a>
              </p>
              <button 
                v-if="localApiKey" 
                @click="testApiKey" 
                class="test-btn"
                :disabled="testingConnection"
              >
                {{ testingConnection ? 'Testing...' : 'Test Connection' }}
              </button>
              <div v-if="connectionStatus" :class="['status-message', connectionStatus.type]">
                {{ connectionStatus.message }}
              </div>
            </div>
          </div>

          <div class="settings-section">
            <h3>Model Settings</h3>
            <div class="form-group">
              <label for="model">Model</label>
              <select id="model" v-model="localSettings.model" class="select-field">
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-4-turbo-preview">GPT-4 Turbo</option>
              </select>
              <p class="help-text">Choose which OpenAI model to use</p>
            </div>

            <div class="form-group">
              <label for="systemPrompt">System Prompt</label>
              <textarea
                id="systemPrompt"
                v-model="localSettings.systemPrompt"
                rows="4"
                class="textarea-field"
                placeholder="You are a helpful assistant."
              ></textarea>
              <p class="help-text">Customize the assistant's behavior</p>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="localSettings.streamEnabled" />
                <span>Enable streaming responses</span>
              </label>
              <p class="help-text">Show responses as they're generated</p>
            </div>
          </div>

          <div class="settings-section danger-zone">
            <h3>Danger Zone</h3>
            <button @click="clearAllData" class="danger-btn">
              Clear All Conversations
            </button>
            <p class="help-text">This will permanently delete all your conversations. This action cannot be undone.</p>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="$emit('close')" class="secondary-btn">Cancel</button>
          <button @click="saveSettings" class="primary-btn">Save Changes</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { createOpenAIService } from '../services/openai'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  apiKey: {
    type: String,
    default: ''
  },
  settings: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'save', 'clear-all'])

const localApiKey = ref(props.apiKey)
const localSettings = ref({ ...props.settings })
const showApiKey = ref(false)
const testingConnection = ref(false)
const connectionStatus = ref(null)

watch(() => props.apiKey, (newValue) => {
  localApiKey.value = newValue
})

watch(() => props.settings, (newValue) => {
  localSettings.value = { ...newValue }
}, { deep: true })

const testApiKey = async () => {
  if (!localApiKey.value) return

  testingConnection.value = true
  connectionStatus.value = null

  try {
    const service = createOpenAIService(localApiKey.value)
    const isValid = await service.testConnection()

    if (isValid) {
      connectionStatus.value = {
        type: 'success',
        message: '✓ API key is valid!'
      }
    } else {
      connectionStatus.value = {
        type: 'error',
        message: '✗ Invalid API key'
      }
    }
  } catch (error) {
    connectionStatus.value = {
      type: 'error',
      message: `✗ Connection failed: ${error.message}`
    }
  } finally {
    testingConnection.value = false
  }
}

const saveSettings = () => {
  emit('save', {
    apiKey: localApiKey.value,
    settings: localSettings.value
  })
}

const clearAllData = () => {
  if (confirm('Are you sure you want to delete all conversations? This cannot be undone.')) {
    emit('clear-all')
  }
}
</script>

<style scoped>
.settings-modal {
  width: 600px;
  max-width: 90vw;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.close-btn {
  padding: var(--spacing-xs);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  transition: background var(--transition-fast), color var(--transition-fast);
}

.close-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.modal-body {
  padding: var(--spacing-lg);
  max-height: 60vh;
  overflow-y: auto;
}

.settings-section {
  margin-bottom: var(--spacing-xl);
}

.settings-section:last-child {
  margin-bottom: 0;
}

.settings-section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-group:last-child {
  margin-bottom: 0;
}

label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.input-field,
.select-field,
.textarea-field {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 0.875rem;
  transition: border-color var(--transition-fast);
}

.input-field:focus,
.select-field:focus,
.textarea-field:focus {
  border-color: var(--accent-color);
  outline: none;
}

.api-key-input {
  display: flex;
  gap: var(--spacing-sm);
}

.api-key-input .input-field {
  flex: 1;
}

.toggle-visibility-btn {
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  transition: background var(--transition-fast), color var(--transition-fast);
}

.toggle-visibility-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.help-text {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: var(--spacing-xs);
}

.help-text a {
  color: var(--accent-color);
  text-decoration: underline;
}

.test-btn {
  margin-top: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  transition: background var(--transition-fast);
}

.test-btn:hover:not(:disabled) {
  background: var(--bg-hover);
}

.status-message {
  margin-top: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
}

.status-message.success {
  background: rgba(16, 163, 127, 0.1);
  color: var(--accent-color);
}

.status-message.error {
  background: rgba(239, 68, 68, 0.1);
  color: var(--error-color);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  cursor: pointer;
}

.danger-zone {
  border-top: 1px solid var(--border-color);
  padding-top: var(--spacing-lg);
}

.danger-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--error-color);
  color: white;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  transition: background var(--transition-fast);
}

.danger-btn:hover {
  background: #dc2626;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
}

.secondary-btn,
.primary-btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-md);
  font-weight: 500;
  transition: all var(--transition-fast);
}

.secondary-btn {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.secondary-btn:hover {
  background: var(--bg-hover);
}

.primary-btn {
  background: var(--accent-color);
  color: white;
}

.primary-btn:hover {
  background: var(--accent-hover);
}

@media (max-width: 768px) {
  .settings-modal {
    width: 100%;
    max-width: 100%;
    max-height: 100%;
    border-radius: 0;
  }

  .modal-body {
    max-height: calc(100vh - 140px);
  }
}
</style>
