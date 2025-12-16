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
        <!-- <div class="brand-header">
          <span class="brand-text">TRACK WRAPPED</span>
          <span class="year-badge">2025</span>
        </div> -->

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
            
            <h1 class="athlete-name" ref="containerRef">
              <span class="first-name" ref="firstNameRef">{{ firstName }}</span>
              <span class="last-name" ref="lastNameRef">{{ lastName }}</span>
            </h1>
            <div class="discipline-tag">{{ mainDiscipline }}</div>
          </div>

          <!-- Stats Grid -->
          <div class="stats-grid">
            <!-- Flex Badges (Top Priority) -->
            <div class="flex-badges-row">
              <div 
                class="flex-badge" 
                v-for="(stat, idx) in flexStats" 
                :key="idx" 
                :class="{ highlight: stat.highlight }"
                @click.stop="toggleBadgeTooltip(idx)"
              >
                <div class="badge-content-wrapper">
                  <span class="badge-initial">{{ stat.initial }}</span>
                  <span v-if="stat.medalIcon" class="badge-medal">{{ stat.medalIcon }}</span>
                </div>
                
                <!-- Badge Tooltip -->
                <Transition name="fade">
                  <div v-if="activeBadgeIndex === idx" class="badge-tooltip">
                    <div class="tooltip-label">{{ stat.label }}</div>
                    <div class="tooltip-value">{{ stat.value }}</div>
                  </div>
                </Transition>
              </div>
            </div>

            <!-- Season Best (Hero Stat) -->
            <div class="stat-box hero">
              <div class="stat-label">SEASON BEST</div>
              <div class="stat-value highlight">{{ seasonBest }}</div>
              <div class="sub-stats">
                <div class="sub-stat">
                  <span class="sub-label">AVG POINTS</span>
                  <span class="sub-value">{{ Math.round(averageScore) }}</span>
                </div>
                <div class="sub-divider"></div>
                <div class="sub-stat">
                  <span class="sub-label">MAX POINTS</span>
                  <span class="sub-value">{{ Math.round(maxScore) }}</span>
                </div>
                <div class="sub-divider"></div>
                <div class="sub-stat">
                  <span class="sub-label">{{ subStat3.label }}</span>
                  <span class="sub-value">{{ subStat3.value }}</span>
                </div>
              </div>
            </div>

            <!-- Power Level (Dominant Feature) -->
            <div class="power-level-container" @click="toggleTooltip">
              <div class="power-badge">
                <div class="power-header">
                  <span class="power-label">POWER LEVEL</span>
                  <span class="info-icon">ⓘ</span>
                </div>
                <div class="power-main">
                  <div class="power-value-glitch" :data-text="percentileRank.label">
                    {{ percentileRank.label }}
                  </div>
                </div>
                <div class="power-bar">
                  <div class="power-fill" :style="{ width: getPowerWidth(percentileRank.label) }"></div>
                </div>
              </div>

              <!-- Tooltip Overlay -->
              <Transition name="fade">
                <div v-if="showTooltip" class="tooltip-overlay">
                  <div class="tooltip-content">
                    <h3>POWER LEVELS</h3>
                    <div class="level-list">
                      <div 
                        v-for="level in POWER_LEVELS" 
                        :key="level.label"
                        class="level-item"
                        :class="{ active: level.label === percentileRank.label }"
                      >
                        <div class="level-header">
                          <span class="level-name">{{ level.label }}</span>
                          <span class="level-range">{{ level.range }}</span>
                        </div>
                        <div class="level-desc">{{ level.desc }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
            <!-- Footer CTA -->
            <div class="share-footer">
              <div class="share-btn">
                Screenshot & Share!
              </div>
            </div>
          </div>

          <!-- Top Events List (Compact) -->
          <!-- <div class="top-events" v-if="topDisciplines.length > 0">
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
          </div> -->
        </div>
      </div>
    </div>
  </SlideWrapper>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
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
  averageScore: number
  maxScore: number
  honours?: Array<{ category: string; count: number }>
  recentHonours?: Array<{ category: string; place: number; competition: string }>
  records?: { nr: number; wr: number; other: number }
}

const props = defineProps<Props>()

const showTooltip = ref(false)
const activeBadgeIndex = ref<number | null>(null)

function toggleTooltip(e: Event) {
  e.stopPropagation()
  showTooltip.value = !showTooltip.value
  activeBadgeIndex.value = null // Close other tooltips
}

function toggleBadgeTooltip(idx: number) {
  if (activeBadgeIndex.value === idx) {
    activeBadgeIndex.value = null
  } else {
    activeBadgeIndex.value = idx
    showTooltip.value = false // Close power level tooltip
  }
}

const POWER_LEVELS = [
  { label: 'ROOKIE', range: '< 800', desc: 'Just getting started.' },
  { label: 'LOCAL HERO', range: '800-950', desc: 'Dominating the local scene.' },
  { label: 'NATIONAL CLASS', range: '950-1050', desc: 'Competing at the national level.' },
  { label: 'INTERNATIONAL', range: '1050-1150', desc: 'Making waves globally.' },
  { label: 'WORLD CLASS', range: '1150-1250', desc: 'Among the best in the world.' },
  { label: 'ELITE', range: '1250+', desc: 'Legendary status.' },
]

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
  // Strictly find the best ranking (lowest place)
  return [...props.rankings].sort((a, b) => a.place - b.place)[0]
})

const flexStats = computed(() => {
  const stats: Array<{ 
    initial: string
    label: string
    value: string
    highlight: boolean
    medalIcon?: string 
  }> = []

  // 1. World Records
  if (props.records?.wr) {
    stats.push({ 
      initial: 'WR', 
      label: 'WORLD RECORD', 
      value: 'HOLDER', 
      highlight: true 
    })
  }

  // 2. National Records
  if (props.records?.nr) {
    stats.push({ 
      initial: 'NR', 
      label: 'NATIONAL RECORD', 
      value: 'HOLDER', 
      highlight: true 
    })
  }

  // 3. Recent Honours (This Season)
  if (props.recentHonours) {
    props.recentHonours.slice(0, 2).forEach(h => {
      let label = h.category.replace(' Championships', '').replace('Athletics ', '').toUpperCase()
      if (label.length > 20) label = label.split(' ')[0] + ' CHAMPS'
      
      const value = h.place === 1 ? '2025 CHAMPION' : '2025 MEDALIST'
      // Create initial (e.g., "WC" for World Champs, "EC" for European)
      const words = label.split(' ')
      const initial = words.length > 1 
        ? words.map(w => w[0]).join('')
        : label.substring(0, 2)

      stats.push({ 
        initial: initial,
        medalIcon: h.place === 1 ? '🥇' : '🥉',
        label: label, 
        value: value, 
        highlight: true 
      })
    })
  }

  // 4. Lifetime Honours
  if (props.honours && stats.length < 3) {
    props.honours.forEach(h => {
      if (stats.length >= 3) return
      if (props.recentHonours?.some(rh => rh.category === h.category)) return

      let label = h.category.replace(' Championships', '').replace('Athletics ', '').toUpperCase()
      if (label.length > 20) label = label.split(' ')[0] + ' CHAMPS'
      
      const words = label.split(' ')
      const initial = words.length > 1 
        ? words.map(w => w[0]).join('')
        : label.substring(0, 2)
      
      stats.push({ 
        initial: initial,
        label: label, 
        value: `${h.count}x MEDALIST`, 
        highlight: true 
      })
    })
  }

  // 5. World Rank (Removed from badges as it is now in sub-stats if available)
  // 6. Races (Removed from badges as requested)

  return stats.slice(0, 3)
})

const subStat3 = computed(() => {
  if (bestRanking.value) {
    return {
      label: 'WORLD RANK',
      value: `#${bestRanking.value.place}`
    }
  }
  return {
    label: 'RACES',
    value: props.totalCompetitions.toString()
  }
})

function getPowerWidth(label: string): string {
  const levels = POWER_LEVELS.map(l => l.label)
  const index = levels.indexOf(label)
  if (index === -1) return '10%'
  return `${((index + 1) / levels.length) * 100}%`
}

// Text fitting logic
const firstNameRef = ref<HTMLElement | null>(null)
const lastNameRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)

function fitText() {
  if (!containerRef.value) return

  const maxWidth = containerRef.value.clientWidth - 32 // 32px buffer/padding
  
  const adjustElement = (el: HTMLElement, initialSize: number) => {
    let size = initialSize
    el.style.fontSize = `${size}rem`
    
    // Minimum readable size
    const minSize = 1.5
    
    while (el.scrollWidth > maxWidth && size > minSize) {
      size -= 0.1
      el.style.fontSize = `${size}rem`
    }
  }

  if (firstNameRef.value) adjustElement(firstNameRef.value, 3)
  if (lastNameRef.value) adjustElement(lastNameRef.value, 4.5)
}

function handleTap(event: Event) {
  // Placeholder
}

onMounted(() => {
  // Run fit text after a short delay to ensure fonts are loaded/layout is stable
  setTimeout(fitText, 100)
  window.addEventListener('resize', fitText)
})
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
  justify-content: flex-start; /* Changed from space-between */
  padding: var(--spacing-lg);
  box-sizing: border-box;
}

.brand-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-md);
  margin-top: var(--spacing-xl);
  flex-shrink: 0; /* Prevent header from shrinking */
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
  margin-top: auto; /* Push to bottom if space permits, but don't force header off */
  padding-bottom: var(--spacing-xl);
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
  margin-top: 120px;
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
  margin-bottom: 8px;
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
  grid-column: span 3;
  position: relative;
  cursor: pointer;
  text-align: center;
}

.share-btn {
  background: white;
  color: black;
  padding: 5px 24px;
  font-size: 1.2rem;
  font-weight: 800;
  display: block; /* Changed from inline-block */
  width: 100%; /* Full width */
  text-align: center;
  clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
  cursor: pointer;
  transition: transform 0.2s;
}

.share-btn:active {
  transform: scale(0.95);
}

.sub-stats {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-top: 8px;
}

.sub-stat {
  display: flex;
  flex-direction: column;
}

.sub-label {
  font-family: var(--font-family-primary);
  font-size: 0.6rem;
  color: var(--color-text-secondary);
  letter-spacing: 1px;
}

.sub-value {
  font-family: var(--font-family-heading);
  font-size: 1.2rem;
  color: white;
}

.sub-divider {
  width: 1px;
  height: 20px;
  background: rgba(255, 255, 255, 0.2);
}

.power-level-container {
  grid-column: span 3;
  position: relative;
  cursor: pointer;
}

.power-badge {
  background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 16px;
  padding: var(--spacing-sm) var(--spacing-md); /* Reduced padding */
  display: flex;
  flex-direction: column;
  gap: 4px; /* Reduced gap */
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.power-header {
  display: flex;
  justify-content: center; /* Center the text */
  align-items: center;
  width: 100%;
  position: relative; /* For absolute positioning of icon */
}

.power-label {
  font-family: var(--font-family-primary);
  font-size: 0.7rem; /* Even smaller */
  color: var(--color-accent-primary);
  letter-spacing: 2px;
  font-weight: 700;
}

.power-main {
  display: flex;
  justify-content: center;
  padding: 2px 0; /* Minimal padding */
}

.power-value-glitch {
  font-family: var(--font-family-heading);
  font-size: 1.5rem; /* Even smaller */
  color: white;
  text-transform: uppercase;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
  position: relative;
  z-index: 1;
  line-height: 1;
  text-align: center;
}

.info-icon {
  font-size: 0.8rem;
  opacity: 0.7;
  position: absolute;
  right: 0; /* Keep icon to the right */
}

.power-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  margin-top: 4px;
  overflow: hidden;
}

.power-fill {
  height: 100%;
  background: var(--color-accent-secondary);
  box-shadow: 0 0 15px var(--color-accent-secondary);
  transition: width 1s ease-out;
}

.identity-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  margin-top: 0px; /* Increased margin to push content down */
}

/* Flex Badges Row */
.flex-badges-row {
  grid-column: span 3;
  display: flex;
  justify-content: center; /* Center badges */
  gap: 16px;
  margin-bottom: 12px; /* Space below badges */
}

.flex-badge {
  width: 60px;
  height: 60px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%; /* Circular badges */
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s;
}

.flex-badge:active {
  transform: scale(0.95);
}

.flex-badge.highlight {
  border-color: var(--color-accent-primary);
  background: rgba(204, 255, 0, 0.1);
  box-shadow: 0 0 15px rgba(204, 255, 0, 0.2);
}

.badge-content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.badge-initial {
  font-family: var(--font-family-heading);
  font-size: 1.2rem;
  color: white;
  font-weight: 900;
  letter-spacing: -1px;
}

.badge-medal {
  font-size: 1rem;
  margin-top: -2px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
}

.flex-badge.highlight .badge-initial {
  color: var(--color-accent-primary);
}

.badge-tooltip {
  position: absolute;
  bottom: 110%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.95);
  border: 1px solid var(--color-accent-primary);
  border-radius: 8px;
  padding: 8px 12px;
  width: max-content;
  max-width: 200px;
  z-index: 100;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0,0,0,0.5);
}

.tooltip-label {
  font-family: var(--font-family-primary);
  font-size: 0.7rem;
  color: var(--color-text-secondary);
  margin-bottom: 2px;
}

.tooltip-value {
  font-family: var(--font-family-heading);
  font-size: 0.9rem;
  color: white;
  font-weight: 700;
}

.info-icon {
  font-size: 0.9rem;
  opacity: 0.7;
}

.tooltip-overlay {
  position: absolute;
  bottom: 100%; /* Show above */
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.98);
  border: 1px solid var(--color-accent-primary);
  border-radius: 12px;
  padding: var(--spacing-md);
  z-index: 100;
  margin-bottom: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.8);
}

.tooltip-content h3 {
  font-family: var(--font-family-heading);
  font-size: 1.2rem;
  color: var(--color-accent-primary);
  margin-bottom: var(--spacing-md);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 8px;
  text-align: center;
}

.level-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.level-item {
  opacity: 0.4;
  transition: all 0.2s;
  padding: 4px 8px;
  border-radius: 4px;
}

.level-item.active {
  opacity: 1;
  background: rgba(255, 255, 255, 0.1);
  border-left: 3px solid var(--color-accent-secondary);
}

.level-header {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-family-heading);
  font-size: 1rem;
  color: white;
  margin-bottom: 2px;
}

.level-item.active .level-header {
  color: var(--color-accent-secondary);
  text-shadow: 0 0 10px rgba(255, 0, 85, 0.3);
}

.level-desc {
  font-family: var(--font-family-primary);
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Responsive Adjustments */
@media (max-width: 380px) {
  .first-name { font-size: 2.5rem; }
  .last-name { font-size: 3.5rem; }
  .stat-value.highlight { font-size: 3.5rem; }
  .stat-value { font-size: 1.5rem; }
  .power-value-glitch { font-size: 2rem; }
}

</style>
