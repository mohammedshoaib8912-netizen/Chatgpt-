import { ref, watch, onMounted } from 'vue'
import { useStorage } from './useStorage'

export function useTheme() {
  const storage = useStorage()
  const theme = ref(storage.getItem(storage.STORAGE_KEYS.THEME, 'light'))

  const setTheme = (newTheme) => {
    theme.value = newTheme
    document.documentElement.setAttribute('data-theme', newTheme)
    storage.setItem(storage.STORAGE_KEYS.THEME, newTheme)
  }

  const toggleTheme = () => {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  const initTheme = () => {
    const savedTheme = storage.getItem(storage.STORAGE_KEYS.THEME)
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    }
  }

  watch(theme, (newTheme) => {
    document.documentElement.setAttribute('data-theme', newTheme)
    storage.setItem(storage.STORAGE_KEYS.THEME, newTheme)
  })

  onMounted(() => {
    initTheme()
  })

  return {
    theme,
    setTheme,
    toggleTheme,
    initTheme
  }
}
