<template>
  <div class="space-y-3">
    <!-- Options Counter -->
    <div v-if="options.length > 0" class="flex justify-between items-center text-sm text-gray-600">
      <span>选项列表 ({{ options.length }})</span>
      <span v-if="options.length >= 2" class="text-success-600">✓ 可以开始抽奖</span>
      <span v-else class="text-orange-500">还需 {{ 2 - options.length }} 个选项</span>
    </div>

    <!-- Options List -->
    <div 
      class="options-wrapper overflow-hidden transition-all duration-300"
      :style="{ 
        maxHeight: options.length ? `${Math.min(options.length * 3 + 1, 15)}rem` : '0',
        opacity: options.length ? '1' : '0'
      }"
    >
      <TransitionGroup
        name="list"
        tag="ul"
        class="space-y-2 py-2"
        v-if="options.length > 0"
      >
        <li
          v-for="(option, index) in options"
          :key="`option-${option}-${index}`"
          class="option-item flex justify-between items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
          :class="{ 'pointer-events-none opacity-50': rolling }"
        >
          <span class="text-gray-700 font-medium flex-1 truncate mr-2">
            {{ option }}
          </span>
          <button
            @click="handleRemove(index)"
            class="text-red-400 hover:text-red-600 p-1 rounded transition-colors group-hover:bg-red-50 focus:outline-none focus:bg-red-100"
            :disabled="rolling"
            :aria-label="`删除选项: ${option}`"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </li>
      </TransitionGroup>
    </div>

    <!-- Empty State -->
    <div 
      v-if="options.length === 0" 
      class="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg"
    >
      <div class="text-4xl mb-2">📝</div>
      <p class="text-sm">还没有添加任何选项</p>
      <p class="text-xs mt-1">添加至少2个选项开始抽奖</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OptionsList',
  props: {
    options: {
      type: Array,
      required: true
    },
    rolling: {
      type: Boolean,
      default: false
    }
  },
  emits: ['remove-option', 'clear-options'],
  setup(props, { emit }) {
    const handleRemove = (index) => {
      emit('remove-option', index)
    }

    const handleClear = () => {
      emit('clear-options')
    }

    return {
      handleRemove,
      handleClear
    }
  }
}
</script>

<style scoped>
.options-wrapper {
  max-height: 15rem;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* Scrollbar styling for better mobile experience */
.options-wrapper::-webkit-scrollbar {
  width: 4px;
}

.options-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

.options-wrapper::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 2px;
}

.options-wrapper::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.7);
}

.option-item {
  touch-action: manipulation;
}
</style>
