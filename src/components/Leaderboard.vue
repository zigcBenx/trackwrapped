<template>
  <div class="leaderboard">
    <div class="title-container">
      <h2 class="leaderboard-title animate-glitch">🏆 MOST VIEWED</h2>
      <p class="leaderboard-description">Trending athletes in the spotlight.</p>
      <div class="title-underline"></div>
    </div>
    
    <div v-if="isLoading" class="leaderboard-loading">
      <div class="scanner"></div>
      LOADING DATA...
    </div>
    
    <div v-else-if="athleteDetails.length === 0" class="leaderboard-empty">
      NO VIEWS YET. BE THE FIRST TO EXPLORE!
    </div>
    
    <div v-else class="leaderboard-list">
      <button
        v-for="(athlete, index) in athleteDetails"
        :key="athlete.athleteId"
        class="leaderboard-item"
        :class="[
          { 'top-1': index === 0, 'top-2': index === 1, 'top-3': index === 2 },
          index % 2 === 0 ? 'race-in-left' : 'race-in-right'
        ]"
        :style="{ animationDelay: `${index * 100}ms` }"
        @click="handleAthleteClick(athlete)"
      >
        <div class="rank-section">
          <div class="rank-badge">{{ index + 1 }}</div>
          <div class="athlete-avatar">
            <img 
              v-if="getProfileImage(athlete.athleteId) && !imageErrors[athlete.athleteId]" 
              :src="getProfileImage(athlete.athleteId) || undefined" 
              :alt="athlete.firstname"
              class="avatar-img"
              @error="handleImageError(athlete.athleteId)"
            />
            <span v-else class="avatar-initials">{{ getInitials(athlete.firstname, athlete.lastname) }}</span>
          </div>
        </div>
        <div class="athlete-info">
          <div class="athlete-name-row">
            <span class="athlete-name">{{ athlete.firstname }} {{ athlete.lastname }}</span>
            <span class="country-flag" v-if="athlete.countryFlag">{{ athlete.countryFlag }}</span>
          </div>
          <div class="athlete-views">
            <span class="view-count">{{ athlete.views }}</span>
            <span class="view-label">VIEWS</span>
          </div>
        </div>
        <div class="item-glitch"></div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { getTopAthletes } from '@/services/viewTrackingService'
import { getCountryFlag } from '@/utils/countryFlags'
import type { TopAthlete } from '@/services/viewTrackingService'

interface AthleteWithDetails extends TopAthlete {
  firstname: string
  lastname: string
  country: string
  countryFlag: string
}

const athleteDetails = ref<AthleteWithDetails[]>([])
const isLoading = ref(true)
const imageErrors = reactive<Record<string, boolean>>({})

const emit = defineEmits<{
  athleteSelect: [athlete: { id: number; firstname: string; lastname: string }]
}>()

onMounted(async () => {
  isLoading.value = true
  try {
    const topAthletes = await getTopAthletes()
    
    // Limit to top 5
    const top5 = topAthletes.slice(0, 5)
    
    // Fetch details for each athlete
    const details = await Promise.all(
      top5.map(async (athlete) => {
        try {
          const response = await fetch(
            `https://worldathletics.nimarion.de/athletes/${athlete.athleteId}`
          )
          const data = await response.json()
          const athleteData = data || {}
          return {
            ...athlete,
            firstname: athleteData.firstname || athleteData.firstnameName || athleteData.name || 'Unknown',
            lastname: athleteData.lastname || athleteData.surname || athleteData.familyName || 'Athlete',
            country: athleteData.country || athleteData.nationality || '',
            countryFlag: getCountryFlag(athleteData.country || athleteData.nationality || '')
          }
        } catch (error) {
          console.error(`Failed to fetch details for athlete ${athlete.athleteId}:`, error)
        }
        
        return {
          ...athlete,
          firstname: 'Unknown',
          lastname: 'Athlete',
          country: '',
          countryFlag: ''
        }
      })
    )
    
    athleteDetails.value = details
  } catch (error) {
    console.error('Error loading leaderboard:', error)
  } finally {
    isLoading.value = false
  }
})

function handleAthleteClick(athlete: AthleteWithDetails) {
  emit('athleteSelect', {
    id: Number((athlete as any).athleteId),
    firstname: athlete.firstname,
    lastname: athlete.lastname
  })
}

function getProfileImage(athleteId: number | string) {
  if (!athleteId) return null
  const originalUrl = `https://media.aws.iaaf.org/athletes/${athleteId}.jpg`
  return `/api/proxy-image?url=${encodeURIComponent(originalUrl)}`
}

function handleImageError(athleteId: number | string) {
  imageErrors[athleteId] = true
}

function getInitials(first: string, last: string) {
  return ((first?.charAt(0) || '') + (last?.charAt(0) || '')).toUpperCase()
}
</script>

<style scoped>
.leaderboard {
  margin-top: var(--spacing-xl);
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;
}

@media (min-width: 768px) {
  .leaderboard {
    padding: var(--spacing-lg);
  }
}

.leaderboard::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: var(--color-accent-secondary);
  box-shadow: 0 0 15px var(--color-accent-secondary);
}

.title-container {
  margin-bottom: var(--spacing-lg);
  position: relative;
}

@media (min-width: 768px) {
  .title-container {
    margin-bottom: var(--spacing-xl);
  }
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

@media (min-width: 768px) {
  .leaderboard-title {
    font-size: 3rem;
    letter-spacing: 2px;
    text-shadow: 3px 3px 0px var(--color-accent-secondary);
  }
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
  background: white;
  margin-top: 4px;
  transform: skew(-5deg);
}

@media (min-width: 768px) {
  .title-underline {
    width: 60px;
    height: 4px;
  }
}

.leaderboard-loading,
.leaderboard-empty {
  text-align: center;
  padding: var(--spacing-xl);
  color: rgba(255, 255, 255, 0.5);
  font-family: var(--font-family-heading);
  font-size: 1.2rem;
  letter-spacing: 1px;
  position: relative;
}

@media (min-width: 768px) {
  .leaderboard-loading,
  .leaderboard-empty {
    padding: var(--spacing-2xl);
    font-size: 1.5rem;
    letter-spacing: 2px;
  }
}

.scanner {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--color-accent-secondary);
  box-shadow: 0 0 15px var(--color-accent-secondary);
  animation: scan 2s linear infinite;
}

@keyframes scan {
  0% { top: 0; opacity: 0; }
  50% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

@media (min-width: 768px) {
  .leaderboard-list {
    gap: var(--spacing-md);
  }
}

.leaderboard-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  cursor: pointer;
  text-align: left;
  color: inherit;
  font-family: inherit;
  position: relative;
  transform: skewX(-5deg);
  width: calc(100% - 10px);
  margin-left: 5px;
}

@media (min-width: 768px) {
  .leaderboard-item {
    gap: var(--spacing-lg);
    padding: var(--spacing-md);
    transform: skewX(-10deg);
    width: calc(100% - 20px);
    margin-left: 10px;
  }
}

.leaderboard-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--color-accent-secondary);
  transform: skewX(-5deg) translateX(5px);
  box-shadow: -5px 0 15px rgba(255, 0, 85, 0.2);
}

@media (min-width: 768px) {
  .leaderboard-item:hover {
    transform: skewX(-10deg) translateX(10px);
    box-shadow: -10px 0 20px rgba(255, 0, 85, 0.2);
  }
}

.leaderboard-item::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s;
}

.leaderboard-item:hover::after {
  transform: translateX(100%);
}

.rank-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  transform: skewX(5deg); /* Counter-skew */
}

@media (min-width: 768px) {
  .rank-section {
    gap: var(--spacing-md);
    transform: skewX(10deg);
  }
}

.rank-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  font-family: var(--font-family-heading);
  font-weight: 800;
  font-size: 1.2rem;
  color: white;
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .rank-badge {
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
  }
}

.athlete-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-bg-tertiary);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

@media (min-width: 768px) {
  .athlete-avatar {
    width: 60px;
    height: 60px;
    border: 2px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  }
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
  color: rgba(255, 255, 255, 0.5);
}

@media (min-width: 768px) {
  .avatar-initials {
    font-size: 1.5rem;
  }
}

/* Top 3 Styles */
.top-1 .rank-badge {
  background: #FFD700; /* Gold */
  color: black;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}
.top-1 .athlete-avatar {
  border-color: #FFD700;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
}

@media (min-width: 768px) {
  .top-1 .rank-badge { box-shadow: 0 0 15px rgba(255, 215, 0, 0.5); }
  .top-1 .athlete-avatar { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
}

.top-2 .rank-badge {
  background: #C0C0C0; /* Silver */
  color: black;
  box-shadow: 0 0 10px rgba(192, 192, 192, 0.5);
}
.top-2 .athlete-avatar {
  border-color: #C0C0C0;
}

.top-3 .rank-badge {
  background: #CD7F32; /* Bronze */
  color: black;
  box-shadow: 0 0 10px rgba(205, 127, 50, 0.5);
}
.top-3 .athlete-avatar {
  border-color: #CD7F32;
}

.athlete-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
  transform: skewX(5deg); /* Counter-skew */
}

@media (min-width: 768px) {
  .athlete-info {
    gap: 4px;
    transform: skewX(10deg);
  }
}

.athlete-name-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  min-width: 0; /* Critical for flex child truncation */
}

.athlete-name {
  font-family: var(--font-family-heading);
  font-size: clamp(0.9rem, 3vw, 1.1rem); /* Synced with Travel */
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

@media (min-width: 768px) {
  .athlete-name {
    font-size: 1.4rem;
  }
}

.country-flag {
  font-size: 1.1rem;
  line-height: 1;
}

@media (min-width: 768px) {
  .country-flag {
    font-size: 1.5rem;
  }
}

.athlete-views {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

@media (min-width: 768px) {
  .athlete-views {
    gap: 6px;
  }
}

.view-count {
  font-family: var(--font-family-heading);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-accent-tertiary); /* Changed to Cyan to match Travel */
}

@media (min-width: 768px) {
  .view-count {
    font-size: 1.5rem;
  }
}

.view-label {
  font-size: 0.6rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.5px;
}

@media (min-width: 768px) {
  .view-label {
    font-size: 0.8rem;
    letter-spacing: 1px;
  }
}
</style>

