<template>
  <SlideWrapper 
    background="black"
    type="performance"
    :showPattern="true"
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
      <div class="content-wrapper">
        <h1 class="slide-title slam-in" style="animation-delay: 100ms">PERFORMANCE SCORE</h1>

        <!-- Massive Score Display -->
        <div class="score-display slam-in" style="animation-delay: 200ms">
          <div class="score-value">{{ stats.currentSeasonBestScore }}</div>
        </div>

        <!-- Comparison Grid -->
        <div class="comparison-grid fade-in-up" style="animation-delay: 400ms">
          <div class="comparison-item">
            <div class="label">LAST SEASON</div>
            <div class="value">{{ stats.lastSeasonBestScore || '--' }}</div>
          </div>
          
          <div class="comparison-item">
            <div class="label">CHANGE</div>
            <div class="value" :class="{ positive: stats.scoreChangePercent > 0, negative: stats.scoreChangePercent < 0 }">
              {{ stats.scoreChangePercent > 0 ? '+' : '' }}{{ stats.scoreChangePercent }}%
            </div>
          </div>
        </div>

        <!-- Ranking Badge -->
        <div class="ranking-badge slam-in" style="animation-delay: 600ms">
          <div class="rank-label">RANKING</div>
          <div class="rank-value">TOP {{ stats.percentileRank.rank }}</div>
          <div class="rank-desc">{{ stats.percentileRank.label }}</div>
        </div>
      </div>
    </div>
  </SlideWrapper>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SlideWrapper from './SlideWrapper.vue'
import { getPerformanceSequence } from '@/utils/jokeGenerator'
import type { ProcessedAthleteStats } from '@/types/athleteDetails'

interface Props {
  isImproving: boolean
  stats: ProcessedAthleteStats
}

const props = defineProps<Props>()

const phase = ref<'buildup' | 'reveal'>('buildup')
const currentLineIndex = ref(-1)
const sequence = getPerformanceSequence(props.isImproving, props.stats)

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
      }, 1000)
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
  gap: var(--spacing-lg);
  min-height: 300px;
  justify-content: center;
  align-items: center;
  text-align: center;
  z-index: 10;
}

.story-line {
  font-family: var(--font-family-heading);
  font-size: 4rem;
  font-weight: 700;
  color: white;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  text-transform: uppercase;
  line-height: 0.9;
}

.story-line.visible {
  opacity: 1;
  transform: scale(1);
}

.reveal-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.content-wrapper {
  position: relative;
  z-index: 2;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  padding-top: var(--spacing-2xl); /* Added margin from top */
}

.slide-title {
  font-family: var(--font-family-heading);
  font-size: 2rem;
  color: var(--color-accent-primary);
  margin: 0;
  letter-spacing: 4px;
  font-weight: 600;
}

.score-display {
  position: relative;
  margin: var(--spacing-sm) 0;
}

.score-value {
  font-family: var(--font-family-heading);
  font-size: clamp(6rem, 18vw, 12rem);
  line-height: 0.8;
  font-weight: 700;
  color: white;
  text-shadow: 
    4px 4px 0px var(--color-accent-secondary),
    8px 8px 0px rgba(255, 255, 255, 0.1);
  transform: skew(-5deg);
  max-width: 100%;
  word-break: break-all;
  animation: glitchSkew 4s infinite; /* Applied directly here to ensure it overrides transform */
}

.comparison-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  width: 100%;
  padding: 0 var(--spacing-xl);
  margin-top: var(--spacing-md);
}

.comparison-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top: 2px solid rgba(255, 255, 255, 0.2);
  padding-top: var(--spacing-sm);
}

.label {
  font-family: var(--font-family-primary);
  font-size: 0.9rem;
  color: var(--color-text-muted);
  letter-spacing: 2px;
  margin-bottom: var(--spacing-xs);
  font-weight: 600;
}

.value {
  font-family: var(--font-family-heading);
  font-size: 3.5rem;
  line-height: 1;
  color: white;
}

.value.positive {
  color: var(--color-accent-primary);
}

.value.negative {
  color: var(--color-accent-secondary);
}

.ranking-badge {
  margin-top: var(--spacing-lg);
  background: var(--color-accent-primary);
  color: black;
  padding: var(--spacing-md) var(--spacing-xl);
  transform: skew(-10deg);
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 0 20px rgba(204, 255, 0, 0.4);
}

.ranking-badge > * {
  transform: skew(10deg); /* Counter-skew text */
}

.rank-label {
  font-family: var(--font-family-primary);
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 2px;
}

.rank-value {
  font-family: var(--font-family-heading);
  font-size: 4rem;
  line-height: 0.9;
  font-weight: 700;
}

.rank-desc {
  font-family: var(--font-family-heading);
  font-size: 1.5rem;
  text-transform: uppercase;
  opacity: 0.8;
}

/* Animations */
.slam-in {
  animation: slamIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  opacity: 0;
  transform: scale(2);
}

@keyframes slamIn {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {

  
  .comparison-grid {
    gap: var(--spacing-md);
    padding: 0 var(--spacing-md);
  }
  
  .value {
    font-size: 2.5rem;
  }
  
  .story-line {
    font-size: 2.5rem;
  }
}
</style>
