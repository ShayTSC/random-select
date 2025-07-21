<template>
  <div class="min-h-screen flex items-start xs:items-center justify-center safe-area-inset py-3 xs:py-4">
    <div class="w-full max-w-md mx-1 xs:mx-4">
      <!-- Main Card -->
      <div class="card p-4 xs:p-6 space-y-4 xs:space-y-6">
        <!-- Header -->
        <header class="text-center">
          <h1 class="text-2xl xs:text-3xl font-bold text-primary-600 mb-2">
            🎰 抽奖随机选择器
          </h1>
          <p class="text-gray-600 text-sm">
            添加选项，点击开始，让运气决定结果！
          </p>
        </header>

        <!-- Input Section -->
        <OptionInput 
          v-model="newOption"
          :disabled="rolling"
          @add-option="addOption"
        />

        <!-- Options List -->
        <OptionsList 
          :options="options"
          :rolling="rolling"
          @remove-option="removeOption"
          @clear-options="clearOptions"
        />

        <!-- Controls -->
        <div class="flex flex-col xs:flex-row gap-3 xs:justify-between xs:items-center">
          <button
            @click="clearOptions"
            class="btn-ghost order-2 xs:order-1"
            :disabled="options.length === 0 || rolling"
          >
            清空全部
          </button>
          
          <button
            @click="startRolling"
            class="btn-success order-1 xs:order-2 text-lg py-3 px-6"
            :disabled="rolling || options.length < 2"
            :class="{ 'animate-pulse': rolling }"
          >
            <span v-if="!rolling">🎲 随机选择</span>
            <span v-else>🎰 滚动中...</span>
          </button>
        </div>

        <!-- Result Display -->
        <ResultDisplay 
          :result="result"
          :rolling="rolling"
          :options="options"
          :display-options="displayOptions"
          ref="resultDisplay"
        />

        <!-- Tips for mobile -->
        <div v-if="options.length === 0" class="text-center">
          <div class="text-gray-500 text-sm space-y-2">
            <p>💡 使用小贴士：</p>
            <ul class="space-y-1 text-xs">
              <li>• 至少添加2个选项才能开始</li>
              <li>• 点击选项旁的 ✕ 可以删除</li>
              <li>• 支持表情符号和中英文</li>
            </ul>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <footer class="text-center mt-6 xs:mt-8 text-gray-500 text-xs">
        <p>轻触屏幕，体验更佳 ✨</p>
      </footer>
    </div>
  </div>
</template>

<script>
import { ref, nextTick } from 'vue'
import OptionInput from './components/OptionInput.vue'
import OptionsList from './components/OptionsList.vue'
import ResultDisplay from './components/ResultDisplay.vue'
import { useSlotMachine } from './composables/useSlotMachine'
import { useLocalStorage } from './composables/useLocalStorage'

export default {
  name: 'App',
  components: {
    OptionInput,
    OptionsList,
    ResultDisplay
  },
  setup() {
    const newOption = ref('')
    const { storedOptions, saveOptions } = useLocalStorage('lottery-options', [])
    const options = ref(storedOptions.value)
    const result = ref('')
    const rolling = ref(false)
    const resultDisplay = ref(null)
    
    const { displayOptions, startSlotMachine } = useSlotMachine()

    // Watch options changes and save to localStorage
    const saveOptionsToStorage = () => {
      saveOptions(options.value)
    }

    const addOption = () => {
      const value = newOption.value.trim()
      if (value && !options.value.includes(value)) {
        options.value.push(value)
        newOption.value = ''
        result.value = ''
        saveOptionsToStorage()
        
        // Add haptic feedback on mobile
        if (navigator.vibrate) {
          navigator.vibrate(50)
        }
      }
    }

    const removeOption = (index) => {
      if (index >= 0 && index < options.value.length) {
        options.value.splice(index, 1)
        result.value = ''
        saveOptionsToStorage()
        
        // Add haptic feedback on mobile
        if (navigator.vibrate) {
          navigator.vibrate(30)
        }
      }
    }

    const clearOptions = () => {
      if (options.value.length > 0) {
        options.value.splice(0)
        result.value = ''
        saveOptionsToStorage()
        
        // Add haptic feedback on mobile
        if (navigator.vibrate) {
          navigator.vibrate([30, 50, 30])
        }
      }
    }

    const startRolling = async () => {
      if (options.value.length < 2 || rolling.value) return

      // Clear previous result
      result.value = ''
      rolling.value = true
      
      // Add haptic feedback on mobile
      if (navigator.vibrate) {
        navigator.vibrate(100)
      }

      try {
        const selectedOption = await startSlotMachine(
          options.value,
          resultDisplay.value?.getSlotContainer()
        )
        
        await nextTick()
        
        setTimeout(() => {
          rolling.value = false
          result.value = selectedOption
          
          // Victory haptic feedback
          if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100, 50, 200])
          }
        }, 100)
        
      } catch (error) {
        console.error('Rolling error:', error)
        rolling.value = false
        result.value = '出现错误，请重试'
      }
    }

    return {
      newOption,
      options,
      result,
      rolling,
      displayOptions,
      resultDisplay,
      addOption,
      removeOption,
      clearOptions,
      startRolling
    }
  }
}
</script>
