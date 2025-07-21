import { ref } from 'vue'
import { gsap } from 'gsap'

export function useSlotMachine() {
  const displayOptions = ref([])
  const itemHeight = 40

  const startSlotMachine = (options, slotContainer) => {
    return new Promise((resolve) => {
      if (!slotContainer || options.length < 2) {
        resolve(options[0] || '')
        return
      }

      // Prepare display options with multiple repetitions
      const baseRepeats = 5
      const neededItems = (baseRepeats + 2) * options.length
      displayOptions.value = []
      
      while (displayOptions.value.length < neededItems) {
        displayOptions.value.push(...options)
      }

      // Add buffer items for smooth start and end
      const bufferItems = options.slice(-Math.ceil(options.length / 2))
      displayOptions.value.unshift(...bufferItems)
      
      const endBufferItems = options.slice(0, Math.ceil(options.length / 2))
      displayOptions.value.push(...endBufferItems)

      // Calculate final position
      const finalOptionIndex = Math.floor(Math.random() * options.length)
      const targetIndex = bufferItems.length + (baseRepeats * options.length) + finalOptionIndex
      const targetY = -targetIndex * itemHeight + (itemHeight / 2)

      // Reset position
      gsap.set(slotContainer, { y: 0 })

      // Create animation timeline
      const tl = gsap.timeline({
        onComplete: () => {
          resolve(options[finalOptionIndex])
        }
      })

      // Multi-phase animation for realistic slot machine feel
      tl.to(slotContainer, {
        y: targetY * 0.15,
        duration: 0.4,
        ease: "power2.in"
      })
      .to(slotContainer, {
        y: targetY * 0.85,
        duration: 1.8,
        ease: "none"
      })
      .to(slotContainer, {
        y: targetY,
        duration: 1.2,
        ease: "elastic.out(1, 0.8)"
      })
    })
  }

  return {
    displayOptions,
    startSlotMachine
  }
}
