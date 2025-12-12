<script setup lang="ts">
import { ref } from 'vue'
import SearchInput from './components/SearchInput.vue'
import WrappedSelection from './components/WrappedSelection.vue'
import StorySlides from './components/StorySlides.vue'
import type { Athlete } from './types/athlete'

const selectedAthlete = ref<Athlete | null>(null)
const isStoryOpen = ref(false)
const showSelection = ref(false)
const selectedScope = ref<'season' | 'lifetime'>('season')

function handleAthleteSelect(athlete: Athlete) {
  selectedAthlete.value = athlete
  showSelection.value = true
}

function handleSelectionClose() {
  showSelection.value = false
  selectedAthlete.value = null
}

function handleStoryStart(scope: 'season' | 'lifetime') {
  selectedScope.value = scope
  showSelection.value = false
  isStoryOpen.value = true
}

function handleStoryClose() {
  isStoryOpen.value = false
  selectedAthlete.value = null
}
</script>

<template>
  <div class="app">
    <main class="main-content">
      <div class="container">
        <header class="app-header">
          <h1 class="app-title gradient-text">TrackWrapped</h1>
          <p class="app-subtitle">Discover the world's greatest track & field athletes</p>
        </header>
        
        <SearchInput @athlete-select="handleAthleteSelect" />
      </div>
    </main>
    
    <!-- Selection Overlay -->
    <WrappedSelection
      :is-open="showSelection"
      @close="handleSelectionClose"
      @start="handleStoryStart"
    />

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
}

.main-content {
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
}

.app-title {
  font-size: var(--font-size-4xl);
  font-weight: 900;
  letter-spacing: -0.02em;
  margin: 0;
  line-height: 1;
  margin-bottom: var(--spacing-md);
}

.app-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  font-weight: 400;
  margin: 0;
}

@media (max-width: 768px) {
  .main-content {
    padding: var(--spacing-xl) var(--spacing-md);
  }
  
  .app-header {
    margin-bottom: var(--spacing-xl);
  }
  
  .app-title {
    font-size: var(--font-size-3xl);
  }
  
  .app-subtitle {
    font-size: var(--font-size-base);
  }
}

@media (max-width: 480px) {
  .app-title {
    font-size: var(--font-size-2xl);
  }
}
.made-in {
  text-align: center;
  font-family: 'Outfit', sans-serif;
  font-size: 0.7rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 0.5px;
  margin-top: var(--spacing-md);
  text-transform: lowercase;
}
</style>
