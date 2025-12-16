<script setup lang="ts">
import { ref } from 'vue'
import SearchInput from './components/SearchInput.vue'
import ViewStats from './components/ViewStats.vue'
import Leaderboard from './components/Leaderboard.vue'
import StorySlides from './components/StorySlides.vue'
import type { Athlete } from './types/athlete'

const selectedAthlete = ref<Athlete | null>(null)
const isStoryOpen = ref(false)
const selectedScope = ref<'season' | 'lifetime'>('season')

function handleAthleteSelect(athlete: Athlete | { id: number; firstname: string; lastname: string }) {
  selectedAthlete.value = athlete as Athlete
  selectedScope.value = 'season'
  isStoryOpen.value = true
}

function handleStoryClose() {
  isStoryOpen.value = false
  selectedAthlete.value = null
}
</script>

<template>
  <div class="app">
    <!-- Global Background Pattern -->
    <div class="slanted-bg"></div>
    <div class="vignette-overlay"></div>

    <main class="main-content">
      <div class="container">
        <header class="app-header">
          <div class="title-wrapper">
            <h1 class="app-title">TRACK WRAPPED</h1>
            <div class="year-badge animate-glitch">2025</div>
          </div>
          <p class="app-subtitle">YOUR SEASON. YOUR STORY. <span class="highlight">UNLEASHED.</span></p>
        </header>

        <SearchInput @athlete-select="handleAthleteSelect" />

        <ViewStats />

        <Leaderboard @athlete-select="handleAthleteSelect" />
      </div>
    </main>

    <!-- Story Slides Overlay -->
    <StorySlides
      :athlete-id="selectedAthlete?.id ?? null"
      :athlete-name="`${selectedAthlete?.firstname ?? ''} ${selectedAthlete?.lastname ?? ''}`"
      :is-open="isStoryOpen"
      :scope="selectedScope"
      @close="handleStoryClose"
    />
    <div class="made-in">
      made by <a href="https://benxlabs.com">benx</a> in 🇸🇮
    </div>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  position: relative;
  z-index: 1;
  background-color: var(--color-bg-primary);
  overflow-x: hidden;
}

/* Slanted Background Pattern */
.slanted-bg {
  position: fixed;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(255, 255, 255, 0.03) 10px,
    rgba(255, 255, 255, 0.03) 20px
  );
  transform: rotate(-15deg);
  pointer-events: none;
  z-index: 0;
}

.vignette-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 100%);
  pointer-events: none;
  z-index: 0;
}

.main-content {
  position: relative;
  z-index: 2;
  padding: var(--spacing-2xl) var(--spacing-md);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

.app-header {
  text-align: center;
  margin-bottom: var(--spacing-3xl);
  animation: fadeIn var(--transition-slow) ease-out;
  position: relative;
}

.title-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: var(--spacing-md);
}

.app-title {
  font-family: var(--font-family-heading);
  font-size: clamp(4rem, 10vw, 8rem);
  font-weight: 700;
  letter-spacing: 4px;
  margin: 0;
  line-height: 0.9;
  color: white;
  text-transform: uppercase;
  text-shadow: 4px 4px 0px rgba(255, 255, 255, 0.1);
  transform: skew(-5deg);
}

.year-badge {
  position: absolute;
  top: 70px; /* Moved down to overlap */
  right: -30px; /* Moved left to overlap */
  font-family: var(--font-family-heading);
  font-size: 5rem; /* Bigger */
  color: var(--color-accent-primary);
  transform: rotate(-25deg); /* More tilted */
  text-shadow: 0 0 10px rgba(204, 255, 0, 0.5);
  z-index: 10;
  font-weight: 600;
  pointer-events: none; /* Let clicks pass through to title if needed */
}

.app-subtitle {
  font-family: var(--font-family-heading);
  font-size: 1.5rem;
  color: var(--color-text-secondary);
  font-weight: 400;
  margin: 0;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.highlight {
  color: var(--color-accent-secondary);
  font-weight: 700;
}

@media (max-width: 768px) {
  .main-content {
    padding: var(--spacing-xl) var(--spacing-md);
  }
  
  .app-header {
    margin-bottom: var(--spacing-xl);
  }

  .app-title {
    font-size: 3.5rem; /* Explicit size for mobile to prevent overflow */
  }
  
  .year-badge {
    font-size: 2.5rem;
    right: 0px;
    top: 75px;
    transform: rotate(-25deg);
  }

  .app-subtitle {
    font-size: 1rem;
    padding: 0 var(--spacing-md);
  }
}

.made-in {
  position: relative;
  z-index: 2;
  text-align: center;
  font-family: 'Outfit', sans-serif;
  font-size: 0.7rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 0.5px;
  margin-top: var(--spacing-md);
  text-transform: lowercase;
  padding-bottom: var(--spacing-md);
}

.made-in a {
  color: white;
  text-decoration: none;
  font-weight: 700;
}
</style>
