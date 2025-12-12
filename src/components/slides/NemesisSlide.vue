<template>
  <SlideWrapper 
    background="linear-gradient(135deg, #000000 0%, #1a1a1a 100%)"
    type="nemesis"
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
      <div class="slide-emoji fade-in-up" style="animation-delay: 0ms">😈</div>
      <h1 class="slide-title fade-in-up" style="animation-delay: 150ms">Nemesis Alert</h1>
      <div v-if="nemesis" class="visual-container fade-in-up" style="animation-delay: 300ms">
        <RivalCard
          :name="nemesis.name"
          :losses="nemesis.losses"
          :meetings="nemesis.losses"
        />
      </div>
      <div v-else class="massive-stat fade-in-up" style="animation-delay: 300ms">
        <div class="stat-value-massive">NONE</div>
        <div class="stat-label-massive">ARCH RIVAL</div>
        <div class="stat-subtext">You are safe... for now</div>
      </div>
    </div>
  </SlideWrapper>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SlideWrapper from './SlideWrapper.vue'
import RivalCard from '../visuals/RivalCard.vue'
import { getNemesisSequence } from '@/utils/newSlideJokes'

interface Props {
  nemesis: { name: string; losses: number } | null
}

const props = defineProps<Props>()

const phase = ref<'buildup' | 'reveal'>('buildup')
const currentLineIndex = ref(-1)
const sequence = getNemesisSequence(props.nemesis)

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
  width: 100%;
}

.slide-emoji {
  font-size: 3.5rem;
  margin-bottom: var(--spacing-sm);
  filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.3));
}

.slide-title {
  font-family: 'Outfit', sans-serif;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: var(--spacing-md);
}

.visual-container {
  width: 100%;
  max-width: 400px;
  padding: 0 var(--spacing-md);
}

.massive-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value-massive {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 6rem; /* Fixed size for card */
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
  .stat-value-massive { font-size: 4rem; }
  .stat-label-massive { font-size: 1.2rem; }
  .stat-subtext { font-size: 1rem; }
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
