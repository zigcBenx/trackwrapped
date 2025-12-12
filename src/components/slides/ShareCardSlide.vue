<template>
  <SlideWrapper
    background="#000000"
    type="share-card"
  >
    <div class="bento-container" @click="handleTap">
      <!-- Header -->
      <div class="bento-header">
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
            <div class="name-row">
              <span class="real-name">{{ firstName }} {{ lastName }}</span>
              <span class="country-flag" v-if="country">{{ countryFlag }}</span>
            </div>
            <div class="nickname">@{{ nickname.toLowerCase().replace(/\s+/g, '') }}</div>
            <div class="main-event">{{ mainDiscipline }}</div>
          </div>
        </div>
      </div>

      <!-- Heatmap Card -->
      <div class="bento-card heatmap-card">
        <CompetitionHeatmap 
          :weeks="heatmapData.weeks"
          :year="heatmapData.year"
          class="mini-heatmap"
        />
        <div class="heatmap-footer">{{ totalCompetitions }} competitions in 2025</div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <!-- Victory Rate -->
        <div class="bento-card stat-card">
          <div class="card-icon">🏆</div>
          <div class="card-label">Victory Rate</div>
          <div class="card-value gold">{{ victoryRate }}%</div>
        </div>

        <!-- Average Points This Season -->
        <div class="bento-card stat-card">
          <div class="card-icon">⚡</div>
          <div class="card-label">Avg Points</div>
          <div class="card-value cyan">{{ currentSeasonAvgScore }}</div>
        </div>

        <!-- Total Competitions -->
        <div class="bento-card stat-card">
          <div class="card-icon">🏃</div>
          <div class="card-label">Total Races</div>
          <div class="card-value pink">{{ totalCompetitions }}</div>
        </div>

        <!-- Most Active Month -->
        <div class="bento-card stat-card">
          <div class="card-icon">📅</div>
          <div class="card-label">Peak Month</div>
          <div class="card-value purple">{{ peakMonth }}</div>
        </div>

        <!-- Season Best -->
        <div class="bento-card stat-card">
          <div class="card-icon">🌟</div>
          <div class="card-label">Season Best</div>
          <div class="card-value yellow">{{ seasonBest }}</div>
        </div>

        <!-- Power Level -->
        <div class="bento-card stat-card power-level-card" @click.stop="toggleTooltip" :class="{ 'tooltip-active': showTooltip }">
          <div class="card-icon">🦾</div>
          <div class="card-label">Power Level</div>
          <div class="card-value orange">{{ powerLevel }}</div>
          <Transition name="tooltip-fade">
            <div v-if="showTooltip" class="power-tooltip">
              <div class="tooltip-header">Power Level Thresholds</div>
              <div
                v-for="tier in powerLevelTooltip"
                :key="tier.label"
                class="tooltip-tier"
                :class="{ 'current-tier': tier.label === powerLevel }"
              >
                <div class="tier-label">{{ tier.label }}</div>
                <div class="tier-info">
                  <span class="tier-threshold">{{ tier.threshold }}</span>
                  <span v-if="tier.percentile" class="tier-percentile">{{ tier.percentile }}</span>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Share CTA -->
      <div class="share-cta">
        <div class="cta-icon">📸</div>
        <div class="cta-text">Screenshot & Share</div>
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
const showTooltip = ref(false)

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
    'SLO': 'SI', // Slovenia
    'GER': 'DE', // Germany
    'USA': 'US', // United States
    'GBR': 'GB', // Great Britain
    'NED': 'NL', // Netherlands
    'SUI': 'CH', // Switzerland
    'CRO': 'HR', // Croatia
    'BEL': 'BE', // Belgium
    'AUT': 'AT', // Austria
    'CZE': 'CZ', // Czech Republic
    'POL': 'PL', // Poland
    'ITA': 'IT', // Italy
    'FRA': 'FR', // France
    'ESP': 'ES', // Spain
    'POR': 'PT', // Portugal
    'SWE': 'SE', // Sweden
    'NOR': 'NO', // Norway
    'DEN': 'DK', // Denmark
    'FIN': 'FI', // Finland
    'GRE': 'GR', // Greece
    'TUR': 'TR', // Turkey
    'RUS': 'RU', // Russia
    'UKR': 'UA', // Ukraine
    'BUL': 'BG', // Bulgaria
    'ROM': 'RO', // Romania
    'HUN': 'HU', // Hungary
    'SVK': 'SK', // Slovakia
    'SRB': 'RS', // Serbia
    'CAN': 'CA', // Canada
    'AUS': 'AU', // Australia
    'NZL': 'NZ', // New Zealand
    'JPN': 'JP', // Japan
    'CHN': 'CN', // China
    'KOR': 'KR', // South Korea
    'IND': 'IN', // India
    'BRA': 'BR', // Brazil
    'ARG': 'AR', // Argentina
    'MEX': 'MX', // Mexico
    'RSA': 'ZA', // South Africa
    'KEN': 'KE', // Kenya
    'ETH': 'ET', // Ethiopia
    'JAM': 'JM', // Jamaica
  }

  const isoCode = countryMap[props.country.toUpperCase()] || props.country.substring(0, 2)

  // Convert to flag emoji
  const codePoints = isoCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0))

  return String.fromCodePoint(...codePoints)
})

const longestStreak = computed(() => {
  let maxStreak = 0
  let currentStreak = 0
  
  // Sort weeks by week number to be safe
  const sortedWeeks = [...props.heatmapData.weeks].sort((a, b) => a.week - b.week)
  
  // Create a map of weeks present
  const weekMap = new Set(sortedWeeks.map(w => w.week))
  const minWeek = Math.min(...Array.from(weekMap))
  const maxWeek = Math.max(...Array.from(weekMap))
  
  for (let i = minWeek; i <= maxWeek; i++) {
    if (weekMap.has(i)) {
      currentStreak++
    } else {
      maxStreak = Math.max(maxStreak, currentStreak)
      currentStreak = 0
    }
  }
  maxStreak = Math.max(maxStreak, currentStreak)
  
  return maxStreak || 1 // At least 1 if they have any competitions
})

const peakMonth = computed(() => {
  if (!props.seasonResults || props.seasonResults.length === 0) {
    // Fallback to most active month if no results
    const monthCounts = new Array(12).fill(0)
    props.heatmapData.weeks.forEach(w => {
      const monthIndex = Math.min(Math.floor((w.week - 1) / 4.33), 11)
      monthCounts[monthIndex] += w.count
    })
    const maxIndex = monthCounts.indexOf(Math.max(...monthCounts))
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return months[maxIndex]
  }

  // Find month with best result by points
  let bestResult = props.seasonResults[0]
  for (const result of props.seasonResults) {
    if (result.resultScore > bestResult.resultScore) {
      bestResult = result
    }
  }

  const date = new Date(bestResult.date)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return months[date.getMonth()]
})

const powerLevel = computed(() => {
  return props.percentileRank?.label || 'Rookie'
})

const powerLevelTooltip = computed(() => {
  const thresholds = [
    { label: 'World Class Elite', threshold: '≥1200 pts', percentile: 'Top 0.1%' },
    { label: 'Elite International', threshold: '≥1150 pts', percentile: 'Top 1%' },
    { label: 'National Elite', threshold: '≥1200 pts', percentile: 'Top 5%' },
    { label: 'Advanced Competitive', threshold: '≥1100 pts', percentile: 'Top 10%' },
    { label: 'Competitive', threshold: '≥1000 pts', percentile: 'Top 15%' },
    { label: 'Club Level', threshold: '≥900 pts', percentile: 'Top 20%' },
    { label: 'Recreational', threshold: '≥800 pts', percentile: 'Top 50%' },
    { label: 'Developing', threshold: '<600 pts', percentile: '' }
  ]

  return thresholds
})

function toggleTooltip() {
  showTooltip.value = !showTooltip.value
}

function handleTap(event: Event) {
  // Close tooltip if open when tapping elsewhere on the container
  const target = event.target as HTMLElement
  if (showTooltip.value && !target.closest('.power-level-card')) {
    showTooltip.value = false
  }
}
</script>

<style scoped>
.bento-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  padding-top: var(--spacing-2xl); /* Add space for progress bars */
  color: white;
  font-family: 'Inter', sans-serif;
  box-sizing: border-box;
}

.bento-header {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-xs);
  padding: var(--spacing-sm);
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  flex-shrink: 0;
}

.user-badge {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  width: 100%;
}

.avatar {
  width: 48px; /* Slightly smaller */
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  flex-shrink: 0;
  overflow: hidden;
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0; /* Allow truncation */
}

.name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.real-name {
  font-weight: 700;
  font-size: 1rem;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.country-flag {
  font-size: 1.2rem;
  line-height: 1;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
}

.nickname {
  font-size: 0.85rem;
  color: #a1a1aa;
}

.main-event {
  font-size: 0.75rem;
  color: #00ff9d;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 2px;
}

/* Cards */
.bento-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: var(--spacing-sm);
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(10px);
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.bento-card:hover {
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.heatmap-card {
  padding: var(--spacing-sm);
  align-items: center;
  flex-shrink: 0;
}

.mini-heatmap {
  width: 100%;
  margin-bottom: 4px;
}

.heatmap-footer {
  font-size: 0.75rem;
  color: #71717a;
  align-self: center;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-sm);
  flex: 1;
  min-height: 0; /* Allow shrinking */
}

.stat-card {
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: visible;
  text-align: center;
  padding: var(--spacing-xs);
}

.card-icon {
  font-size: 1.25rem;
  margin-bottom: 2px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

.card-label {
  font-size: 0.65rem;
  color: #a1a1aa;
  margin-bottom: 2px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-value {
  font-size: 1.2rem;
  font-weight: 800;
  line-height: 1.1;
}

/* Colors */
.gold { color: #fbbf24; text-shadow: 0 0 10px rgba(251, 191, 36, 0.3); }
.cyan { color: #22d3ee; text-shadow: 0 0 10px rgba(34, 211, 238, 0.3); }
.pink { color: #f472b6; text-shadow: 0 0 10px rgba(244, 114, 182, 0.3); }
.purple { color: #c084fc; text-shadow: 0 0 10px rgba(192, 132, 252, 0.3); }
.yellow { color: #facc15; text-shadow: 0 0 10px rgba(250, 204, 21, 0.3); }
.orange { color: #fb923c; text-shadow: 0 0 10px rgba(251, 146, 60, 0.3); }

/* Footer */
.bento-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: auto; /* Push to bottom */
  padding-top: var(--spacing-xs);
  padding-bottom: var(--spacing-md); /* Add bottom padding to clear slide branding */
  flex-shrink: 0;
}

.branding {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 1px;
  text-transform: uppercase;
}

/* Responsive */
@media (max-width: 400px) {
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
  .card-value { font-size: 1.1rem; }
}

/* Heatmap Overrides */
:deep(.competition-heatmap) {
  max-width: 100%;
}

:deep(.heatmap-grid) {
  grid-template-columns: repeat(13, 1fr) !important; /* 4 rows for 52 weeks */
  padding: 6px !important;
  gap: 3px !important;
  background: transparent;
}

:deep(.heatmap-cell) {
  border-radius: 2px !important;
  min-width: 6px !important;
  min-height: 6px !important;
  max-width: 100% !important;
}

/* Heatmap Visibility Overrides */
:deep(.intensity-0) {
  background: rgba(255, 255, 255, 0.1);
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

:deep(.year-label), :deep(.heatmap-legend) {
  display: none;
}

/* Power Level Tooltip */
.power-level-card {
  position: relative;
  cursor: pointer;
  user-select: none;
}

.power-level-card::before {
  content: 'ℹ️';
  position: absolute;
  top: 4px;
  right: 4px;
  font-size: 0.8rem;
  opacity: 0.6;
}

.power-level-card.tooltip-active {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.06);
}

.power-tooltip {
  position: absolute;
  bottom: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 12px;
  font-size: 0.7rem;
  color: white;
  min-width: 280px;
  max-width: 320px;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
  pointer-events: auto;
}

.power-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: rgba(0, 0, 0, 0.95);
}

.tooltip-header {
  font-family: 'Outfit', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tooltip-tier {
  padding: 6px 8px;
  margin-bottom: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.03);
}

.tooltip-tier:last-child {
  margin-bottom: 0;
}

.tooltip-tier.current-tier {
  background: rgba(251, 146, 60, 0.15);
  border: 1px solid rgba(251, 146, 60, 0.4);
}

.tier-label {
  font-family: 'Outfit', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  color: white;
  margin-bottom: 2px;
}

.tooltip-tier.current-tier .tier-label {
  color: #fb923c;
}

.tier-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.tier-threshold {
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.7);
}

.tier-percentile {
  font-family: 'Inter', sans-serif;
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.5);
}

.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(5px);
}

/* Share CTA */
.share-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-md);
  margin-top: var(--spacing-sm);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  animation: pulse-glow 2s ease-in-out infinite;
}

.cta-icon {
  font-size: 1rem;
}

.cta-text {
  font-family: 'Outfit', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.15);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.25);
  }
}

@media (max-width: 768px) {
  .share-cta {
    padding: var(--spacing-xs);
    margin-top: var(--spacing-xs);
  }

  .cta-text {
    font-size: 0.7rem;
  }

  .cta-icon {
    font-size: 0.9rem;
  }
}
</style>
