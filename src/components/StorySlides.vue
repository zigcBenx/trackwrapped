<template>
  <Transition name="story-fade">
    <div v-if="isOpen" class="story-slides-overlay" @click.self="handleClose">
      <!-- Loader -->
      <StoryLoader v-if="isLoading" />
      
      <!-- Error State -->
      <div v-else-if="error" class="story-error">
        <div class="error-content">
          <div class="error-emoji">😕</div>
          <h2 class="error-title">Oops! Something went wrong</h2>
          <p class="error-message">{{ error }}</p>
          <button class="error-button" @click="handleClose">Close</button>
        </div>
      </div>
      
      <!-- Slides -->
      <div v-else class="story-slides-container">
        <!-- Close Button -->
        <button class="close-button" @click="handleClose" aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>


        
        <!-- Slide Container -->
        <div class="slides-wrapper" @click="handleSlideTap">
          <!-- Progress Indicator (Inside card) -->
          <div class="progress-indicator">
            <div 
              v-for="index in totalSlides" 
              :key="index"
              class="progress-bar-container"
            >
              <div 
                class="progress-bar-fill"
                :class="{ 
                  active: index - 1 === currentSlideIndex,
                  completed: index - 1 < currentSlideIndex,
                  paused: isPaused && index - 1 === currentSlideIndex
                }"
                :style="index - 1 === currentSlideIndex ? { animationDuration: `${currentDuration}ms` } : {}"
                @animationend="handleAnimationEnd(index - 1)"
              ></div>
            </div>
          </div>

          <TransitionGroup name="slide">
            <!-- Welcome Slide -->
            <WelcomeSlide
              v-if="currentSlideIndex === 0 && stats"
              v-show="currentSlideIndex === 0"
              key="welcome"
              :first-name="firstName"
              :last-name="lastName"
              :stats="stats"
              :nickname="nickname"
            />
            
            <!-- Veteran Status Slide (merged Experience + Nickname) -->
            <VeteranStatusSlide
              v-if="currentSlideIndex === 1 && stats"
              v-show="currentSlideIndex === 1"
              key="veteran"
              :years-active="stats.yearsActive"
              :nickname="nickname"
            />
            
            <!-- Discipline Slide -->
            <DisciplineSlide
              v-if="currentSlideIndex === 2 && stats"
              v-show="currentSlideIndex === 2"
              key="discipline"
              :discipline-category="stats.disciplineCategory"
              :main-discipline="stats.mainDiscipline"
            />
            
            <!-- Performance Slide -->
            <PerformanceSlide
              v-if="currentSlideIndex === 3 && stats"
              v-show="currentSlideIndex === 3"
              key="performance"
              :is-improving="stats.isImproving"
              :stats="stats"
            />
            
            <!-- Competition Slide -->
            <CompetitionSlide
              v-if="currentSlideIndex === 4 && stats"
              v-show="currentSlideIndex === 4"
              key="competition"
              :total-competitions="stats.totalCompetitions"
              :competition-frequency="stats.competitionFrequency"
              :heatmap-data="stats.competitionHeatmap"
            />

            <!-- Travel Slide -->
            <TravelSlide
              v-if="currentSlideIndex === 5 && stats"
              v-show="currentSlideIndex === 5"
              key="travel"
              :countries="stats.countries"
              :countries-count="stats.countriesCount"
              :home-country="country"
            />
            
            <!-- World Record Slide -->
            <WorldRecordSlide
              v-if="currentSlideIndex === 6 && stats"
              v-show="currentSlideIndex === 6"
              key="worldrecord"
              :best-performance="stats.bestPerformance"
              :main-discipline="stats.mainDiscipline"
              :gender="sex"
            />
            
            <!-- Victory Rate Slide -->
            <VictoryRateSlide
              v-if="currentSlideIndex === 7 && stats"
              v-show="currentSlideIndex === 7"
              key="victoryrate"
              :victory-rate="stats.victoryRate"
            />
            
            <!-- Nemesis Slide -->
            <NemesisSlide
              v-if="currentSlideIndex === 8 && stats"
              v-show="currentSlideIndex === 8"
              key="nemesis"
              :nemesis="stats.nemesis"
            />
            
            <!-- Rivals Slide -->
            <RivalsSlide
              v-if="currentSlideIndex === 9 && stats"
              v-show="currentSlideIndex === 9"
              key="rivals"
              :top-rivals="stats.topRivals"
            />
            
            <!-- Wind Slide -->
            <WindSlide
              v-if="currentSlideIndex === 10 && stats"
              v-show="currentSlideIndex === 10"
              key="wind"
              :average-wind="stats.averageWind"
              :has-wind-data="stats.hasWindData"
            />
            
            <!-- Share Card Slide (Insights) -->
            <ShareCardSlide
              v-if="currentSlideIndex === 11 && stats"
              v-show="currentSlideIndex === 11"
              key="sharecard"
              :first-name="firstName"
              :last-name="lastName"
              :country="country"
              :nickname="nickname"
              :heatmap-data="stats.competitionHeatmap"
              :total-competitions="stats.totalCompetitions"
              :main-discipline="stats.mainDiscipline"
              :season-best="stats.bestPerformance?.mark || '-'"
              :average-wind="stats.averageWind"
              :victory-rate="stats.victoryRate"
              :athlete-id="athleteId"
            />
          </TransitionGroup>

          <!-- Pause/Play Button (Inside wrapper) -->
          <button class="control-button pause-button" @click="togglePause" :aria-label="isPaused ? 'Play' : 'Pause'">
            <svg v-if="isPaused" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          </button>
        </div>
        
        <!-- Navigation Buttons -->
        <button 
          v-if="currentSlideIndex > 0"
          class="nav-button nav-button-prev"
          @click="previousSlide"
          aria-label="Previous slide"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        
        <button 
          v-if="currentSlideIndex < totalSlides - 1"
          class="nav-button nav-button-next"
          @click="nextSlide"
          aria-label="Next slide"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import StoryLoader from './StoryLoader.vue'
import { getCompleteAthleteData } from '@/services/athleteDetailsService'
import { processAthleteData } from '@/utils/storyGenerator'
import { 
  getExperienceSequence, 
  getDisciplineSequence, 
  getPerformanceSequence, 
  getCompetitionSequence 
} from '@/utils/jokeGenerator'
import { 
  getWorldRecordSequence, 
  getVictoryRateSequence, 
  getNemesisSequence, 
  getTopRivalsSequence, 
  getWindSpeedSequence,
  getTravelSequence
} from '@/utils/newSlideJokes'
import { generateNickname } from '@/utils/jokeGenerator'
import type { ProcessedAthleteStats } from '@/types/athleteDetails'

// Import individual slide components
import WelcomeSlide from './slides/WelcomeSlide.vue'
import VeteranStatusSlide from './slides/VeteranStatusSlide.vue'
import DisciplineSlide from './slides/DisciplineSlide.vue'
import PerformanceSlide from './slides/PerformanceSlide.vue'
import CompetitionSlide from './slides/CompetitionSlide.vue'
import TravelSlide from './slides/TravelSlide.vue'
import WorldRecordSlide from './slides/WorldRecordSlide.vue'
import VictoryRateSlide from './slides/VictoryRateSlide.vue'
import NemesisSlide from './slides/NemesisSlide.vue'
import RivalsSlide from './slides/RivalsSlide.vue'
import WindSlide from './slides/WindSlide.vue'
import ShareCardSlide from './slides/ShareCardSlide.vue'

interface Props {
  athleteId: number | null
  athleteName: string
  isOpen: boolean
  scope: 'season' | 'lifetime'
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const isLoading = ref(false)
const error = ref<string | null>(null)
const currentSlideIndex = ref(0)
const currentDuration = ref(5000)
const isPaused = ref(false)
let autoplayTimer: any = null

// Data
const firstName = ref('')
const lastName = ref('')
const country = ref('')
const sex = ref<string | null>(null)
const stats = ref<ProcessedAthleteStats | null>(null)
const nickname = ref('')

// Total number of slides
const totalSlides = 12

// Watch for athlete changes and open state
watch([() => props.athleteId, () => props.isOpen], async ([newId, newIsOpen]) => {
  if (newId && newIsOpen) {
    await loadAthleteStory(newId)
  } else if (!newIsOpen) {
    stopAutoplay()
  }
}, { immediate: true })

// Watch for slide changes to restart autoplay
watch(currentSlideIndex, () => {
  if (props.isOpen && !isLoading.value) {
    startAutoplay()
  }
})

async function loadAthleteStory(athleteId: number) {
  isLoading.value = true
  error.value = null
  currentSlideIndex.value = 0
  
  try {
    const { details, results } = await getCompleteAthleteData(athleteId, props.scope)
    const processedStats = processAthleteData(details, results)
    
    // Store data
    firstName.value = details.firstname
    lastName.value = details.lastname
    country.value = details.country
    sex.value = details.sex
    stats.value = processedStats
    nickname.value = generateNickname(processedStats, details.firstname)
    
    // Start autoplay for first slide
    startAutoplay()
  } catch (err) {
    error.value = 'Failed to load athlete data. Please try again.'
    console.error('Error loading athlete story:', err)
  } finally {
    isLoading.value = false
  }
}

function calculateSlideDuration(index: number): number {
  if (!stats.value) return 5000
  
  const BASE_DELAY = 500 // Initial delay
  const LINE_DELAY = 1500 // Time per line
  const REVEAL_DELAY = 2000 // Wait before reveal
  const REVEAL_ANIM = 1000 // Reveal animation time
  const READING_TIME = 5000 // Increased from 2000 to 5000 for more time
  
  const calculateSequenceDuration = (lines: string[]) => {
    return BASE_DELAY + ((lines.length - 1) * LINE_DELAY) + REVEAL_DELAY + REVEAL_ANIM + READING_TIME
  }

  switch (index) {
    case 0: // Welcome
      return 6000 // Static slide
      
    case 1: // Veteran Status
      return calculateSequenceDuration(getExperienceSequence(stats.value.yearsActive))
      
    case 2: // Discipline
      return calculateSequenceDuration(getDisciplineSequence(stats.value.disciplineCategory, stats.value.mainDiscipline))
      
    case 3: // Performance
      return calculateSequenceDuration(getPerformanceSequence(stats.value.isImproving, stats.value))
      
    case 4: // Competition
      return calculateSequenceDuration(getCompetitionSequence(stats.value.competitionFrequency, stats.value.totalCompetitions))

    case 5: // Travel
      return calculateSequenceDuration(getTravelSequence(stats.value.countriesCount, stats.value.countriesCount === 1 && stats.value.countries[0] === country.value, country.value))
      
    case 6: // World Record
      return calculateSequenceDuration(getWorldRecordSequence(stats.value.bestPerformance, stats.value.mainDiscipline))
      
    case 7: // Victory Rate
      return calculateSequenceDuration(getVictoryRateSequence(stats.value.victoryRate))
      
    case 8: // Nemesis
      return calculateSequenceDuration(getNemesisSequence(stats.value.nemesis))
      
    case 9: // Rivals
      return calculateSequenceDuration(getTopRivalsSequence(stats.value.topRivals))
      
    case 10: // Wind
      return calculateSequenceDuration(getWindSpeedSequence(stats.value.averageWind, stats.value.hasWindData))
      
    case 11: // Share Card
      return 10000 // Give more time for the final card
      
    default:
      return 5000
  }
}

function startAutoplay() {
  stopAutoplay()
  isPaused.value = false
  currentDuration.value = calculateSlideDuration(currentSlideIndex.value)
  
  // The actual advancement is handled by the animationend event on the progress bar
  // But we keep a backup timer just in case, slightly longer than the animation
  autoplayTimer = setTimeout(() => {
    nextSlide()
  }, currentDuration.value + 100)
}

function stopAutoplay() {
  if (autoplayTimer) {
    clearTimeout(autoplayTimer)
    autoplayTimer = null
  }
}

function togglePause() {
  isPaused.value = !isPaused.value
  if (isPaused.value) {
    stopAutoplay()
  } else {
    // Resume logic: we rely on the CSS animation resuming
    // We don't set a backup timer here to avoid complexity with remaining time
    // The animationend event will still trigger nextSlide
  }
}

function handleAnimationEnd(index: number) {
  if (index === currentSlideIndex.value && !isPaused.value) {
    nextSlide()
  }
}

function nextSlide() {
  if (currentSlideIndex.value < totalSlides - 1) {
    currentSlideIndex.value++
  }
}

function previousSlide() {
  if (currentSlideIndex.value > 0) {
    currentSlideIndex.value--
  }
}

function handleSlideTap(event: MouseEvent) {
  // Ignore if clicking a button or interactive element
  const target = event.target as HTMLElement
  if (target.closest('button') || target.closest('.interactive')) return

  const wrapper = event.currentTarget as HTMLElement
  const rect = wrapper.getBoundingClientRect()
  const x = event.clientX - rect.left
  
  if (x < rect.width / 2) {
    previousSlide()
  } else {
    nextSlide()
  }
}

function handleClose() {
  stopAutoplay()
  emit('close')
  currentSlideIndex.value = 0
}

// Keyboard navigation
function handleKeydown(event: KeyboardEvent) {
  if (!props.isOpen) return
  
  if (event.key === 'ArrowRight') {
    nextSlide()
  } else if (event.key === 'ArrowLeft') {
    previousSlide()
  } else if (event.key === 'Escape') {
    handleClose()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.story-slides-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.95);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.story-slides-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slides-wrapper {
  width: 100%;
  max-width: 450px;
  height: 85vh;
  max-height: 900px;
  aspect-ratio: 9/16;
  position: relative;
}

.progress-indicator {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 4px;
  z-index: 100;
  width: 90%;
  justify-content: center;
}

.progress-bar-container {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar-fill {
  width: 0%;
  height: 100%;
  background: white;
  border-radius: 2px;
}

.progress-bar-fill.completed {
  width: 100%;
}

.progress-bar-fill.active {
  animation-name: fillProgress;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

.progress-bar-fill.paused {
  animation-play-state: paused;
}

@keyframes fillProgress {
  from { width: 0%; }
  to { width: 100%; }
}

.close-button,
.control-button {
  position: fixed;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-base);
  z-index: 10001;
}

.close-button {
  top: 30px;
  right: 30px;
}

.pause-button {
  position: absolute;
  top: auto;
  bottom: 20px;
  right: 20px;
  z-index: 100;
}

.close-button:hover,
.control-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-base);
  z-index: 100;
}

.nav-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-50%) scale(1.1);
}

.nav-button-prev {
  left: calc(50% - 225px - 80px); /* Card half width + gap */
}

.nav-button-next {
  right: calc(50% - 225px - 80px);
}

@media (max-width: 768px) {
  .slides-wrapper {
    max-width: 100%;
    height: 100%;
    max-height: none;
    aspect-ratio: auto;
  }
  
  .nav-button {
    display: none; /* Hide nav buttons on mobile, use swipe/tap */
  }
  
  .progress-indicator {
    top: var(--spacing-lg);
    width: calc(100% - 40px);
  }
}

/* Error State */
.story-error {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.error-content {
  text-align: center;
  padding: var(--spacing-xl);
}

.error-emoji {
  font-size: 5rem;
  margin-bottom: var(--spacing-lg);
}

.error-title {
  font-size: var(--font-size-2xl);
  font-weight: 800;
  color: white;
  margin: 0 0 var(--spacing-md);
}

.error-message {
  font-size: var(--font-size-lg);
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 var(--spacing-xl);
}

.error-button {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: white;
  color: #667eea;
  border: none;
  border-radius: var(--radius-full);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
}

.error-button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

/* Transitions */
.story-fade-enter-active,
.story-fade-leave-active {
  transition: opacity var(--transition-base);
}

.story-fade-enter-from,
.story-fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}

@media (max-width: 768px) {
  .close-button,
  .control-button,
  .nav-button {
    width: 40px;
    height: 40px;
  }
  
  .close-button {
    top: var(--spacing-md);
    right: var(--spacing-md);
  }

  .pause-button {
    top: auto;
    bottom: var(--spacing-md);
    right: var(--spacing-md);
  }
  
  .progress-indicator {
    top: var(--spacing-md);
  }
  
  .progress-bar {
    width: 30px;
  }
  
  .nav-button-prev {
    left: var(--spacing-md);
  }
  
  .nav-button-next {
    right: var(--spacing-md);
  }
}
</style>
