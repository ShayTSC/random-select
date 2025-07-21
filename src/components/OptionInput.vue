<template>
  <div class="flex flex-col xs:flex-row gap-2">
    <input
      v-model="inputValue"
      @keydown.enter="handleAdd"
      @input="handleInput"
      type="text"
      placeholder="输入一个选项"
      class="input-field"
      :disabled="disabled"
      maxlength="50"
      autocomplete="off"
      ref="inputRef"
    />
    <button
      @click="handleAdd"
      class="btn-primary"
      :disabled="disabled || !inputValue.trim()"
    >
      ➕ 添加
    </button>
  </div>
  
  <!-- Character counter for long inputs -->
  <div v-if="inputValue.length > 30" class="text-xs text-gray-500 mt-1">
    {{ inputValue.length }}/50 字符
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'OptionInput',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'add-option'],
  setup(props, { emit }) {
    const inputValue = ref(props.modelValue)
    const inputRef = ref(null)

    // Watch for external changes to modelValue
    watch(() => props.modelValue, (newValue) => {
      inputValue.value = newValue
    })

    // Emit updates to parent
    const handleInput = () => {
      emit('update:modelValue', inputValue.value)
    }

    const handleAdd = () => {
      const value = inputValue.value.trim()
      if (value) {
        emit('add-option')
        inputValue.value = ''
        emit('update:modelValue', '')
        
        // Keep focus on input for better UX
        setTimeout(() => {
          if (inputRef.value) {
            inputRef.value.focus()
          }
        }, 100)
      }
    }

    return {
      inputValue,
      inputRef,
      handleInput,
      handleAdd
    }
  }
}
</script>
