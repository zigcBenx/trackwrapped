<template>
  <SlideWrapper
    background="#000000"
    type="share-card"
  >
    <div class="share-card-container" @click="handleTap" @touchend.stop="handleTap">
      <!-- Background Image Layer -->
      <div class="background-layer">
        <div class="bg-pattern">
          <div class="initials-bg">{{ initials }}</div>
        </div>
        <div class="gradient-overlay"></div>
      </div>

      <!-- Content Layer -->
      <div class="content-layer">
        <!-- Brand Header -->
        <div class="brand-header">
          <span class="brand-text">TRACK WRAPPED</span>
          <span class="year-badge">2025</span>
        </div>

        <!-- Main Content (Bottom Aligned) -->
        <div class="main-content">
          <!-- Identity -->
          <div class="identity-section">
            <div class="identity-header">
              <div class="avatar-circle">
                <img 
                  v-if="profileImage && !imageError" 
                  :src="profileImage" 
                  alt="Profile" 
                  class="avatar-img"
                  @error="handleImageError"
                />
                <span v-else>{{ initials }}</span>
              </div>
              <div class="badges-col">
                <div class="country-badge" v-if="country">
                  <span class="flag">{{ flagEmoji }}</span>
                  <span class="country-code">{{ country }}</span>
                </div>
                <div class="nickname-badge" v-if="nickname">
                  @{{ nickname.toLowerCase().replace(/\s+/g, '') }}
                </div>
              </div>
            </div>
            
            <h1 class="athlete-name">
              <span class="first-name">{{ firstName }}</span>
              <span class="last-name">{{ lastName }}</span>
            </h1>
            <div class="discipline-tag">{{ mainDiscipline }}</div>
          </div>

          <!-- Stats Grid -->
          <div class="stats-grid">
            <!-- Season Best (Hero Stat) -->
            <div class="stat-box hero">
              <div class="stat-label">SEASON BEST</div>
              <div class="stat-value highlight">{{ seasonBest }}</div>
            </div>

            <!-- World Rank (if available) -->
            <div class="stat-box" v-if="bestRanking">
              <div class="stat-label">WORLD RANK</div>
              <div class="stat-value">#{{ bestRanking.place }}</div>
            </div>

            <!-- Total Races -->
            <div class="stat-box">
              <div class="stat-label">RACES</div>
              <div class="stat-value">{{ totalCompetitions }}</div>
            </div>
          </div>

          <!-- Top Events List (Compact) -->
          <div class="top-events" v-if="topDisciplines.length > 0">
            <div class="events-label">TOP EVENTS</div>
            <div class="events-list">
              <span 
                v-for="(disc, idx) in topDisciplines.slice(0, 3)" 
                :key="idx" 
                class="event-tag"
              >
                {{ disc.name }}
              </span>
            </div>
          </div>
        </div>

        <!-- Footer CTA -->
        <div class="share-footer">
          <div class="share-btn">SHARE YOUR SEASON</div>
        </div>
      </div>
    </div>
  </SlideWrapper>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import SlideWrapper from './SlideWrapper.vue'
import { getCountryFlag } from '@/utils/countryFlags'

interface Props {
  firstName: string
  lastName: string
  country: string
  nickname: string
  heatmapData: any
  totalCompetitions: number
  mainDiscipline: string
  seasonBest: string
  athleteId?: number | null
  percentileRank: { rank: string; label: string }
  topDisciplines: Array<{ name: string; mark: string }>
  rankings?: any[]
}

const props = defineProps<Props>()

const imageError = ref(false)

const profileImage = computed(() => {
  if (!props.athleteId) return null
  // Using high-res image if available, or standard
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

const flagEmoji = computed(() => {
  return getCountryFlag(props.country)
})

const bestRanking = computed(() => {
  if (!props.rankings || props.rankings.length === 0) return null
  // Try main discipline
  const main = props.rankings.find(r => r.discipline && r.discipline.toLowerCase() === props.mainDiscipline.toLowerCase())
  if (main) return main
  // Fallback to best
  return [...props.rankings].sort((a, b) => a.place - b.place)[0]
})

function handleTap(event: Event) {
  // Placeholder
}
</script>

<style scoped>
.share-card-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: #000;
  font-family: var(--font-family-heading);
}

/* Background Layer */
.background-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* Slight zoom for effect */
  transform: scale(1.1);
}

.bg-pattern {
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, #333, #000);
  display: flex;
  align-items: center;
  justify-content: center;
}

.initials-bg {
  font-size: 15rem;
  color: rgba(255, 255, 255, 0.05);
  font-weight: 900;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0) 30%,
    rgba(0, 0, 0, 0.6) 60%,
    rgba(0, 0, 0, 0.95) 90%,
    #000 100%
  );
}

/* Content Layer */
.content-layer {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: var(--spacing-lg);
  box-sizing: border-box;
}

.brand-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-md);
  margin-top: var(--spacing-xl);
}

.brand-text {
  font-size: 1rem;
  letter-spacing: 4px;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

.year-badge {
  background: var(--color-accent-primary);
  color: black;
  padding: 2px 8px;
  font-size: 1rem;
  font-weight: 800;
  transform: rotate(-5deg);
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.identity-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.identity-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}

.avatar-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--color-accent-secondary);
  border: 3px solid white;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 900;
  color: white;
  box-shadow: 0 4px 15px rgba(0,0,0,0.5);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.badges-col {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.country-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: fit-content;
}

.nickname-badge {
  font-family: var(--font-family-primary);
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  padding-left: 4px;
}

.flag {
  font-size: 1.2rem;
}

.country-code {
  font-size: 0.9rem;
  color: white;
  letter-spacing: 1px;
}

.athlete-name {
  display: flex;
  flex-direction: column;
  line-height: 0.85;
  margin: 0;
  text-transform: uppercase;
  text-shadow: 0 4px 10px rgba(0,0,0,0.5);
}

.first-name {
  font-size: 3rem;
  color: white;
  font-weight: 400;
}

.last-name {
  font-size: 4.5rem;
  color: white;
  font-weight: 900;
  letter-spacing: -2px;
}

.discipline-tag {
  font-family: var(--font-family-primary);
  color: var(--color-accent-primary);
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
  margin-top: 4px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.stat-box {
  display: flex;
  flex-direction: column;
  border-left: 2px solid rgba(255, 255, 255, 0.2);
  padding-left: var(--spacing-sm);
}

.stat-box.hero {
  grid-column: span 3; /* Full width for Season Best */
  border-left: none;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  padding-left: 0;
  padding-bottom: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}

.stat-label {
  font-family: var(--font-family-primary);
  font-size: 0.7rem;
  color: var(--color-text-secondary);
  letter-spacing: 1px;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 2rem;
  color: white;
  line-height: 1;
}

.stat-value.highlight {
  font-size: 4.5rem;
  color: var(--color-accent-primary);
  text-shadow: 0 0 20px rgba(204, 255, 0, 0.3);
}

.top-events {
  margin-top: var(--spacing-sm);
}

.events-label {
  font-family: var(--font-family-primary);
  font-size: 0.7rem;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}

.events-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.event-tag {
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.share-footer {
  text-align: center;
  padding-bottom: var(--spacing-md);
}

.share-btn {
  background: white;
  color: black;
  padding: 12px 24px;
  font-size: 1.2rem;
  font-weight: 800;
  letter-spacing: 2px;
  display: inline-block;
  clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
  cursor: pointer;
  transition: transform 0.2s;
}

.share-btn:active {
  transform: scale(0.95);
}

/* Responsive Adjustments */
@media (max-width: 380px) {
  .first-name { font-size: 2.5rem; }
  .last-name { font-size: 3.5rem; }
  .stat-value.highlight { font-size: 3.5rem; }
  .stat-value { font-size: 1.5rem; }
}

@media (min-height: 800px) {
  .main-content { margin-bottom: var(--spacing-2xl); }
}
</style>
