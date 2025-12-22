<template>
  <div class="leaderboard consistency-leaderboard">
    <div class="title-container">
      <h2 class="leaderboard-title animate-glitch">🎯 MOST CONSISTENT</h2>
      <p class="leaderboard-description">Lowest performance variance in 2025.</p>
      <div class="title-underline"></div>
    </div>
    
    <div v-if="isLoading" class="leaderboard-loading">
      <div class="scanner"></div>
      ANALYZING CONSISTENCY...
    </div>
    
    <div v-else-if="athletes.length === 0" class="leaderboard-empty">
      NO CONSISTENCY DATA AVAILABLE.
    </div>
    
    <div v-else class="leaderboard-list">
      <button
        v-for="(athlete, index) in athletes"
        :key="athlete.id"
        class="leaderboard-item"
        :class="[
          { 'top-1': index === 0, 'top-2': index === 1, 'top-3': index === 2 },
          index % 2 === 0 ? 'race-in-right' : 'race-in-left'
        ]"
        :style="{ animationDelay: `${index * 100}ms` }"
        @click="handleAthleteClick(athlete)"
      >
        <div class="rank-section">
          <div class="rank-badge">{{ index + 1 }}</div>
          <div class="athlete-avatar">
            <img 
              v-if="getProfileImage(athlete.id) && !imageErrors[athlete.id]" 
              :src="getProfileImage(athlete.id) || undefined" 
              :alt="athlete.name"
              class="avatar-img"
              @error="handleImageError(athlete.id)"
            />
            <span v-else class="avatar-initials">{{ getInitials(athlete.name) }}</span>
          </div>
        </div>
        <div class="athlete-info">
          <div class="athlete-name-row">
            <span class="athlete-name">{{ athlete.name }}</span>
            <span class="country-flag" v-if="athlete.homeCountry">{{ getCountryFlag(athlete.homeCountry) }}</span>
          </div>
          <div class="athlete-stats">
            <span class="stat-value highlight">{{ athlete.variance }}</span>
            <span class="stat-label">VARIANCE</span>
          </div>
          <div class="consistency-details">
            Best: {{ athlete.seasonBest }} • Avg: {{ athlete.averageScore }}
          </div>
        </div>
        <div class="item-glitch"></div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import type { Athlete } from '@/types/athlete'
import { getCountryFlag } from '@/utils/countryFlags'

interface ConsistentAthlete {
  id: string
  name: string
  homeCountry: string
  seasonBest: number
  averageScore: number
  variance: number
  totalCompetitions: number
}

const athletes = ref<ConsistentAthlete[]>([])
const isLoading = ref(true)
const imageErrors = reactive<Record<string, boolean>>({})

const emit = defineEmits<{
  athleteSelect: [athlete: { id: number; firstname: string; lastname: string }]
}>()

onMounted(async () => {
  isLoading.value = true
  try {
    // Fetch from the generated JSON file
    const response = await fetch('/data/consistency_stats_2025.json')
    console.log('Consistency leaderboard fetch response:', response.status, response.ok)
    if (response.ok) {
      const data = await response.json()
      console.log('Consistency data loaded:', data)
      athletes.value = data.slice(0, 5) // Limit to top 5
    } else {
      console.error('Failed to fetch consistency data:', response.status)
    }
  } catch (error) {
    console.error('Error loading consistency leaderboard:', error)
  } finally {
    isLoading.value = false
  }
})

function handleAthleteClick(athlete: ConsistentAthlete) {
  const [firstname, ...lastnameParts] = athlete.name.split(' ')
  emit('athleteSelect', {
    id: Number(athlete.id),
    firstname: firstname || '',
    lastname: lastnameParts.join(' ')
  })
}

function getProfileImage(athleteId: string | number) {
  if (!athleteId) return null
  const originalUrl = `https://media.aws.iaaf.org/athletes/${athleteId}.jpg`
  return `/api/proxy-image?url=${encodeURIComponent(originalUrl)}`
}

function handleImageError(athleteId: string | number) {
  imageErrors[athleteId] = true
}

function getInitials(name: string) {
  const parts = name.split(' ')
  if (parts.length >= 2 && parts[0] && parts[parts.length - 1]) {
    return (parts[0].charAt(0) + parts[parts.length - 1]!.charAt(0)).toUpperCase()
  }
  return (name || '').substring(0, 2).toUpperCase()
}
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
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  text-align: left;
  width: 100%;
}

.leaderboard-item:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: var(--color-accent-primary);
  transform: translateX(4px);
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

.athlete-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background: var(--color-accent-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  font-family: var(--font-family-heading);
  font-weight: 700;
  font-size: 1rem;
  color: white;
}

.athlete-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.athlete-name-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  min-width: 0;
}

.athlete-name {
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

.athlete-stats {
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

.consistency-details {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  font-family: var(--font-family-base);
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

.leaderboard-item:hover .item-glitch {
  opacity: 0.1;
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
}
</style>
