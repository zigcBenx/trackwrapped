<template>
  <div class="leaderboard stadium-leaderboard">
    <div class="title-container">
      <h2 class="leaderboard-title animate-glitch">🏟️ BEST STADIUMS</h2>
      <p class="leaderboard-description">Highest average performance scores.</p>
      <div class="title-underline"></div>
    </div>
    
    <div v-if="isLoading" class="leaderboard-loading">
      <div class="scanner"></div>
      ANALYZING VENUES...
    </div>
    
    <div v-else-if="stadiums.length === 0" class="leaderboard-empty">
      NO STADIUM DATA AVAILABLE.
    </div>
    
    <div v-else class="leaderboard-list">
      <div
        v-for="(stadium, index) in stadiums"
        :key="stadium.venue"
        class="leaderboard-item"
        :class="[
          { 'top-1': index === 0, 'top-2': index === 1, 'top-3': index === 2 },
          index % 2 === 0 ? 'race-in-right' : 'race-in-left'
        ]"
        :style="{ animationDelay: `${index * 100}ms` }"
      >
        <div class="rank-section">
          <div class="rank-badge">{{ index + 1 }}</div>
          <div class="stadium-icon">🏟️</div>
        </div>
        <div class="stadium-info">
          <div class="stadium-name-row">
            <span class="stadium-name">{{ stadium.city }}</span>
            <span class="country-flag" v-if="stadium.country">{{ getCountryFlag(stadium.country) }}</span>
          </div>
          <div class="stadium-stats">
            <span class="stat-value highlight">{{ stadium.avgScore }}</span>
            <span class="stat-label">AVG SCORE</span>
            <span class="separator">/</span>
            <span class="stat-value">{{ stadium.resultCount }}</span>
            <span class="stat-label">RESULTS</span>
          </div>
        </div>
        <div class="item-glitch"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCountryFlag } from '@/utils/countryFlags'

interface StadiumData {
  venue: string
  city: string
  country: string
  avgScore: number
  resultCount: number
}

const stadiums = ref<StadiumData[]>([])
const isLoading = ref(true)

onMounted(async () => {
  isLoading.value = true
  try {
    const response = await fetch('/data/stadium_stats_2025.json')
    console.log('Stadium leaderboard fetch response:', response.status, response.ok)
    if (response.ok) {
      const data = await response.json()
      console.log('Stadium data loaded:', data)
      stadiums.value = data
    } else {
      console.error('Failed to fetch stadium data:', response.status)
    }
  } catch (error) {
    console.error('Error loading stadium leaderboard:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.leaderboard {
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-top: 3px solid var(--color-accent-primary);
  position: relative;
  overflow: hidden;
}

@media (min-width: 768px) {
  .leaderboard {
    padding: var(--spacing-lg);
  }
}

.title-container {
  text-align: center;
  margin-bottom: var(--spacing-xl);
  position: relative;
  z-index: 2;
}

.leaderboard-title {
  font-family: var(--font-family-heading);
  font-size: clamp(1.5rem, 6vw, 2.5rem);
  color: white;
  margin: 0;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-style: italic;
  font-weight: 900;
  text-shadow: 2px 2px 0px var(--color-accent-secondary);
}

.leaderboard-description {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 4px 0 0 0;
  font-family: var(--font-family-base);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-weight: 500;
}

@media (min-width: 768px) {
  .leaderboard-description {
    font-size: 1rem;
    margin-top: 8px;
  }
}

.title-underline {
  width: 40px;
  height: 3px;
  background: var(--color-accent-primary);
  margin: var(--spacing-sm) auto 0;
  box-shadow: 0 0 10px var(--color-accent-primary);
}

.leaderboard-loading,
.leaderboard-empty {
  text-align: center;
  padding: var(--spacing-3xl);
  color: rgba(255, 255, 255, 0.4);
  font-family: var(--font-family-heading);
  font-size: 0.9rem;
  letter-spacing: 2px;
}

.scanner {
  width: 40px;
  height: 40px;
  border: 2px solid var(--color-accent-primary);
  border-radius: 50%;
  margin: 0 auto var(--spacing-md);
  animation: scan 1.5s ease-in-out infinite;
}

@keyframes scan {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.5; }
}

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.leaderboard-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  text-align: left;
  width: 100%;
}

.leaderboard-item.top-1 {
  border-color: #FFD700;
  background: rgba(255, 215, 0, 0.05);
}

.leaderboard-item.top-2 {
  border-color: #C0C0C0;
  background: rgba(192, 192, 192, 0.05);
}

.leaderboard-item.top-3 {
  border-color: #CD7F32;
  background: rgba(205, 127, 50, 0.05);
}

.rank-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-shrink: 0;
}

.rank-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.1);
  font-family: var(--font-family-heading);
  font-weight: 800;
  font-size: 1rem;
  color: white;
  flex-shrink: 0;
}

.stadium-icon {
  font-size: 2rem;
  line-height: 1;
  flex-shrink: 0;
}

.stadium-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stadium-name-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  min-width: 0;
}

.stadium-name {
  font-family: var(--font-family-heading);
  font-size: clamp(0.9rem, 3vw, 1.1rem);
  color: white;
  font-weight: 700;
  text-transform: uppercase;
  line-height: 1.1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
}

.country-flag {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.stadium-stats {
  display: flex;
  align-items: baseline;
  gap: 4px;
  flex-wrap: wrap;
}

.stat-value {
  font-family: var(--font-family-heading);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-accent-tertiary);
}

.stat-value.highlight {
  color: var(--color-accent-primary);
  font-size: 1.4rem;
}

.stat-label {
  font-size: 0.6rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.5px;
}

.separator {
  color: rgba(255, 255, 255, 0.3);
  margin: 0 4px;
}

.item-glitch {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, var(--color-accent-primary), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

@keyframes race-in-right {
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes race-in-left {
  from {
    opacity: 0;
    transform: translateX(-100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.race-in-right {
  animation: race-in-right 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.race-in-left {
  animation: race-in-left 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@media (max-width: 768px) {
  .leaderboard-item {
    gap: var(--spacing-xs);
  }
  
  .stadium-icon {
    font-size: 1.5rem;
  }
}
</style>
