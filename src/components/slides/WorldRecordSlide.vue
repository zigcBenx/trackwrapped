<template>
  <SlideWrapper 
    background="#000000"
    type="worldrecord"
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
      <div class="slide-emoji fade-in-up" style="animation-delay: 0ms">🏅</div>
      <h1 class="slide-title fade-in-up" style="animation-delay: 150ms">Chasing Greatness</h1>
      <div class="visual-container fade-in-up" style="animation-delay: 300ms">
        <ComparisonBar
          :user-mark="bestPerformance?.mark || '0'"
          :wr-mark="wrMark"
          :discipline="mainDiscipline"
        />
      </div>
    </div>
  </SlideWrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import SlideWrapper from './SlideWrapper.vue'
import ComparisonBar from '../visuals/ComparisonBar.vue'
import { getWorldRecordSequence } from '@/utils/newSlideJokes'
import { getWorldRecord } from '@/config/worldRecords'
import type { PersonalBest } from '@/types/athleteDetails'

interface Props {
  bestPerformance: PersonalBest | null
  mainDiscipline: string
  gender: string | null
}

const props = defineProps<Props>()

const phase = ref<'buildup' | 'reveal'>('buildup')
const currentLineIndex = ref(-1)
const sequence = getWorldRecordSequence(props.bestPerformance, props.mainDiscipline)

const wrMark = computed(() => {
  const disciplineToCompare = props.bestPerformance?.discipline || props.mainDiscipline
  return getWorldRecord(disciplineToCompare, props.gender) || '0'
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

.story-line.race-in-left {
  transform: translateX(-100%);
  animation: raceInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.story-line.race-in-right {
  transform: translateX(100%);
  animation: raceInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes raceInLeft {
  to {
    transform: translateX(0);
  }
}

@keyframes raceInRight {
  to {
    transform: translateX(0);
  }
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
  max-width: 600px;
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
}
</style>
