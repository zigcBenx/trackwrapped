<template>
  <SlideWrapper 
    background="#000000"
    type="veteran"
    :showPattern="true"
    @click="handleTap"
  >
    <!-- Buildup Phase -->
    <div v-if="phase === 'buildup'" class="buildup-container">
      <div 
        v-for="(line, index) in sequence" 
        :key="index"
        class="story-line"
        :class="[
          { 'visible': index <= currentLineIndex },
          index <= currentLineIndex ? (index % 2 === 0 ? 'race-in-left' : 'race-in-right') : ''
        ]"
      >
        {{ line }}
      </div>
    </div>

    <!-- Reveal Phase -->
    <div v-else class="reveal-container">
      <div class="slide-emoji fade-in-up" style="animation-delay: 0ms">📅</div>
      <h1 class="slide-title fade-in-up" style="animation-delay: 150ms">{{ yearsActive }} Years in the Game</h1>

      <div class="massive-stat fade-in-up" style="animation-delay: 300ms">
        <div class="stat-value-massive neon-gold">{{ yearsActive }}</div>
        <div class="stat-label-massive">YEARS ACTIVE</div>
        <div class="stat-subtext">{{ veteranJoke }}</div>
      </div>
    </div>
  </SlideWrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import SlideWrapper from './SlideWrapper.vue'

interface Props {
  yearsActive: number
  nickname: string
}

const props = defineProps<Props>()

const phase = ref<'buildup' | 'reveal'>('buildup')
const currentLineIndex = ref(-1)

// Generate sequence based on years
const sequence = computed(() => {
  const lines = ["You've been on the track scene for a while..."]
  
  if (props.yearsActive <= 2) {
    lines.push("Just getting started!")
    lines.push("Fresh legs, big dreams 👟")
  } else if (props.yearsActive <= 5) {
    lines.push("Finding your rhythm...")
    lines.push("No longer a rookie 📚")
  } else if (props.yearsActive <= 10) {
    lines.push("Seen a lot of starting lines...")
    lines.push("Veteran status loading... 👴")
  } else {
    lines.push("Longer than some competitors have been alive!")
    lines.push("Is retirement knocking? (Jk) 🏛️")
  }
  
  return lines
})

// Generate joke based on years (from spec)
const veteranJoke = computed(() => {
  if (props.yearsActive <= 2) {
    return "Fresh legs! The track is your playground 🏃"
  } else if (props.yearsActive <= 5) {
    return "Getting serious! You know your way around a starting block 💪"
  } else if (props.yearsActive <= 10) {
    return "Veteran status unlocked! You've seen enough starting blocks to build a house 🏠"
  } else {
    return "Track legend! You remember when timing chips were optional ⏱️"
  }
})

let sequenceTimer: any = null

function startSequence() {
  phase.value = 'buildup'
  currentLineIndex.value = -1
  
  const advance = () => {
    if (currentLineIndex.value < sequence.value.length - 1) {
      currentLineIndex.value++
      sequenceTimer = setTimeout(advance, 1500)
    } else {
      sequenceTimer = setTimeout(() => {
        phase.value = 'reveal'
      }, 2000)
    }
  }
  
  sequenceTimer = setTimeout(advance, 500)
}

function handleTap() {
  if (phase.value === 'buildup') {
    clearTimeout(sequenceTimer)
    phase.value = 'reveal'
  }
}

onMounted(() => {
  startSequence()
})

defineExpose({
  skipBuildup: () => {
    if (phase.value === 'buildup') {
      handleTap()
      return true
    }
    return false
  }
})
</script>

<style scoped>
.buildup-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  min-height: 300px;
  justify-content: center;
  width: 100%;
  overflow: hidden; /* Prevent scrollbars during animation */
}

.story-line {
  font-family: var(--font-family-heading);
  font-size: 3.5rem;
  font-weight: 700;
  color: white;
  opacity: 0;
  text-transform: uppercase;
  line-height: 1;
  text-align: center;
  width: 100%;
}

.story-line.visible {
  opacity: 1; /* Animation handles visibility, but keep this for state */
}

.reveal-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.slide-emoji {
  font-size: 4rem;
  margin-bottom: var(--spacing-lg);
  filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.3));
}

.slide-title {
  font-family: var(--font-family-heading);
  font-size: 2rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.massive-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.stat-value-massive {
  font-family: var(--font-family-heading);
  font-size: 10rem;
  line-height: 0.8;
  color: white;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
}

.neon-gold {
  color: var(--color-accent-primary);
  text-shadow: 0 0 20px rgba(204, 255, 0, 0.5);
}

.stat-label-massive {
  font-family: var(--font-family-heading);
  font-size: 2.5rem;
  font-weight: 700;
  text-transform: uppercase;
  color: white;
  letter-spacing: 4px;
  margin-top: var(--spacing-md);
}

.stat-subtext {
  font-family: var(--font-family-primary);
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin-top: var(--spacing-lg);
  font-style: italic;
  text-align: center;
  max-width: 90%;
}

/* Float-in animation for reveal phase */
.fade-in-up {
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
  transform: translateY(30px);
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .story-line { font-size: 2.5rem; }
  .stat-value-massive { font-size: 8rem; }
  .stat-label-massive { font-size: 2rem; }
}
</style>
