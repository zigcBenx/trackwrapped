<template>
  <SlideWrapper 
    background="#000000"
    type="rivals"
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
      <div class="slide-emoji fade-in-up" style="animation-delay: 0ms">⚔️</div>
      <h1 class="slide-title fade-in-up" style="animation-delay: 150ms">Your Rivalry Squad</h1>

      <div v-if="topRivals.length > 0" class="rivals-list fade-in-up" style="animation-delay: 300ms">
        <div
          v-for="(rival, index) in topRivals.slice(0, 3)"
          :key="rival.name"
          class="rival-item"
        >
          <div class="rival-rank">{{ index + 1 }}.</div>
          <div class="rival-info">
            <div class="rival-name">{{ rival.name }}</div>
            <div class="rival-meetings">Faced {{ rival.meetings }} times</div>
          </div>
        </div>

        <div class="rivalry-summary">
          You've faced these athletes a combined {{ totalMeetings }} times.
          <br/>
          It's giving 'anime rivalry arc' energy ⚡
        </div>
      </div>


      <div v-else class="massive-stat fade-in-up" style="animation-delay: 300ms">
        <div class="stat-value-massive neon-green">0</div>
        <div class="stat-label-massive">RIVALS</div>
        <div class="stat-subtext">You're too good! No one can keep up 🦅</div>
      </div>
    </div>
  </SlideWrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import SlideWrapper from './SlideWrapper.vue'
import { getTopRivalsSequence } from '@/utils/newSlideJokes'

interface Props {
  topRivals: Array<{ name: string; meetings: number }>
}

const props = defineProps<Props>()

const phase = ref<'buildup' | 'reveal'>('buildup')
const currentLineIndex = ref(-1)
const sequence = getTopRivalsSequence(props.topRivals)

const totalMeetings = computed(() => {
  return props.topRivals.slice(0, 3).reduce((sum, rival) => sum + rival.meetings, 0)
})

let sequenceTimer: any = null

function startSequence() {
  phase.value = 'buildup'
  currentLineIndex.value = -1
  
  const advance = () => {
    if (currentLineIndex.value < sequence.length - 1) {
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
  overflow: hidden;
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
  opacity: 1;
}

.reveal-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.slide-emoji {
  font-size: 6rem;
  margin-bottom: var(--spacing-xl);
  filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.3));
}

.slide-title {
  font-family: var(--font-family-heading);
  font-size: 2rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xl);
  text-align: center;
}

.massive-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value-massive {
  font-family: var(--font-family-heading);
  font-size: 10rem;
  line-height: 0.9;
  color: white;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
}

.neon-green {
  color: var(--color-accent-primary);
  text-shadow: 0 0 20px rgba(204, 255, 0, 0.5);
}

.stat-label-massive {
  font-family: var(--font-family-heading);
  font-size: 2rem;
  font-weight: 800;
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
}

/* Rivals list styles */
.rivals-list {
  width: 100%;
  max-width: 600px;
}

.rival-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-lg);
  margin-bottom: var(--spacing-sm);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px; /* Sharper */
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  transform: skewX(-10deg);
}

.rival-item:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--color-accent-secondary);
  transform: skewX(-10deg) translateX(10px);
}

.rival-rank {
  font-family: var(--font-family-heading);
  font-size: 2.5rem;
  color: var(--color-accent-secondary);
  min-width: 45px;
  transform: skewX(10deg);
}

.rival-info {
  flex: 1;
  text-align: left;
  transform: skewX(10deg);
}

.rival-name {
  font-family: var(--font-family-heading);
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 2px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.rival-meetings {
  font-family: var(--font-family-primary);
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.rivalry-summary {
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-md);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-family: var(--font-family-primary);
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  text-align: center;
}

@media (max-width: 768px) {
  .story-line { font-size: 2.5rem; }
  .stat-value-massive { font-size: 6rem; }
  .stat-label-massive { font-size: 1.5rem; }
}

@media (max-width: 480px) {
  .stat-value-massive { font-size: 3rem; }
  .stat-label-massive { font-size: 1rem; }
  .stat-subtext { font-size: 0.9rem; }
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
</style>
