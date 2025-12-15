<template>
  <SlideWrapper 
    background="linear-gradient(135deg, #ec4899 0%, #f97316 100%)"
    type="rivals"
    @click="handleTap"
  >
    <!-- Buildup Phase -->
    <div v-if="phase === 'buildup'" class="buildup-container">
      <div 
        v-for="(line, index) in sequence" 
        :key="index"
        class="story-line"
        :class="{ 'visible': index <= currentLineIndex }"
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
        <div class="stat-value-massive">0</div>
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
</script>

<style scoped>
.buildup-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  min-height: 300px;
  justify-content: center;
}

.story-line {
  font-family: 'Inter', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.story-line.visible {
  opacity: 1;
  transform: translateY(0);
}

.reveal-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.slide-emoji {
  font-size: 6rem;
  margin-bottom: var(--spacing-xl);
  filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.3));
}

.slide-title {
  font-family: 'Inter', sans-serif;
  font-size: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 4px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: var(--spacing-xl);
}

.massive-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value-massive {
  font-family: 'Bebas Neue', 'Arial Black', sans-serif; font-weight: 900;
  font-size: 10rem;
  line-height: 0.9;
  color: white;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
}

.stat-label-massive {
  font-family: 'Inter', sans-serif;
  font-size: 2rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #10b981;
  letter-spacing: 2px;
  margin-top: var(--spacing-md);
}

.stat-subtext {
  font-family: 'Inter', sans-serif;
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
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.rival-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(5px);
}

.rival-rank {
  font-family: 'Bebas Neue', 'Arial Black', sans-serif; font-weight: 900;
  font-size: 2.5rem;
  color: #10b981;
  min-width: 45px;
}

.rival-info {
  flex: 1;
  text-align: left;
}

.rival-name {
  font-family: 'Inter', sans-serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: white;
  margin-bottom: 2px;
}

.rival-meetings {
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.rivalry-summary {
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-md);
  border-top: 2px solid rgba(255, 255, 255, 0.2);
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  text-align: center;
}

@media (max-width: 768px) {
  .story-line { font-size: 1.8rem; }
  .stat-value-massive { font-size: 4rem; }
  .stat-label-massive { font-size: 1.2rem; }
  .stat-subtext { font-size: 1rem; }

  .rival-item { padding: var(--spacing-xs) var(--spacing-md); }
  .rival-rank { font-size: 2rem; min-width: 35px; }
  .rival-name { font-size: 1.1rem; }
  .rival-meetings { font-size: 0.8rem; }
  .rivalry-summary { font-size: 0.9rem; margin-top: var(--spacing-md); }
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
