<template>
  <div class="welcome-screen">
    <div class="welcome-content">
      <div class="welcome-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>
      <h1>Welcome to ChatGPT Clone</h1>
      <p class="welcome-subtitle">Start a conversation with AI</p>
      
      <div class="welcome-features">
        <div class="feature-card">
          <div class="feature-icon">💬</div>
          <h3>Natural Conversations</h3>
          <p>Chat naturally with AI powered by OpenAI</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📚</div>
          <h3>Multiple Chats</h3>
          <p>Organize conversations and switch between them</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🌙</div>
          <h3>Dark Mode</h3>
          <p>Easy on the eyes with dark theme support</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">✨</div>
          <h3>Markdown Support</h3>
          <p>Code blocks, formatting, and syntax highlighting</p>
        </div>
      </div>

      <div class="welcome-actions">
        <button v-if="!hasApiKey" @click="$emit('open-settings')" class="primary-btn">
          Configure API Key
        </button>
        <button v-else @click="$emit('new-chat')" class="primary-btn">
          Start New Chat
        </button>
      </div>

      <div class="welcome-shortcuts">
        <p>Quick Shortcuts:</p>
        <div class="shortcuts-list">
          <span class="shortcut"><kbd>Ctrl</kbd> + <kbd>N</kbd> New Chat</span>
          <span class="shortcut"><kbd>Ctrl</kbd> + <kbd>/</kbd> Shortcuts</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  hasApiKey: {
    type: Boolean,
    required: true
  }
})

defineEmits(['open-settings', 'new-chat'])
</script>

<style scoped>
.welcome-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: var(--spacing-xl);
  overflow-y: auto;
}

.welcome-content {
  max-width: 800px;
  text-align: center;
  animation: fadeIn 0.5s ease;
}

.welcome-icon {
  color: var(--accent-color);
  margin-bottom: var(--spacing-lg);
}

.welcome-icon svg {
  width: 64px;
  height: 64px;
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
}

.welcome-subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
}

.welcome-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--spacing-lg);
  margin: var(--spacing-xl) 0;
}

.feature-card {
  background: var(--bg-secondary);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.feature-icon {
  font-size: 2rem;
  margin-bottom: var(--spacing-sm);
}

.feature-card h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  color: var(--text-primary);
}

.feature-card p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

.welcome-actions {
  margin: var(--spacing-xl) 0;
}

.primary-btn {
  background: var(--accent-color);
  color: white;
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 600;
  transition: background var(--transition-fast), transform var(--transition-fast);
}

.primary-btn:hover:not(:disabled) {
  background: var(--accent-hover);
  transform: translateY(-1px);
}

.welcome-shortcuts {
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--border-color);
}

.welcome-shortcuts p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
}

.shortcuts-list {
  display: flex;
  gap: var(--spacing-lg);
  justify-content: center;
  flex-wrap: wrap;
}

.shortcut {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

kbd {
  background: var(--bg-tertiary);
  padding: 0.2em 0.4em;
  border-radius: var(--radius-sm);
  font-family: monospace;
  font-size: 0.85em;
  border: 1px solid var(--border-color);
}

@media (max-width: 768px) {
  h1 {
    font-size: 2rem;
  }

  .welcome-features {
    grid-template-columns: 1fr;
  }
}
</style>
