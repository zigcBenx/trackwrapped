<template>
  <SlideWrapper 
    background="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
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
      <div class="slide-emoji">🏆</div>
      <h1 class="slide-title">Your {{ heatmapData.year }} Competition Calendar</h1>
      
      <!-- Competition Heatmap -->
      <CompetitionHeatmap 
        :weeks="heatmapData.weeks"
        :year="heatmapData.year"
      />
      
      <!-- Total count and joke -->
      <div class="competition-summary">
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
  margin-bottom: var(--spacing-2xl);
}

.competition-summary {
  margin-top: var(--spacing-2xl);
  text-align: center;
}

.stat-value-large {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 6rem;
  line-height: 0.9;
  color: white;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
}

.stat-label-large {
  font-family: 'Outfit', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #00ff9d;
  letter-spacing: 2px;
  margin-top: var(--spacing-sm);
}

.stat-subtext {
  font-family: 'Outfit', sans-serif;
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
}
</style>
