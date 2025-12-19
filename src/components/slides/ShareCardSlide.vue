<template>
  <SlideWrapper
    background="#000000"
    type="share-card"
  >
    <div class="share-card-container" ref="shareCardRef" @click="handleTap" @touchend.stop="handleTap">
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

            <!-- Top Results Carousel -->
            <div class="stat-box hero carousel-container">
              <div class="carousel-content">
                <Transition name="slide-fade" mode="out-in">
                  <div v-if="currentCarouselItem" :key="currentCarouselItem.name" class="carousel-item">
                    <div class="stat-label">TOP RESULTS</div>
                    <div class="stat-value highlight hero-effect">{{ currentCarouselItem.mark }}</div>
                    <div class="discipline-sub-label">
                      {{ currentCarouselItem.name }} 
                      <span class="emoji-span">{{ getDisciplineEmoji(currentCarouselItem.name) }}</span>
                    </div>
                  </div>
                </Transition>
              </div>
              
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

              <!-- Tooltip moved to root -->
            </div>
            <!-- Footer CTA -->
            <div class="share-footer">
              <button 
                class="share-btn interactive" 
                :class="{ 'is-sharing': isSharing }"
                @click.stop="handleShare" 
                @touchstart.stop="handleShare"
                @touchend.stop
                @mousedown.stop="handleShare"
                :disabled="isSharing"
              >
                Screenshot & Share!
              </button>
              <div class="capture-link">trackwrapped.vercel.app</div>
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

      <!-- Tooltip Modal (Moved to root) -->
      <div v-if="showTooltip" class="tooltip-backdrop" @click.stop="showTooltip = false"></div>
      <Transition name="fade">
        <div v-if="showTooltip" class="tooltip-overlay" @click.stop>
          <div class="tooltip-close-btn" @click.stop="showTooltip = false">✕</div>
          <div class="tooltip-content">
            <h3>POWER LEVELS</h3>
            <div class="level-list">
              <div 
                v-for="level in POWER_LEVELS" 
                :key="level.label"
                class="level-item"
                :class="{ active: level.label === percentileRank.label }"
              >
                <div class="level-info">
                  <span class="level-name">{{ level.label }}</span>
                  <div class="level-desc">{{ level.desc }}</div>
                </div>
                <span class="level-range">{{ level.range }}</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </SlideWrapper>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import SlideWrapper from './SlideWrapper.vue'
import { getCountryFlag } from '@/utils/countryFlags'
import { getDisciplineEmoji } from '@/utils/disciplineEmojis'
import html2canvas from 'html2canvas'

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
  { label: 'LEGENDARY', range: '1250+', desc: 'Legendary status.' },
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
  const score = props.maxScore || 0
  
  // Define ranges matching POWER_LEVELS
  // Rookie: < 800
  // Local Hero: 800-950
  // National Class: 950-1050
  // International: 1050-1150
  // World Class: 1150-1250
  // Elite: 1250+ (using 1400 as virtual max for bar)
  
  const ranges = [
    { min: 0, max: 800 },
    { min: 800, max: 950 },
    { min: 950, max: 1050 },
    { min: 1050, max: 1150 },
    { min: 1150, max: 1250 },
    { min: 1250, max: 1400 }
  ]
  
  const levels = POWER_LEVELS.map(l => l.label)
  const index = levels.indexOf(label)
  
  if (index === -1) return '5%' // Fallback
  
  // Calculate base width for completed levels (16.66% each)
  const segmentWidth = 100 / levels.length
  const baseWidth = index * segmentWidth
  
  // Calculate progress within current level
  const range = ranges[index]
  if (!range) return `${Math.max(5, Math.min(100, baseWidth))}%`

  const rangeSpan = range.max - range.min
  const scoreInLevel = Math.max(0, Math.min(score - range.min, rangeSpan))
  const progressInLevel = scoreInLevel / rangeSpan
  
  // Total width
  const totalWidth = baseWidth + (progressInLevel * segmentWidth)
  
  // Clamp between 5% and 100%
  return `${Math.max(5, Math.min(100, totalWidth))}%`
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

const shareCardRef = ref<HTMLElement | null>(null)
const isSharing = ref(false)

async function handleShare(event?: any) {
  if (event && event.stopPropagation) {
    event.stopPropagation()
  }

  if (!shareCardRef.value) {
    console.error('shareCardRef is null, cannot capture')
    return
  }

  isSharing.value = true

  // Small delay to let the UI update (show "Generating...")
  await new Promise(resolve => setTimeout(resolve, 500))

  // Wait for all images to be loaded
  const images = shareCardRef.value.querySelectorAll('img')
  const imagePromises = Array.from(images).map(img => {
    if (img.complete) return Promise.resolve()
    return new Promise(resolve => {
      img.onload = resolve
      img.onerror = resolve
    })
  })
  await Promise.all(imagePromises)

  try {
    console.log('Capturing canvas...')
    const canvas = await html2canvas(shareCardRef.value, {
      useCORS: true,
      allowTaint: false, // Ensure we don't taint the canvas
      scale: 2, // Higher quality
      backgroundColor: '#000000',
      logging: false,
      onclone: (clonedDoc) => {
        // Ensure the cloned element is visible for capture
        const el = clonedDoc.querySelector('.share-card-container') as HTMLElement
        if (el) {
          el.style.transform = 'none'
        }
        
        // Fix background-clip: text issues (html2canvas doesn't support it)
        const heroElements = clonedDoc.querySelectorAll('.hero-effect')
        heroElements.forEach(item => {
          const htmlItem = item as HTMLElement
          htmlItem.style.background = 'none'
          htmlItem.style.webkitBackgroundClip = 'initial'
          htmlItem.style.backgroundClip = 'initial'
          htmlItem.style.color = '#CCFF00' // Use static volt green
          htmlItem.style.textShadow = 'none'
        })

        // Fix badges
        const badges = clonedDoc.querySelectorAll('.flex-badge')
        badges.forEach(badge => {
          const htmlBadge = badge as HTMLElement
          htmlBadge.style.boxShadow = 'none'
          htmlBadge.style.textShadow = 'none'
        })

        const badgeWrappers = clonedDoc.querySelectorAll('.badge-content-wrapper')
        badgeWrappers.forEach(wrapper => {
          const htmlWrapper = wrapper as HTMLElement
          htmlWrapper.style.display = 'block' // Simplify flex to block
          htmlWrapper.style.textAlign = 'center'
        })

        const medals = clonedDoc.querySelectorAll('.badge-medal')
        medals.forEach(medal => {
          const htmlMedal = medal as HTMLElement
          htmlMedal.style.display = 'block'
          htmlMedal.style.marginTop = '2px'
        })

        // Hide info icons and tooltips in capture
        const infoIcons = clonedDoc.querySelectorAll('.info-icon')
        infoIcons.forEach(icon => {
          const htmlIcon = icon as HTMLElement
          htmlIcon.style.display = 'none'
        })

        // Hide the share button itself in the capture for a cleaner image
        const footer = clonedDoc.querySelector('.share-footer') as HTMLElement
        const btn = clonedDoc.querySelector('.share-btn') as HTMLElement
        const link = clonedDoc.querySelector('.capture-link') as HTMLElement
        
        if (btn) btn.style.display = 'none'
        if (link) {
          link.style.display = 'block'
          link.style.opacity = '1'
        }
      }
    })

    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'))
    if (!blob) throw new Error('Failed to create blob')
    
    console.log('Canvas captured, blob size:', blob.size)

    // Check if it's mobile and supports sharing
    if (navigator.share && navigator.canShare) {
      console.log('Native share supported, preparing file...')
      const file = new File([blob], 'track-wrapped-2025.png', { type: 'image/png' })
      
      if (navigator.canShare({ files: [file] })) {
        console.log('Sharing file via navigator.share...')
        await navigator.share({
          files: [file],
          title: 'My Track Wrapped 2025',
          text: 'Check out my season stats on Track Wrapped!'
        })
        console.log('Share successful')
        return
      } else {
        console.warn('navigator.canShare returned false for the generated file')
      }
    } else {
      console.log('Native share not supported or navigator.share missing')
    }

    // Fallback for desktop or if sharing fails: Download
    console.log('Triggering download fallback...')
    const dataUrl = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = 'track-wrapped-2025.png'
    link.href = dataUrl
    link.click()
    console.log('Download triggered')
  } catch (error) {
    console.error('Error during share/capture:', error)
  } finally {
    isSharing.value = false
  }
}

function handleTap(event: Event) {
  // Placeholder
}

onMounted(() => {
  // Run fit text after a short delay to ensure fonts are loaded/layout is stable
  setTimeout(fitText, 100)
  window.addEventListener('resize', fitText)
  
  // Start carousel
  startCarousel()
})

onUnmounted(() => {
  stopCarousel()
})

// Carousel Logic
const carouselIndex = ref(0)
let carouselInterval: number | null = null

const carouselItems = computed(() => {
  // Use top disciplines if available, otherwise fallback to season best
  if (props.topDisciplines && props.topDisciplines.length > 0) {
    return props.topDisciplines.slice(0, 3)
  }
  return [{ name: props.mainDiscipline, mark: props.seasonBest }]
})

const currentCarouselItem = computed(() => {
  return carouselItems.value[carouselIndex.value] || carouselItems.value[0]
})

function startCarousel() {
  if (carouselItems.value.length <= 1) return
  
  carouselInterval = setInterval(() => {
    carouselIndex.value = (carouselIndex.value + 1) % carouselItems.value.length
  }, 4000)
}

function stopCarousel() {
  if (carouselInterval) {
    clearInterval(carouselInterval)
    carouselInterval = null
  }
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
  pointer-events: none;
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
  z-index: 50; /* Much higher z-index */
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Changed from space-between */
  padding: var(--spacing-lg);
  box-sizing: border-box;
  pointer-events: auto; /* Ensure events are captured */
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
  gap: var(--spacing-sm);
  margin-top: auto;
  padding-bottom: var(--spacing-md);
  flex-grow: 1;
  justify-content: flex-end;
  pointer-events: auto;
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

/* Hero Effect for Carousel */
.hero-effect {
  background: linear-gradient(
    110deg, 
    var(--color-accent-primary) 20%, 
    #ffffff 50%, 
    var(--color-accent-primary) 80%
  );
  background-size: 200% auto;
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  animation: shine 3s linear infinite;
  text-shadow: 0 0 30px rgba(204, 255, 0, 0.4);
}

@keyframes shine {
  to {
    background-position: 200% center;
  }
}

.carousel-container {
  min-height: 140px; /* Reserve space to prevent jumping */
  justify-content: space-between;
}

.carousel-content {
  height: 90px; /* Fixed height for the changing content */
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.carousel-item {
  display: flex;
  flex-direction: column;
}

.discipline-sub-label {
  font-family: var(--font-family-primary);
  font-size: 1rem;
  color: white;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
  margin-top: -6px; /* Pull closer to the number */
  opacity: 0.8;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.emoji-span {
  font-size: 1.2rem;
  filter: drop-shadow(0 0 5px rgba(255,255,255,0.3));
}

/* Transitions */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
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
  z-index: 100; /* Extremely high z-index */
  margin-top: auto;
  padding-top: var(--spacing-sm);
  pointer-events: auto;
}

.share-btn {
  background: var(--color-accent-primary);
  color: black;
  padding: 12px 24px;
  font-size: 1.1rem;
  font-weight: 800;
  display: block;
  width: 100%;
  text-align: center;
  clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  text-transform: uppercase;
  letter-spacing: 1px;
  pointer-events: auto !important;
  cursor: pointer;
}

.share-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(204, 255, 0, 0.4);
}

.share-btn:active {
  transform: scale(0.98);
}

.share-btn.is-sharing {
  background: var(--color-accent-primary);
  opacity: 0.6;
  transform: none;
  box-shadow: none;
  animation: loaderPulse 1.5s infinite;
}

.capture-link {
  display: none; /* Hidden on screen */
  font-family: var(--font-family-primary);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-accent-primary);
  text-transform: uppercase;
  letter-spacing: 2px;
  text-align: center;
  width: 100%;
  margin-top: var(--spacing-sm);
}

.sharing-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.loader-dots {
  animation: loaderPulse 1.5s infinite;
}

@keyframes loaderPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.sub-stats {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-top: 24px;
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
  background: linear-gradient(
    90deg,
    var(--color-accent-secondary) 0%,
    var(--color-accent-secondary) 40%,
    #FF6699 50%,
    var(--color-accent-secondary) 60%,
    var(--color-accent-secondary) 100%
  );
  background-size: 200% 100%;
  box-shadow: 0 0 20px var(--color-accent-secondary);
  transition: width 1s ease-out;
  position: relative;
  animation: shimmer 3s infinite linear;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
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

.tooltip-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  z-index: 9999;
}

.tooltip-overlay {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 340px;
  max-height: 80vh; /* Prevent going off screen */
  background: #000000;
  border: 1px solid var(--color-accent-primary);
  border-radius: 16px;
  padding: var(--spacing-lg);
  z-index: 10000;
  box-shadow: 0 0 50px rgba(0,0,0,0.9), 0 0 20px rgba(204, 255, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.tooltip-close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  z-index: 10001;
  transition: background 0.2s;
}

.tooltip-close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.tooltip-content {
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Contain scrollable list */
  height: 100%;
}

.tooltip-content h3 {
  font-family: var(--font-family-heading);
  font-size: 1.5rem;
  color: var(--color-accent-primary);
  margin-bottom: var(--spacing-md);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 12px;
  text-align: center;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(204, 255, 0, 0.3);
  flex-shrink: 0; /* Keep header visible */
}

.level-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto; /* Allow scrolling */
  padding-right: 4px; /* Space for scrollbar */
}

.level-item {
  opacity: 0.5;
  transition: all 0.2s;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid transparent;
  background: rgba(255, 255, 255, 0.03);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.level-item.active {
  opacity: 1;
  background: rgba(204, 255, 0, 0.1);
  border: 1px solid var(--color-accent-primary);
  transform: scale(1.02);
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}

.level-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: left;
}

.level-name {
  color: white;
  font-weight: 700;
  font-family: var(--font-family-heading);
  font-size: 1.1rem;
  letter-spacing: 1px;
}

.level-range {
  color: var(--color-accent-primary);
  font-family: var(--font-family-primary); /* Use monospace-like font for numbers if available, or just primary */
  font-weight: 700;
  font-size: 0.9rem;
  background: rgba(0,0,0,0.3);
  padding: 2px 6px;
  border-radius: 4px;
  flex-shrink: 0; /* Prevent range from shrinking */
  white-space: nowrap;
}

.level-item.active .level-name {
  color: var(--color-accent-primary);
  text-shadow: 0 0 10px rgba(204, 255, 0, 0.3);
}

.level-item.active .level-range {
  background: var(--color-accent-primary);
  color: black;
}

.level-desc {
  font-family: var(--font-family-primary);
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  line-height: 1.2;
}

.level-item.active .level-desc {
  color: white;
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
  .share-btn { padding: 8px 16px; font-size: 1rem; }
}

@media (max-height: 750px) {
  .identity-header { margin-top: 80px; }
  .avatar-circle { width: 60px; height: 60px; }
  .last-name { font-size: 3.5rem; }
  .flex-badges-row { margin-bottom: 4px; }
  .stat-box.hero { padding-bottom: var(--spacing-sm); }
  .sub-stats { margin-top: 12px; }
}

@media (max-height: 650px) {
  .identity-header { margin-top: 40px; }
  .avatar-circle { width: 40px; height: 40px; }
  .first-name { font-size: 2rem; }
  .last-name { font-size: 2.5rem; }
  .flex-badges-row { margin-bottom: 0; transform: scale(0.8); }
  .stat-box.hero { padding-bottom: 4px; }
  .sub-stats { margin-top: 4px; }
  .power-badge { padding: 4px 8px; }
  .power-value-glitch { font-size: 1.2rem; }
}

</style>
