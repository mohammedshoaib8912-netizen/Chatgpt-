import { ref, watch } from 'vue'

const STORAGE_KEYS = {
  CONVERSATIONS: 'chatgpt_conversations',
  CURRENT_CONVERSATION: 'chatgpt_current_conversation',
  API_KEY: 'chatgpt_api_key',
  THEME: 'chatgpt_theme',
  SETTINGS: 'chatgpt_settings'
}

export function useStorage() {
  const getItem = (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error)
      return defaultValue
    }
  }

  const setItem = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error)
      return false
    }
  }

  const removeItem = (key) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error)
      return false
    }
  }

  const clearAll = () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        if (key !== STORAGE_KEYS.THEME && key !== STORAGE_KEYS.API_KEY) {
          localStorage.removeItem(key)
        }
      })
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  }

  const exportData = () => {
    const data = {}
    Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
      const value = getItem(key)
      if (value !== null) {
        data[name] = value
      }
    })
    return data
  }

  const importData = (data) => {
    try {
      Object.entries(data).forEach(([name, value]) => {
        const key = STORAGE_KEYS[name]
        if (key) {
          setItem(key, value)
        }
      })
      return true
    } catch (error) {
      console.error('Error importing data:', error)
      return false
    }
  }

  return {
    STORAGE_KEYS,
    getItem,
    setItem,
    removeItem,
    clearAll,
    exportData,
    importData
  }
}

export function useStorageRef(key, defaultValue = null) {
  const storage = useStorage()
  const value = ref(storage.getItem(key, defaultValue))

  watch(value, (newValue) => {
    storage.setItem(key, newValue)
  }, { deep: true })

  return value
}
