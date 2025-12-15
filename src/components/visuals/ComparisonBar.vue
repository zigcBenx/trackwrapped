<template>
  <div class="comparison-bar-container">
    <!-- User Bar -->
    <div class="bar-row">
      <div class="bar-label">
        <span class="label-text">You</span>
        <span class="label-value">{{ userValue }}</span>
      </div>
      <div class="bar-track">
        <div 
          class="bar-fill user-fill"
          :style="{ width: userWidth + '%' }"
        ></div>
      </div>
    </div>

    <!-- WR Bar -->
    <div class="bar-row">
      <div class="bar-label">
        <span class="label-text">World Record</span>
        <span class="label-value">{{ wrValue }}</span>
      </div>
      <div class="bar-track">
        <div 
          class="bar-fill wr-fill"
          :style="{ width: '100%' }"
        >
          <span class="wr-icon">👑</span>
        </div>
      </div>
    </div>
    
    <div class="comparison-text">
      {{ comparisonText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

interface Props {
  userMark: string
  wrMark: string // We'll need to pass this or estimate it
  discipline: string
}

const props = defineProps<Props>()

// Parse marks to numbers for calculation
// This is tricky because marks can be time (10.58) or distance (8.50)
// For now, assuming simple number format or mm:ss.ms
function parseMark(mark: string | undefined): number {
  if (!mark) return 0
  
  // Handle mm:ss.ms
  if (mark.includes(':')) {
    const parts = mark.split(':')
    if (parts.length === 2) {
      return parseFloat(parts[0] || '0') * 60 + parseFloat(parts[1] || '0')
    }
  }
  
  return parseFloat(mark)
}

const userNumeric = computed(() => parseMark(props.userMark))
// Simplified WR estimation if not provided (would need real data)
const wrNumeric = computed(() => {
  // If we don't have real WR data, we assume user is some % of WR
  // This is a placeholder logic. In real app, we'd need a WR database.
  // For visual demo, let's assume WR is slightly better than user
  // unless user IS the WR holder
  return parseMark(props.wrMark) || (userNumeric.value * 0.9) // Faster is better for running
})

// Determine if lower is better (running) or higher is better (jumping/throwing)
const isRunningEvent = computed(() => {
  const d = props.discipline.toLowerCase()
  return d.includes('metres') || d.includes('hurdles') || d.includes('relay') || d.includes('marathon')
})

const userWidth = ref(0)

onMounted(() => {
  setTimeout(() => {
    // Calculate width percentage relative to WR (which is 100% width)
    // For running: WR (smaller time) is "better", so user bar should be longer (worse) or shorter?
    // Visually, usually "more" bar = better performance in jumps/throws.
    // For running, maybe "speed" bar? 
    // Let's stick to: Bar length represents the value.
    
    let percentage = 0
    if (isRunningEvent.value) {
      // Time: User time > WR time. 
      // If WR is 100% width (9.58s), User (10.00s) should be wider?
      // Or maybe we map speed? Let's map value directly for simplicity.
      // If User is 20s and WR is 10s, User bar is 2x WR bar? That breaks layout.
      // Let's normalize: Max width = User value (since it's likely larger/slower)
      percentage = (wrNumeric.value / userNumeric.value) * 100
      // Wait, if user is slower (larger time), their bar should be "less full" of speed?
      // Let's invert for running: % of WR Speed.
      // Speed = Dist / Time. Dist is constant. So Speed ~ 1/Time.
      // User Speed / WR Speed = (1/User) / (1/WR) = WR / User.
      // So if WR is 10s, User is 20s -> 50% speed.
      // So User bar is 50% width. WR bar is 100% width.
      percentage = (wrNumeric.value / userNumeric.value) * 100
    } else {
      // Distance/Height: Higher is better.
      // WR is max (100%). User is % of WR.
      percentage = (userNumeric.value / wrNumeric.value) * 100
    }
    
    userWidth.value = Math.min(percentage, 100)
  }, 300)
})

const userValue = computed(() => props.userMark)
const wrValue = computed(() => props.wrMark)

const comparisonText = computed(() => {
  const diff = Math.abs(userNumeric.value - wrNumeric.value).toFixed(2)
  if (isRunningEvent.value) {
    return `Only ${diff}s away from greatness!`
  } else {
    return `Just ${diff}m to go!`
  }
})
</script>

<style scoped>
.comparison-bar-container {
  width: 100%;
  max-width: 600px;
  margin: var(--spacing-xl) auto;
}

.bar-row {
  margin-bottom: var(--spacing-lg);
}

.bar-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-xs);
  font-family: 'Inter', sans-serif;
  color: white;
}

.label-text {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.label-value {
  font-family: 'Bebas Neue', 'Arial Black', sans-serif; font-weight: 900;
  font-size: 1.5rem;
  color: #00ff9d;
}

.bar-track {
  width: 100%;
  height: 24px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.bar-fill {
  height: 100%;
  border-radius: 12px;
  transition: width 1.5s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
}

.user-fill {
  background: linear-gradient(90deg, #00d4ff, #00ff9d);
  width: 0; /* Starts at 0 for animation */
}

.wr-fill {
  background: linear-gradient(90deg, #ff416c, #ff4b2b);
  width: 100%;
}

.wr-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.9rem;
}

.comparison-text {
  text-align: center;
  font-family: 'Inter', sans-serif;
  color: rgba(255, 255, 255, 0.8);
  margin-top: var(--spacing-lg);
  font-style: italic;
}
</style>
