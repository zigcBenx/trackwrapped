<template>
  <div class="stat-gauge">
    <svg class="gauge-svg" viewBox="0 0 200 200">
      <!-- Background Circle -->
      <circle
        cx="100"
        cy="100"
        r="90"
        fill="none"
        stroke="rgba(255, 255, 255, 0.1)"
        stroke-width="15"
      />
      
      <!-- Progress Circle -->
      <circle
        class="progress-circle"
        cx="100"
        cy="100"
        r="90"
        fill="none"
        stroke="#00ff9d"
        stroke-width="15"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        transform="rotate(-90 100 100)"
      />
    </svg>
    
    <div class="gauge-content">
      <div class="percentage">
        <span class="value">{{ displayedValue }}</span>
        <span class="symbol">%</span>
      </div>
      <div class="label">{{ label }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'

interface Props {
  value: number
  label: string
}

const props = defineProps<Props>()

const radius = 90
const circumference = 2 * Math.PI * radius
const displayedValue = ref(0)

const dashOffset = computed(() => {
  const progress = displayedValue.value / 100
  return circumference * (1 - progress)
})

onMounted(() => {
  animateValue()
})

watch(() => props.value, () => {
  animateValue()
})

function animateValue() {
  const duration = 1500
  const start = 0
  const end = props.value
  const startTime = performance.now()

  function update(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    // Ease out cubic
    const ease = 1 - Math.pow(1 - progress, 3)
    
    displayedValue.value = Math.round(start + (end - start) * ease)

    if (progress < 1) {
      requestAnimationFrame(update)
    }
  }

  requestAnimationFrame(update)
}
</script>

<style scoped>
.stat-gauge {
  position: relative;
  width: 300px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gauge-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg); /* Start from top */
}

.progress-circle {
  transition: stroke-dashoffset 0.1s linear;
  filter: drop-shadow(0 0 10px rgba(0, 255, 157, 0.5));
}

.gauge-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.percentage {
  display: flex;
  align-items: baseline;
  line-height: 0.8;
}

.value {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 8rem;
  color: white;
  text-shadow: 0 0 20px rgba(0, 255, 157, 0.3);
}

.symbol {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 4rem;
  color: rgba(255, 255, 255, 0.8);
  margin-left: 5px;
}

.label {
  font-family: 'Outfit', sans-serif;
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: var(--spacing-sm);
}

@media (max-width: 768px) {
  .stat-gauge {
    width: 250px;
    height: 250px;
  }
  
  .value {
    font-size: 6rem;
  }
  
  .symbol {
    font-size: 3rem;
  }
}
</style>
