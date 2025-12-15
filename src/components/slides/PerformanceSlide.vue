<template>
  <SlideWrapper 
    background="linear-gradient(135deg, #10b981 0%, #22d3ee 100%)"
    type="performance"
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
      <div class="slide-emoji fade-in-up" style="animation-delay: 0ms">📊</div>
      <h1 class="slide-title fade-in-up" style="animation-delay: 100ms">Performance Analysis</h1>

      <!-- Score Comparison -->
      <div class="stats-grid fade-in-up" style="animation-delay: 200ms">
        <div class="stat-card">
          <div class="stat-value">{{ stats.currentSeasonAvgScore }}</div>
          <div class="stat-label">This Season Avg</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.lastSeasonAvgScore || '--' }}</div>
          <div class="stat-label">Last Season Avg</div>
        </div>
      </div>

      <!-- Change Indicator -->
      <div v-if="stats.lastSeasonAvgScore > 0" class="change-indicator fade-in-up" style="animation-delay: 350ms">
        <div class="change-arrow" :class="{ positive: stats.scoreChangePercent > 0, negative: stats.scoreChangePercent < 0 }">
          {{ stats.scoreChangePercent > 0 ? '↑' : stats.scoreChangePercent < 0 ? '↓' : '→' }}
        </div>
        <div class="change-value" :class="{ positive: stats.scoreChangePercent > 0, negative: stats.scoreChangePercent < 0 }">
          {{ Math.abs(stats.scoreChangePercent) }}%
        </div>
      </div>

      <!-- Percentile Ranking -->
      <div class="percentile-section fade-in-up" style="animation-delay: 500ms">
        <div class="percentile-badge">
          <div class="percentile-rank">Top {{ stats.percentileRank.rank }}</div>
          <div class="percentile-label">{{ stats.percentileRank.label }}</div>
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
  padding: 0 var(--spacing-xl);
  gap: var(--spacing-lg);
}

.slide-emoji {
  font-size: 5rem;
  margin-bottom: var(--spacing-sm);
  filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.3));
}

.slide-title {
  font-family: 'Inter', sans-serif;
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: var(--spacing-sm);
  font-weight: 600;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  width: 100%;
  max-width: 450px;
  margin-bottom: 0;
}

.stat-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1.5px solid rgba(255, 255, 255, 0.25);
  border-radius: 20px;
  padding: var(--spacing-lg) var(--spacing-md);
  text-align: center;
  transition: transform 0.3s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-value {
  font-family: 'Bebas Neue', 'Arial Black', sans-serif; font-weight: 900;
  font-size: 3.5rem;
  color: white;
  text-shadow: 0 2px 12px rgba(255, 255, 255, 0.4);
  line-height: 1;
  margin-bottom: var(--spacing-xs);
}

.stat-label {
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.75);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 600;
  line-height: 1.3;
}

.change-indicator {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: rgba(255, 255, 255, 0.1);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: 50px;
  margin: 0;
}

.change-arrow {
  font-size: 2rem;
  font-weight: bold;
  line-height: 1;
}

.change-arrow.positive {
  color: #089c63;
}

.change-arrow.negative {
  color: #ff6b6b;
}

.change-value {
  font-family: 'Bebas Neue', 'Arial Black', sans-serif; font-weight: 900;
  font-size: 1.5rem;
  font-weight: bold;
}

.change-value.positive {
  color: #089c63;
}

.change-value.negative {
  color: #ff6b6b;
}

.percentile-section {
  width: 100%;
  max-width: 450px;
  margin-top: 0;
}

.percentile-badge {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-radius: 24px;
  padding: var(--spacing-lg) var(--spacing-xl);
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.percentile-rank {
  font-family: 'Bebas Neue', 'Arial Black', sans-serif; font-weight: 900;
  font-size: 4rem;
  color: white;
  text-shadow: 0 2px 20px rgba(255, 255, 255, 0.6);
  line-height: 1;
  margin-bottom: var(--spacing-xs);
}

.percentile-label {
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  color: #089c63;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
}

@media (max-width: 768px) {
  .story-line {
    font-size: 1.8rem;
  }

  .reveal-container {
    padding: 0 var(--spacing-md);
    gap: var(--spacing-md);
  }

  .slide-emoji {
    font-size: 4rem;
  }

  .stats-grid {
    gap: var(--spacing-sm);
    max-width: 100%;
  }

  .stat-card {
    padding: var(--spacing-md);
  }

  .stat-value {
    font-size: 2.5rem;
  }

  .stat-label {
    font-size: 0.7rem;
  }

  .change-arrow {
    font-size: 1.5rem;
  }

  .change-value {
    font-size: 1.2rem;
  }

  .percentile-rank {
    font-size: 3rem;
  }

  .percentile-label {
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .slide-title {
    font-size: 1rem;
    letter-spacing: 2px;
  }

  .slide-emoji {
    font-size: 3.5rem;
  }

  .stat-value {
    font-size: 2.2rem;
  }

  .stat-label {
    font-size: 0.65rem;
  }

  .percentile-rank {
    font-size: 2.5rem;
  }

  .percentile-label {
    font-size: 0.85rem;
  }

  .change-arrow {
    font-size: 1.3rem;
  }

  .change-value {
    font-size: 1rem;
  }
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
