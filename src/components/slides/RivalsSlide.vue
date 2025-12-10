<template>
  <SlideWrapper 
    background="linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)"
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
      <div class="slide-emoji">⚔️</div>
      <h1 class="slide-title">The Squad</h1>
      <div class="massive-stat">
        <div class="stat-value-massive">{{ topRivals.length }}</div>
        <div class="stat-label-massive">TOP RIVALS</div>
        <div class="stat-subtext">Familiar Faces</div>
      </div>
    </div>
  </SlideWrapper>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SlideWrapper from './SlideWrapper.vue'
import { getTopRivalsSequence } from '@/utils/newSlideJokes'

interface Props {
  topRivals: Array<{ name: string; meetings: number }>
}

const props = defineProps<Props>()

const phase = ref<'buildup' | 'reveal'>('buildup')
const currentLineIndex = ref(-1)
const sequence = getTopRivalsSequence(props.topRivals)

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
  font-family: 'Outfit', sans-serif;
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
  font-family: 'Outfit', sans-serif;
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
  font-family: 'Bebas Neue', sans-serif;
  font-size: 10rem;
  line-height: 0.9;
  color: white;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
}

.stat-label-massive {
  font-family: 'Outfit', sans-serif;
  font-size: 2rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #00ff9d;
  letter-spacing: 2px;
  margin-top: var(--spacing-md);
}

.stat-subtext {
  font-family: 'Outfit', sans-serif;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin-top: var(--spacing-lg);
  font-style: italic;
}

@media (max-width: 768px) {
  .story-line { font-size: 1.8rem; }
  .stat-value-massive { font-size: 6rem; }
  .stat-label-massive { font-size: 1.5rem; }
}
</style>
