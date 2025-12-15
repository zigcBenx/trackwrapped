<template>
  <SlideWrapper
    background="#000000"
    type="share-card"
  >
    <div class="poster-container" @click="handleTap" @touchend.stop="handleTap">
      <!-- Decorative Elements -->
      <div class="corner-accents"></div>
      
      <!-- Header -->
      <div class="poster-header">
        <div class="user-badge">
          <div class="avatar">
            <img 
              v-if="profileImage && !imageError" 
              :src="profileImage" 
              alt="Profile" 
              class="profile-image"
              @error="handleImageError"
            />
            <span v-else>{{ initials }}</span>
          </div>
          <div class="user-info">
            <h1 class="real-name">{{ firstName }} {{ lastName }}</h1>
            <div class="meta-row">
              <span class="country-flag" v-if="country">{{ countryFlag }}</span>
              <span class="nickname">@{{ nickname.toLowerCase().replace(/\s+/g, '') }}</span>
            </div>
          </div>
        </div>
        <div class="wrapped-badge-mini">2025</div>
      </div>

      <!-- Main Stats Section -->
      <div class="stats-poster-grid">
        <!-- Victory Rate (Featured) -->
        <div class="poster-stat featured">
          <div class="stat-label">VICTORY RATE</div>
          <div class="stat-value neon-gold">{{ victoryRate }}%</div>
        </div>

        <!-- Season Best -->
        <div class="poster-stat">
          <div class="stat-label">SEASON BEST</div>
          <div class="stat-value neon-cyan">{{ seasonBest }}</div>
        </div>

        <!-- Total Races -->
        <div class="poster-stat">
          <div class="stat-label">RACES</div>
          <div class="stat-value neon-pink">{{ totalCompetitions }}</div>
        </div>

        <!-- Avg Points -->
        <div class="poster-stat">
          <div class="stat-label">AVG POINTS</div>
          <div class="stat-value neon-purple">{{ currentSeasonAvgScore }}</div>
        </div>
      </div>

      <!-- Heatmap Strip -->
      <div class="heatmap-strip">
        <div class="strip-label">ACTIVITY</div>
        <CompetitionHeatmap 
          :weeks="heatmapData.weeks"
          :year="heatmapData.year"
          class="mini-heatmap"
        />
      </div>

      <!-- Power Level Footer -->
      <div class="power-footer">
        <div class="power-label">POWER LEVEL</div>
        <div class="power-value neon-orange">{{ powerLevel }}</div>
      </div>

      <!-- Share CTA -->
      <div class="share-cta">
        <div class="cta-text">SHARE YOUR STORY</div>
      </div>
    </div>
  </SlideWrapper>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
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
  victoryRate: number
  athleteId?: number | null
  currentSeasonAvgScore: number
  percentileRank: { rank: string; label: string }
  seasonResults?: any[]
}

const props = defineProps<Props>()

const imageError = ref(false)

const profileImage = computed(() => {
  if (!props.athleteId) return null
  return `https://media.aws.iaaf.org/athletes/${props.athleteId}.jpg`
})

function handleImageError() {
  imageError.value = true
}

const initials = computed(() => {
  const f = props.firstName?.charAt(0) || ''
  const l = props.lastName?.charAt(0) || ''
  return (f + l).toUpperCase()
})

const countryFlag = computed(() => {
  if (!props.country || props.country.length !== 3) return props.country

  // Convert 3-letter country code to 2-letter ISO code for flag emoji
  const countryMap: Record<string, string> = {
    'SLO': 'SI', 'GER': 'DE', 'USA': 'US', 'GBR': 'GB', 'NED': 'NL',
    'SUI': 'CH', 'CRO': 'HR', 'BEL': 'BE', 'AUT': 'AT', 'CZE': 'CZ',
    'POL': 'PL', 'ITA': 'IT', 'FRA': 'FR', 'ESP': 'ES', 'POR': 'PT',
    'SWE': 'SE', 'NOR': 'NO', 'DEN': 'DK', 'FIN': 'FI', 'GRE': 'GR',
    'TUR': 'TR', 'RUS': 'RU', 'UKR': 'UA', 'BUL': 'BG', 'ROM': 'RO',
    'HUN': 'HU', 'SVK': 'SK', 'SRB': 'RS', 'CAN': 'CA', 'AUS': 'AU',
    'NZL': 'NZ', 'JPN': 'JP', 'CHN': 'CN', 'KOR': 'KR', 'IND': 'IN',
    'BRA': 'BR', 'ARG': 'AR', 'MEX': 'MX', 'RSA': 'ZA', 'KEN': 'KE',
    'ETH': 'ET', 'JAM': 'JM',
  }

  const isoCode = countryMap[props.country.toUpperCase()] || props.country.substring(0, 2)

  const codePoints = isoCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0))

  return String.fromCodePoint(...codePoints)
})

const powerLevel = computed(() => {
  return props.percentileRank?.label || 'Rookie'
})

function handleTap(event: Event) {
  // Placeholder for tap handler
}
</script>

<style scoped>
.poster-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: var(--spacing-md);
  padding-top: var(--spacing-2xl);
  color: white;
  box-sizing: border-box;
  background: #000;
  border: 4px solid white;
  position: relative;
}

.corner-accents::before,
.corner-accents::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  background: var(--color-accent-primary);
  z-index: 10;
}

.corner-accents::before {
  top: 0;
  left: 0;
}

.corner-accents::after {
  bottom: 0;
  right: 0;
}

.poster-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-lg);
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  padding-bottom: var(--spacing-md);
}

.user-badge {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.avatar {
  width: 64px;
  height: 64px;
  background: var(--color-accent-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.5rem;
  border: 2px solid white;
  overflow: hidden;
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(100%) contrast(1.2);
}

.user-info {
  display: flex;
  flex-direction: column;
}

.real-name {
  font-family: var(--font-family-heading);
  font-size: 2.5rem;
  line-height: 0.9;
  margin: 0;
  text-transform: uppercase;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.country-flag {
  font-size: 1.2rem;
}

.nickname {
  font-family: var(--font-family-primary);
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.wrapped-badge-mini {
  background: white;
  color: black;
  font-family: var(--font-family-heading);
  font-size: 1.2rem;
  padding: 2px 8px;
  font-weight: 700;
  transform: rotate(5deg);
}

.stats-poster-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.poster-stat {
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: var(--spacing-sm);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.poster-stat.featured {
  grid-column: span 2;
  background: rgba(255, 255, 255, 0.05);
  border-color: white;
}

.stat-label {
  font-family: var(--font-family-primary);
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  letter-spacing: 2px;
  margin-bottom: 4px;
  font-weight: 700;
}

.stat-value {
  font-family: var(--font-family-heading);
  font-size: 3rem;
  line-height: 0.9;
}

.poster-stat.featured .stat-value {
  font-size: 5rem;
}

.neon-gold { color: var(--color-accent-primary); text-shadow: 0 0 10px rgba(204, 255, 0, 0.3); }
.neon-cyan { color: var(--color-accent-tertiary); text-shadow: 0 0 10px rgba(0, 240, 255, 0.3); }
.neon-pink { color: var(--color-accent-secondary); text-shadow: 0 0 10px rgba(255, 0, 85, 0.3); }
.neon-purple { color: #c084fc; }
.neon-orange { color: #fb923c; }

.heatmap-strip {
  margin-bottom: var(--spacing-lg);
}

.strip-label {
  font-family: var(--font-family-heading);
  font-size: 1.2rem;
  margin-bottom: var(--spacing-xs);
  color: white;
}

.mini-heatmap {
  width: 100%;
  filter: grayscale(100%) contrast(1.5) brightness(1.2);
}

.power-footer {
  margin-top: auto;
  border-top: 4px solid white;
  padding-top: var(--spacing-md);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.power-label {
  font-family: var(--font-family-heading);
  font-size: 1.5rem;
  line-height: 1;
  color: var(--color-text-secondary);
}

.power-value {
  font-family: var(--font-family-heading);
  font-size: 3.5rem;
  line-height: 0.85;
  text-transform: uppercase;
  word-break: break-word;
  max-width: 100%;
}

.share-cta {
  margin-top: var(--spacing-md);
  background: white;
  color: black;
  text-align: center;
  padding: var(--spacing-sm);
  font-family: var(--font-family-heading);
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 2px;
  cursor: pointer;
}

@media (max-width: 400px) {
  .real-name { font-size: 2rem; }
  .poster-stat.featured .stat-value { font-size: 4rem; }
  .stat-value { font-size: 2.5rem; }
}

/* Heatmap Overrides */
:deep(.competition-heatmap) {
  max-width: 100%;
}

:deep(.heatmap-grid) {
  gap: 2px !important;
}

:deep(.heatmap-cell) {
  border-radius: 0 !important; /* Square pixels */
}
</style>
