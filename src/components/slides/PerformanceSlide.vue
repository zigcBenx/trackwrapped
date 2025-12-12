<template>
  <SlideWrapper 
    background="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
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
      <div class="slide-emoji">📊</div>
      <h1 class="slide-title">Performance Analysis</h1>

      <!-- Score Comparison -->
      <div class="stats-grid">
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
      <div v-if="stats.lastSeasonAvgScore > 0" class="change-indicator">
        <div class="change-arrow" :class="{ positive: stats.scoreChangePercent > 0, negative: stats.scoreChangePercent < 0 }">
          {{ stats.scoreChangePercent > 0 ? '↑' : stats.scoreChangePercent < 0 ? '↓' : '→' }}
        </div>
        <div class="change-value" :class="{ positive: stats.scoreChangePercent > 0, negative: stats.scoreChangePercent < 0 }">
          {{ Math.abs(stats.scoreChangePercent) }}%
        </div>
      </div>

      <!-- Percentile Ranking -->
      <div class="percentile-section">
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
  padding: 0 var(--spacing-lg);
}

.slide-emoji {
  font-size: 4rem;
  margin-bottom: var(--spacing-md);
  filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.3));
}

.slide-title {
  font-family: 'Outfit', sans-serif;
  font-size: 1.3rem;
  text-transform: uppercase;
  letter-spacing: 4px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: var(--spacing-xl);
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  width: 100%;
  max-width: 500px;
  margin-bottom: var(--spacing-lg);
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: var(--spacing-lg);
  text-align: center;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-value {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 3rem;
  color: #00ff9d;
  text-shadow: 0 0 20px rgba(0, 255, 157, 0.5);
  line-height: 1;
  margin-bottom: var(--spacing-sm);
}

.stat-label {
  font-family: 'Outfit', sans-serif;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.change-indicator {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  background: rgba(255, 255, 255, 0.05);
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: 50px;
}

.change-arrow {
  font-size: 2.5rem;
  font-weight: bold;
  line-height: 1;
}

.change-arrow.positive {
  color: #00ff9d;
}

.change-arrow.negative {
  color: #ff6b6b;
}

.change-value {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2rem;
  font-weight: bold;
}

.change-value.positive {
  color: #00ff9d;
}

.change-value.negative {
  color: #ff6b6b;
}

.percentile-section {
  width: 100%;
  max-width: 500px;
  margin-top: var(--spacing-md);
}

.percentile-badge {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: var(--spacing-xl);
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.percentile-rank {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 3.5rem;
  color: white;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
  line-height: 1;
  margin-bottom: var(--spacing-sm);
}

.percentile-label {
  font-family: 'Outfit', sans-serif;
  font-size: 1.2rem;
  color: #00ff9d;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
}

@media (max-width: 768px) {
  .story-line {
    font-size: 1.8rem;
  }

  .stats-grid {
    gap: var(--spacing-md);
  }

  .stat-value {
    font-size: 2.5rem;
  }

  .stat-label {
    font-size: 0.8rem;
  }

  .change-arrow {
    font-size: 2rem;
  }

  .change-value {
    font-size: 1.5rem;
  }

  .percentile-rank {
    font-size: 2.5rem;
  }

  .percentile-label {
    font-size: 1rem;
  }
}
</style>
