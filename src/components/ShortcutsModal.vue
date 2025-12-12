<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content shortcuts-modal">
        <div class="modal-header">
          <h2>Keyboard Shortcuts</h2>
          <button @click="$emit('close')" class="close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="shortcuts-section">
            <h3>General</h3>
            <div class="shortcut-list">
              <div class="shortcut-item">
                <div class="shortcut-keys">
                  <kbd>Ctrl</kbd> + <kbd>N</kbd>
                </div>
                <div class="shortcut-description">New chat</div>
              </div>
              <div class="shortcut-item">
                <div class="shortcut-keys">
                  <kbd>Ctrl</kbd> + <kbd>/</kbd>
                </div>
                <div class="shortcut-description">Show shortcuts</div>
              </div>
              <div class="shortcut-item">
                <div class="shortcut-keys">
                  <kbd>Ctrl</kbd> + <kbd>S</kbd>
                </div>
                <div class="shortcut-description">Open settings</div>
              </div>
              <div class="shortcut-item">
                <div class="shortcut-keys">
                  <kbd>Ctrl</kbd> + <kbd>B</kbd>
                </div>
                <div class="shortcut-description">Toggle sidebar</div>
              </div>
            </div>
          </div>

          <div class="shortcuts-section">
            <h3>Chat</h3>
            <div class="shortcut-list">
              <div class="shortcut-item">
                <div class="shortcut-keys">
                  <kbd>Enter</kbd>
                </div>
                <div class="shortcut-description">Send message</div>
              </div>
              <div class="shortcut-item">
                <div class="shortcut-keys">
                  <kbd>Shift</kbd> + <kbd>Enter</kbd>
                </div>
                <div class="shortcut-description">New line</div>
              </div>
              <div class="shortcut-item">
                <div class="shortcut-keys">
                  <kbd>Ctrl</kbd> + <kbd>R</kbd>
                </div>
                <div class="shortcut-description">Regenerate response</div>
              </div>
              <div class="shortcut-item">
                <div class="shortcut-keys">
                  <kbd>Esc</kbd>
                </div>
                <div class="shortcut-description">Stop generating</div>
              </div>
            </div>
          </div>

          <div class="shortcuts-section">
            <h3>Navigation</h3>
            <div class="shortcut-list">
              <div class="shortcut-item">
                <div class="shortcut-keys">
                  <kbd>↑</kbd> / <kbd>↓</kbd>
                </div>
                <div class="shortcut-description">Navigate conversations</div>
              </div>
              <div class="shortcut-item">
                <div class="shortcut-keys">
                  <kbd>Ctrl</kbd> + <kbd>K</kbd>
                </div>
                <div class="shortcut-description">Search conversations</div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="$emit('close')" class="primary-btn">Got it!</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

defineEmits(['close'])
</script>

<style scoped>
.shortcuts-modal {
  width: 500px;
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

.shortcuts-section {
  margin-bottom: var(--spacing-xl);
}

.shortcuts-section:last-child {
  margin-bottom: 0;
}

.shortcuts-section h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-xs);
  border-bottom: 1px solid var(--border-color);
}

.shortcut-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.shortcut-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) 0;
}

.shortcut-keys {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.shortcut-description {
  font-size: 0.875rem;
  color: var(--text-primary);
}

kbd {
  background: var(--bg-tertiary);
  padding: 0.25em 0.5em;
  border-radius: var(--radius-sm);
  font-family: monospace;
  font-size: 0.85em;
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.05);
  min-width: 2em;
  text-align: center;
  display: inline-block;
}

.modal-footer {
  display: flex;
  justify-content: center;
  padding: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
}

.primary-btn {
  padding: var(--spacing-sm) var(--spacing-xl);
  border-radius: var(--radius-md);
  font-weight: 500;
  background: var(--accent-color);
  color: white;
  transition: background var(--transition-fast);
}

.primary-btn:hover {
  background: var(--accent-hover);
}

@media (max-width: 768px) {
  .shortcuts-modal {
    width: 100%;
    max-width: 100%;
  }

  .shortcut-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }
}
</style>
