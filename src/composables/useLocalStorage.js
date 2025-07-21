import { ref, watch } from 'vue'

export function useLocalStorage(key, defaultValue) {
  // Initialize from localStorage or use default
  const storedValue = localStorage.getItem(key)
  const storedOptions = ref(
    storedValue ? JSON.parse(storedValue) : defaultValue
  )

  // Save to localStorage
  const saveOptions = (value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      storedOptions.value = value
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  }

  // Watch for changes and auto-save
  watch(
    storedOptions,
    (newValue) => {
      try {
        localStorage.setItem(key, JSON.stringify(newValue))
      } catch (error) {
        console.error('Failed to save to localStorage:', error)
      }
    },
    { deep: true }
  )

  return {
    storedOptions,
    saveOptions
  }
}
