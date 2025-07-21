<template>
  <div class="text-center mt-4 xs:mt-6 h-16 relative">
    <!-- Slot Machine Display -->
    <div 
      class="slot-machine absolute inset-0"
      :class="{ 'opacity-0': !rolling }"
      style="transition: opacity 0.3s ease-in-out;"
    >
      <div class="slot-window"></div>
      <div ref="slotContainer" class="slot-container">
        <div
          v-for="(option, index) in displayOptions"
          :key="`display-${index}`"
          class="slot-item"
        >
          {{ option }}
        </div>
      </div>
    </div>

    <!-- Result Display -->
    <div 
      class="absolute inset-0 flex items-center justify-center"
      :class="{ 'opacity-0': rolling }"
      style="transition: opacity 0.3s ease-in-out;"
    >
      <!-- Success Result -->
      <Transition name="bounce" mode="out-in">
        <div
          v-if="result && !rolling"
          :key="result"
          class="text-center"
        >
          <div class="text-xl xs:text-2xl font-bold text-purple-600 animate-glow mb-2">
            🎉 结果是：{{ result }}
          </div>
          <button
            @click="shareResult"
            class="inline-flex items-center gap-1.5 mt-1 xs:mt-2 px-3 py-1.5 text-gray-600 hover:text-primary-600 text-xs font-medium rounded-full border border-gray-200 hover:border-primary-300 bg-white/80 hover:bg-white transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-primary-400"
            v-if="canShare"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
            </svg>
            <span>分享</span>
          </button>
        </div>
      </Transition>

      <!-- Empty State -->
      <div
        v-if="!result && options.length === 0 && !rolling"
        class="text-gray-500 text-center"
      >
        <div class="text-3xl mb-2">🎯</div>
        <p class="text-sm">请添加选项并开始</p>
      </div>

      <!-- Ready State -->
      <div
        v-if="!result && options.length >= 2 && !rolling"
        class="text-gray-600 text-center"
      >
        <div class="text-2xl mb-2">🎲</div>
        <p class="text-sm">准备就绪，点击开始抽奖！</p>
      </div>

      <!-- Need More Options -->
      <div
        v-if="!result && options.length === 1 && !rolling"
        class="text-orange-500 text-center"
      >
        <div class="text-2xl mb-2">⚠️</div>
        <p class="text-sm">还需要1个选项才能开始</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'ResultDisplay',
  props: {
    result: {
      type: String,
      default: ''
    },
    rolling: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      required: true
    },
    displayOptions: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const slotContainer = ref(null)
    
    const canShare = computed(() => {
      return 'share' in navigator || 'clipboard' in navigator
    })

    const getSlotContainer = () => {
      return slotContainer.value
    }

    const shareResult = async () => {
      if (!props.result) return

      const shareData = {
        title: '🎰 抽奖结果',
        text: `我用随机选择器抽到了：${props.result} 🎉`,
        url: window.location.href
      }

      try {
        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
          await navigator.share(shareData)
        } else if (navigator.clipboard) {
          await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`)
          // Show toast or feedback here
          console.log('结果已复制到剪贴板')
        }
      } catch (error) {
        console.error('分享失败:', error)
      }
    }

    return {
      slotContainer,
      canShare,
      getSlotContainer,
      shareResult
    }
  }
}
</script>

<style scoped>
.bounce-enter-active {
  animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.bounce-leave-active {
  animation: bounceOut 0.3s ease-in;
}

@keyframes bounceIn {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes bounceOut {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.3);
    opacity: 0;
  }
}
</style>
