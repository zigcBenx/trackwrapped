<template>
  <div 
    class="story-slide texture-overlay"
    :style="{ background: background }"
    :class="[`slide-type-${type}`, `layout-${layout}`]"
    @click="handleTap"
  >
    <!-- Hero Layout (Special Case) -->
    <AthleteHero
      v-if="layout === 'hero'"
      :first-name="data?.firstName || ''"
      :last-name="data?.lastName || ''"
      :discipline-category="data?.stats?.disciplineCategory || 'sprint'"
      :total-competitions="data?.stats?.totalCompetitions || 0"
      :years-active="data?.stats?.yearsActive || 0"
    />

    <!-- Narrative Flow Layout -->
    <div v-else class="slide-content">
      
      <!-- Phase 1: Buildup (Story Lines) -->
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

      <!-- Phase 2: Reveal (Massive Stat) -->
      <div v-else class="reveal-container text-slam">
        <div v-if="emoji" class="slide-emoji animate-bounce">{{ emoji }}</div>
        
        <h1 class="slide-title">{{ title }}</h1>
        
        <!-- Visual Components based on type -->
        <div v-if="type === 'victoryrate'" class="visual-container">
          <StatGauge 
            :value="data?.stats?.victoryRate || 0" 
            label="Podium Finishes"
          />
        </div>

        <div v-else-if="type === 'worldrecord'" class="visual-container">
          <ComparisonBar
            :user-mark="data?.stats?.bestPerformance?.mark || '0'"
            :wr-mark="wrMark" 
            :discipline="data?.stats?.mainDiscipline || ''"
          />
        </div>

        <div v-else-if="type === 'nemesis'" class="visual-container">
          <RivalCard
            :name="data?.stats?.nemesis?.name || 'Unknown'"
            :losses="data?.stats?.nemesis?.losses || 0"
            :meetings="0" 
          />
        </div>

        <!-- Default Massive Stat Display -->
        <div v-else class="massive-stat">
          <div class="stat-value-massive">{{ reveal?.value }}</div>
          <div class="stat-label-massive">{{ reveal?.label }}</div>
          <div v-if="reveal?.subtext" class="stat-subtext">{{ reveal?.subtext }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import AthleteHero from './visuals/AthleteHero.vue'
import StatGauge from './visuals/StatGauge.vue'
import ComparisonBar from './visuals/ComparisonBar.vue'
import RivalCard from './visuals/RivalCard.vue'
import type { SlideData } from '@/config/slideTemplates'
import { getWorldRecord } from '@/config/worldRecords'

interface Props {
  title: string
  background: string
  emoji?: string
  type?: string
  layout?: 'default' | 'hero' | 'split' | 'versus'
  data?: SlideData
  // New props from generateSlides
  computedSequence?: string[]
  computedReveal?: { value: string, label: string, subtext?: string }
}

const props = withDefaults(defineProps<Props>(), {
  layout: 'default',
  computedSequence: () => [],
  computedReveal: () => ({ value: '', label: '' })
})

// State
const phase = ref<'buildup' | 'reveal'>('buildup')
const currentLineIndex = ref(-1)
const sequence = computed(() => props.computedSequence)
const reveal = computed(() => props.computedReveal)

// WR Logic
const wrMark = computed(() => {
  if (props.data?.stats?.bestPerformance?.records && props.data.stats.bestPerformance.records.length > 0) {
    return props.data.stats.bestPerformance.records[0]
  }
  return getWorldRecord(props.data?.stats?.mainDiscipline || '')
})

// Sequencing Logic
let sequenceTimer: any = null

function startSequence() {
  if (props.layout === 'hero') return // Hero slide has its own animation
  
  phase.value = 'buildup'
  currentLineIndex.value = -1
  
  // Advance lines every 1.5s
  const advance = () => {
    if (currentLineIndex.value < sequence.value.length - 1) {
      currentLineIndex.value++
      sequenceTimer = setTimeout(advance, 1500)
    } else {
      // Finished lines, wait a bit then switch to reveal
      sequenceTimer = setTimeout(() => {
        phase.value = 'reveal'
      }, 2000)
    }
  }
  
  // Start first line after delay
  sequenceTimer = setTimeout(advance, 500)
}

function handleTap() {
  if (props.layout === 'hero') return

  if (phase.value === 'buildup') {
    // Skip to reveal immediately
    clearTimeout(sequenceTimer)
    phase.value = 'reveal'
  }
}

// Watch for slide changes to restart sequence
watch(() => props.title, () => {
  clearTimeout(sequenceTimer)
  startSequence()
})

onMounted(() => {
  startSequence()
})
</script>

<style scoped>
.story-slide {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl);
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

/* Vignette effect */
.story-slide::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, transparent 40%, rgba(0, 0, 0, 0.3) 100%);
  pointer-events: none;
  z-index: 1;
}

.slide-content {
  max-width: 900px;
  text-align: center;
  z-index: 2;
  position: relative;
  width: 100%;
}

/* Buildup Styles */
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

/* Reveal Styles */
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

/* Massive Stat Styles */
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
