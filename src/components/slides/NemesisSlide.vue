<template>
  <SlideWrapper 
    background="#000000"
    type="nemesis"
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
      <div class="slide-emoji fade-in-up" style="animation-delay: 0ms">😈</div>
      <h1 class="slide-title fade-in-up" style="animation-delay: 150ms">Nemesis Alert</h1>
      <div v-if="nemesis" class="visual-container flip-in-3d" style="animation-delay: 300ms">
        <RivalCard
          :name="nemesis.name"
          :losses="nemesis.losses"
          :meetings="nemesis.meetings"
        />
      </div>
      <div v-else class="massive-stat fade-in-up" style="animation-delay: 300ms">
        <div class="stat-value-massive neon-green">NONE</div>
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
  nemesis: { name: string; losses: number; meetings: number } | null
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

.visual-container {
  width: 100%;
  max-width: 400px;
  padding: 0 var(--spacing-md);
  perspective: 1000px; /* Enable 3D space */
}

/* ... existing styles ... */

/* 3D Flip Animation */
.flip-in-3d {
  animation: flipIn3D 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  opacity: 0;
  transform-style: preserve-3d;
  transform: rotateY(90deg);
}

@keyframes flipIn3D {
  0% {
    opacity: 0;
    transform: rotateY(90deg);
  }
  100% {
    opacity: 1;
    transform: rotateY(0deg);
  }
}

@media (max-width: 768px) {
  .story-line { font-size: 2.5rem; }
  .stat-value-massive { font-size: 6rem; }
  .stat-label-massive { font-size: 1.5rem; }
}
</style>
