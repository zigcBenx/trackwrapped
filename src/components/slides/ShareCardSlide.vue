<template>
  <SlideWrapper 
    background="#000000"
    type="share-card"
    @click="handleTap"
  >
    <div class="bento-container">
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
              <span class="country-tag" v-if="country">{{ country }}</span>
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

        <!-- Longest Streak -->
        <div class="bento-card stat-card">
          <div class="card-icon">⚡</div>
          <div class="card-label">Longest Streak</div>
          <div class="card-value cyan">{{ longestStreak }} wks</div>
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
        <div class="bento-card stat-card">
          <div class="card-icon">🦾</div>
          <div class="card-label">Power Level</div>
          <div class="card-value orange">{{ powerLevel }}</div>
        </div>
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
  const monthCounts = new Array(12).fill(0)
  
  props.heatmapData.weeks.forEach(w => {
    // Approx month: week / 4.33
    const monthIndex = Math.min(Math.floor((w.week - 1) / 4.33), 11)
    monthCounts[monthIndex] += w.count
  })
  
  const maxCount = Math.max(...monthCounts)
  const maxIndex = monthCounts.indexOf(maxCount)
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return months[maxIndex]
})

const powerLevel = computed(() => {
  if (props.totalCompetitions > 20) return 'Olympian'
  if (props.totalCompetitions > 10) return 'Elite'
  if (props.totalCompetitions > 5) return 'Pro'
  return 'Rookie'
})

function handleTap() {
  // No action
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

.country-tag {
  font-size: 0.7rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 1px 5px;
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.8);
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
  overflow: hidden;
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
  grid-template-columns: repeat(18, 1fr) !important; /* Force 3 rows (52/18 ~= 2.8) */
  padding: 10px !important;
  gap: 6px !important;
  background: transparent;
}

:deep(.heatmap-cell) {
  border-radius: 4px !important;
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
</style>
