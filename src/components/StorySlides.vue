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
        
        <!-- Progress Indicator -->
        <div class="progress-indicator">
          <div 
            v-for="index in totalSlides" 
            :key="index"
            class="progress-bar"
            :class="{ active: index - 1 === currentSlideIndex }"
          ></div>
        </div>
        
        <!-- Slide Container -->
        <div class="slides-wrapper">
          <TransitionGroup name="slide">
            <!-- Welcome Slide -->
            <WelcomeSlide
              v-if="currentSlideIndex === 0 && stats"
              v-show="currentSlideIndex === 0"
              key="welcome"
              :first-name="firstName"
              :last-name="lastName"
              :stats="stats"
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
            
            <!-- World Record Slide -->
            <WorldRecordSlide
              v-if="currentSlideIndex === 5 && stats"
              v-show="currentSlideIndex === 5"
              key="worldrecord"
              :best-performance="stats.bestPerformance"
              :main-discipline="stats.mainDiscipline"
            />
            
            <!-- Victory Rate Slide -->
            <VictoryRateSlide
              v-if="currentSlideIndex === 6 && stats"
              v-show="currentSlideIndex === 6"
              key="victoryrate"
              :victory-rate="stats.victoryRate"
            />
            
            <!-- Nemesis Slide -->
            <NemesisSlide
              v-if="currentSlideIndex === 7 && stats"
              v-show="currentSlideIndex === 7"
              key="nemesis"
              :nemesis="stats.nemesis"
            />
            
            <!-- Rivals Slide -->
            <RivalsSlide
              v-if="currentSlideIndex === 8 && stats"
              v-show="currentSlideIndex === 8"
              key="rivals"
              :top-rivals="stats.topRivals"
            />
            
            <!-- Wind Slide -->
            <WindSlide
              v-if="currentSlideIndex === 9 && stats"
              v-show="currentSlideIndex === 9"
              key="wind"
              :average-wind="stats.averageWind"
              :has-wind-data="stats.hasWindData"
            />
            
            <!-- Finale Slide -->
            <FinaleSlide
              v-if="currentSlideIndex === 10 && stats"
              v-show="currentSlideIndex === 10"
              key="finale"
              :stats="stats"
            />
          </TransitionGroup>
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
import { generateNickname } from '@/utils/jokeGenerator'
import type { ProcessedAthleteStats } from '@/types/athleteDetails'

// Import individual slide components
import WelcomeSlide from './slides/WelcomeSlide.vue'
import VeteranStatusSlide from './slides/VeteranStatusSlide.vue'
import DisciplineSlide from './slides/DisciplineSlide.vue'
import PerformanceSlide from './slides/PerformanceSlide.vue'
import CompetitionSlide from './slides/CompetitionSlide.vue'
import WorldRecordSlide from './slides/WorldRecordSlide.vue'
import VictoryRateSlide from './slides/VictoryRateSlide.vue'
import NemesisSlide from './slides/NemesisSlide.vue'
import RivalsSlide from './slides/RivalsSlide.vue'
import WindSlide from './slides/WindSlide.vue'
import FinaleSlide from './slides/FinaleSlide.vue'

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

// Data
const firstName = ref('')
const lastName = ref('')
const stats = ref<ProcessedAthleteStats | null>(null)
const nickname = ref('')

// Total number of slides
const totalSlides = 11

// Watch for athlete changes and open state
watch([() => props.athleteId, () => props.isOpen], async ([newId, newIsOpen]) => {
  if (newId && newIsOpen) {
    await loadAthleteStory(newId)
  }
}, { immediate: true })

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
    stats.value = processedStats
    nickname.value = generateNickname(processedStats, details.firstname)
  } catch (err) {
    error.value = 'Failed to load athlete data. Please try again.'
    console.error('Error loading athlete story:', err)
  } finally {
    isLoading.value = false
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

function handleClose() {
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
  max-width: 1200px;
  margin: 0 auto;
}

.close-button {
  position: absolute;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-base);
  z-index: 100;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.progress-indicator {
  position: absolute;
  top: var(--spacing-lg);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: var(--spacing-xs);
  z-index: 100;
}

.progress-bar {
  width: 40px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-full);
  transition: all var(--transition-base);
}

.progress-bar.active {
  background: white;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.slides-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-base);
  z-index: 100;
}

.nav-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-50%) scale(1.1);
}

.nav-button-prev {
  left: var(--spacing-lg);
}

.nav-button-next {
  right: var(--spacing-lg);
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
  .nav-button {
    width: 40px;
    height: 40px;
  }
  
  .close-button {
    top: var(--spacing-md);
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
