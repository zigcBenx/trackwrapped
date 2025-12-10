<template>
  <SlideWrapper 
    background="linear-gradient(135deg, #2c3e50 0%, #000000 100%)"
    type="share-card"
    @click="handleTap"
  >
    <!-- Reveal Phase (Direct reveal for summary card) -->
    <div class="share-card-container">
      <!-- Header -->
      <div class="card-header">
        <div class="athlete-info">
          <h1 class="athlete-name">{{ firstName }} {{ lastName }}</h1>
          <div class="athlete-meta">
            <span class="country-flag" v-if="countryCode">{{ getFlagEmoji(countryCode) }}</span>
            <span class="country-name">{{ country }}</span>
          </div>
        </div>
        <div class="nickname-badge">{{ nickname }}</div>
      </div>

      <!-- Heatmap Section -->
      <div class="heatmap-section">
        <div class="section-label">2025 SEASON</div>
        <CompetitionHeatmap 
          :weeks="heatmapData.weeks"
          :year="heatmapData.year"
          class="mini-heatmap"
        />
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-label">RACES</div>
          <div class="stat-value">{{ totalCompetitions }}</div>
        </div>
        
        <div class="stat-item">
          <div class="stat-label">SEASON BEST</div>
          <div class="stat-value">{{ seasonBest }}</div>
          <div class="stat-sub">{{ mainDiscipline }}</div>
        </div>
        
        <div class="stat-item">
          <div class="stat-label">AVG WIND</div>
          <div class="stat-value">{{ averageWind ? (averageWind > 0 ? '+' : '') + averageWind.toFixed(1) : '-' }}</div>
          <div class="stat-sub">m/s</div>
        </div>
      </div>

      <!-- Footer / CTA -->
      <div class="card-footer">
        <div class="app-branding">
          <span class="logo-icon">🏃</span> trackwrapped.com
        </div>
        <div class="share-cta">
          Take a screenshot to share 📸
        </div>
      </div>
    </div>
  </SlideWrapper>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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
  firstName: string
  lastName: string
  country: string
  nickname: string
  heatmapData: HeatmapData
  totalCompetitions: number
  mainDiscipline: string
  seasonBest: string
  averageWind: number | null
}

const props = defineProps<Props>()

// Helper to get flag emoji from country code (if available)
// Assuming country might be full name or code. If full name, we might need a map.
// For now, let's try to extract code if it's in format "Country (CODE)" or just use name.
const countryCode = computed(() => {
  // Simple check if country string looks like a code (2-3 chars uppercase)
  if (props.country && props.country.length <= 3) return props.country
  return null
})

function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char =>  127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

function handleTap() {
  // No action needed, just prevents event bubbling if needed
}
</script>

<style scoped>
.share-card-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: var(--spacing-md);
  gap: var(--spacing-lg);
  justify-content: space-between;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: var(--spacing-md);
}

.athlete-name {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 3rem;
  line-height: 0.9;
  color: white;
  margin-bottom: var(--spacing-xs);
}

.athlete-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-family: 'Outfit', sans-serif;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.nickname-badge {
  background: linear-gradient(135deg, #00ff9d 0%, #00d4ff 100%);
  color: #000;
  font-family: 'Outfit', sans-serif;
  font-weight: 800;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  letter-spacing: 1px;
  box-shadow: 0 4px 10px rgba(0, 255, 157, 0.3);
  transform: rotate(2deg);
}

.heatmap-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
}

.section-label {
  font-family: 'Outfit', sans-serif;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: var(--spacing-sm);
}

/* Override heatmap styles for mini version */
:deep(.competition-heatmap) {
  max-width: 100%;
}
:deep(.heatmap-grid) {
  padding: 5px;
  gap: 2px;
  background: transparent;
}
:deep(.heatmap-cell) {
  border-radius: 1px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-label {
  font-family: 'Outfit', sans-serif;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: var(--spacing-xs);
  letter-spacing: 1px;
}

.stat-value {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2.5rem;
  color: white;
  line-height: 1;
}

.stat-sub {
  font-family: 'Outfit', sans-serif;
  font-size: 0.8rem;
  color: #00ff9d;
  margin-top: 2px;
}

.card-footer {
  margin-top: auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.app-branding {
  font-family: 'Outfit', sans-serif;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 2px;
  text-transform: uppercase;
  font-size: 0.9rem;
}

.share-cta {
  background: rgba(255, 255, 255, 0.1);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: 30px;
  font-family: 'Outfit', sans-serif;
  color: white;
  font-size: 0.9rem;
  align-self: center;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
}

@media (max-width: 768px) {
  .athlete-name { font-size: 2.5rem; }
  .stat-value { font-size: 2rem; }
}
</style>
