<template>
  <SlideWrapper 
    background="linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)"
    type="worldrecord"
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
      <div class="slide-emoji">🏅</div>
      <h1 class="slide-title">The Comparison</h1>
      <div class="visual-container">
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
}

const props = defineProps<Props>()

const phase = ref<'buildup' | 'reveal'>('buildup')
const currentLineIndex = ref(-1)
const sequence = getWorldRecordSequence(props.bestPerformance, props.mainDiscipline)

const wrMark = computed(() => {
  if (props.bestPerformance?.records && props.bestPerformance.records.length > 0) {
    return props.bestPerformance.records[0]
  }
  return getWorldRecord(props.mainDiscipline) || '0'
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

.visual-container {
  width: 100%;
  max-width: 600px;
}

@media (max-width: 768px) {
  .story-line { font-size: 1.8rem; }
}
</style>
