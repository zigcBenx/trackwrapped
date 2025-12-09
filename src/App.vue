<script setup lang="ts">
import { ref } from 'vue'
import SearchInput from './components/SearchInput.vue'
import StorySlides from './components/StorySlides.vue'
import type { Athlete } from './types/athlete'

const selectedAthlete = ref<Athlete | null>(null)
const isStoryOpen = ref(false)

function handleAthleteSelect(athlete: Athlete) {
  selectedAthlete.value = athlete
  isStoryOpen.value = true
}

function handleStoryClose() {
  isStoryOpen.value = false
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
    
    <!-- Story Slides Overlay -->
    <StorySlides
      :athlete-id="selectedAthlete?.id ?? null"
      :athlete-name="`${selectedAthlete?.firstname ?? ''} ${selectedAthlete?.lastname ?? ''}`"
      :is-open="isStoryOpen"
      @close="handleStoryClose"
    />
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
</style>
