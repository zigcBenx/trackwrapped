<template>
  <SlideWrapper 
    background="linear-gradient(135deg, #ec4899 0%, #f97316 100%)"
    type="competition"
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
      <div class="slide-emoji fade-in-up" style="animation-delay: 0ms">🏆</div>
      <h1 class="slide-title fade-in-up" style="animation-delay: 150ms">Your {{ heatmapData.year }} Competition Calendar</h1>

      <!-- Competition Heatmap -->
      <div class="fade-in-up" style="animation-delay: 300ms">
        <CompetitionHeatmap
          :weeks="heatmapData.weeks"
          :year="heatmapData.year"
        />
      </div>

      <!-- Total count and joke -->
      <div class="competition-summary fade-in-up" style="animation-delay: 450ms">
        <div class="stat-value-large">{{ totalCompetitions }}</div>
        <div class="stat-label-large">TOTAL COMPETITIONS</div>
        <div class="stat-subtext">{{ frequencyJoke }}</div>
      </div>
    </div>
  </SlideWrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import SlideWrapper from './SlideWrapper.vue'
import CompetitionHeatmap from '../visuals/CompetitionHeatmap.vue'

interface Week {
  week: number
  count: number
  intensity: number
}

interface HeatmapData {
  weeks: Week[]
  year: number
  totalCompetitions: number
}

interface Props {
  totalCompetitions: number
  competitionFrequency: string
  heatmapData: HeatmapData
}

const props = defineProps<Props>()

const phase = ref<'buildup' | 'reveal'>('buildup')
const currentLineIndex = ref(-1)

const sequence = computed(() => {
  return [
    "Looking at your race calendar...",
    `You've competed ${props.totalCompetitions} times`,
    "Each square is a week of the year..."
  ]
})

// Joke based on frequency (from spec)
const frequencyJoke = computed(() => {
  if (props.totalCompetitions <= 5) {
    return "Quality over quantity! You're more selective than a Michelin star restaurant ⭐"
  } else if (props.totalCompetitions <= 15) {
    return "Solid season! You found the sweet spot between training and competing 👌"
  } else if (props.totalCompetitions <= 30) {
    return "Busy athlete! Your calendar looks like Tetris 📅"
  } else {
    return "Do you even rest? You basically LIVE at the track ⛺"
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
  width: 100%;
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
  margin-bottom: var(--spacing-xl); /* Reduced from 2xl */
}

.competition-summary {
  margin-top: var(--spacing-xl); /* Reduced from 2xl */
  text-align: center;
  padding-bottom: var(--spacing-lg); /* Add padding for safety */
}

.stat-value-large {
  font-family: 'Bebas Neue', 'Arial Black', sans-serif; font-weight: 900;
  font-size: 4rem; /* Reduced from 6rem */
  line-height: 0.9;
  color: white;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
}

.stat-label-large {
  font-family: 'Inter', sans-serif;
  font-size: 1.2rem; /* Reduced from 1.5rem */
  font-weight: 800;
  text-transform: uppercase;
  color: #10b981;
  letter-spacing: 2px;
  margin-top: var(--spacing-sm);
}

.stat-subtext {
  font-family: 'Inter', sans-serif;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin-top: var(--spacing-lg);
  font-style: italic;
  max-width: 600px;
}

@media (max-width: 768px) {
  .story-line { font-size: 1.8rem; }
  .stat-value-large { font-size: 4rem; }
  .stat-label-large { font-size: 1.2rem; }
  .stat-subtext { font-size: 1rem; }
  
  .slide-title {
    font-size: 1.2rem;
    margin-bottom: var(--spacing-lg);
  }
  
  .slide-emoji {
    font-size: 4rem;
    margin-bottom: var(--spacing-lg);
  }
  
  .competition-summary {
    margin-top: var(--spacing-xl);
  }
}

@media (max-height: 700px) {
  .slide-emoji { display: none; } /* Hide emoji on very short screens to save space */
  .slide-title { margin-bottom: var(--spacing-md); }
  .stat-value-large { font-size: 3.5rem; }
  .competition-summary { margin-top: var(--spacing-lg); }
}

/* Heatmap Visibility Overrides */
:deep(.heatmap-grid) {
  background: rgba(0, 0, 0, 0.1);
  grid-template-columns: repeat(18, 1fr) !important;
  gap: 6px !important;
  padding: 10px !important;
}

:deep(.heatmap-cell) {
  border-radius: 4px !important;
}

:deep(.intensity-0) {
  background: rgba(0, 0, 0, 0.1);
}

:deep(.intensity-1) {
  background: rgba(255, 255, 255, 0.4);
}

:deep(.intensity-2) {
  background: rgba(255, 255, 255, 0.6);
}

:deep(.intensity-3) {
  background: rgba(255, 255, 255, 0.8);
}

:deep(.intensity-4) {
  background: #ffffff;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

:deep(.year-label) {
  color: rgba(0, 0, 0, 0.5);
}

:deep(.legend-label) {
  color: rgba(0, 0, 0, 0.5);
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
