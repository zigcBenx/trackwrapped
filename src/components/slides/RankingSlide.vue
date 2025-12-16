<template>
  <div class="slide-content ranking-slide">
    <h2 class="slide-title slide-in-left">WORLD STAGE</h2>
    
    <div class="ranking-container fade-in-up">
      <!-- Main Ranking Display -->
      <div v-if="bestRanking" class="main-ranking">
        <div class="rank-badge">
          <div class="wreath">🌿</div>
          <div class="rank-number">#{{ bestRanking.place }}</div>
          <div class="wreath right">🌿</div>
        </div>
        <div class="rank-label">
          <span class="discipline">{{ bestRanking.discipline }}</span>
          <span class="context">WORLD RANKING</span>
        </div>
      </div>
      
      <!-- Fallback if no ranking -->
      <div v-else class="no-ranking">
        <div class="icon">🌍</div>
        <div class="message">UNRANKED BUT DANGEROUS</div>
      </div>

      <!-- Secondary Stats / Context -->
      <div class="ranking-details" v-if="bestRanking">
        <div class="detail-item">
          <span class="detail-value">{{ bestRanking.score }}</span>
          <span class="detail-label">POINTS</span>
        </div>
        <div class="detail-divider"></div>
        <div class="detail-item">
          <span class="detail-value">TOP {{ topPercent }}%</span>
          <span class="detail-label">GLOBAL</span>
        </div>
      </div>
    </div>

    <div class="slide-footer fade-in-up" style="animation-delay: 500ms">
      <p class="footer-text">
        AMONG THE <span class="highlight">ELITE.</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Ranking {
  discipline: string
  place: number
  score: number
}

interface Props {
  rankings: any[] // Raw ranking data
  mainDiscipline: string
}

const props = defineProps<Props>()

const bestRanking = computed(() => {
  if (!props.rankings || props.rankings.length === 0) return null
  
  // Try to find ranking for main discipline first
  const main = props.rankings.find(r => r.discipline && r.discipline.toLowerCase() === props.mainDiscipline.toLowerCase())
  if (main) return main
  
  // Otherwise find best place (lowest number)
  return [...props.rankings].sort((a, b) => a.place - b.place)[0]
})

const topPercent = computed(() => {
  // Mock logic for percentile since we don't have total athlete count in ranking object usually
  // In a real app, this would come from backend
  if (!bestRanking.value) return 0
  
  const place = bestRanking.value.place
  if (place <= 10) return 1
  if (place <= 50) return 5
  if (place <= 100) return 10
  if (place <= 500) return 25
  return 50
})
</script>

<style scoped>
.ranking-slide {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: var(--spacing-lg);
}

.slide-title {
  font-family: var(--font-family-heading);
  font-size: 4rem;
  color: white;
  margin-bottom: var(--spacing-2xl);
  text-transform: uppercase;
  text-align: center;
  line-height: 0.9;
}

.ranking-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-2xl);
}

.main-ranking {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.rank-badge {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.wreath {
  font-size: 4rem;
  filter: drop-shadow(0 0 10px var(--color-accent-secondary));
  animation: pulse 2s infinite;
}

.wreath.right {
  transform: scaleX(-1);
}

.rank-number {
  font-family: var(--font-family-heading);
  font-size: 8rem;
  line-height: 0.8;
  color: var(--color-accent-primary);
  text-shadow: 0 0 30px rgba(204, 255, 0, 0.3);
  background: linear-gradient(180deg, #fff, var(--color-accent-primary));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.rank-label {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.discipline {
  font-family: var(--font-family-heading);
  font-size: 2rem;
  color: white;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.context {
  font-size: 1rem;
  color: var(--color-text-secondary);
  letter-spacing: 4px;
  font-weight: 700;
}

.no-ranking {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.no-ranking .icon {
  font-size: 5rem;
  filter: grayscale(1);
  opacity: 0.5;
}

.no-ranking .message {
  font-family: var(--font-family-heading);
  font-size: 2rem;
  color: var(--color-text-muted);
  text-align: center;
}

.ranking-details {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
  background: rgba(255, 255, 255, 0.05);
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.detail-value {
  font-family: var(--font-family-heading);
  font-size: 2.5rem;
  color: white;
  line-height: 1;
}

.detail-label {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  letter-spacing: 1px;
  margin-top: 4px;
}

.detail-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
}

.slide-footer {
  margin-top: auto;
  text-align: center;
}

.footer-text {
  font-size: 1.5rem;
  color: var(--color-text-secondary);
  font-family: var(--font-family-heading);
  letter-spacing: 2px;
}

.highlight {
  color: var(--color-accent-primary);
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
}
</style>
