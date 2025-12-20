<script setup lang="ts">
import { ref } from 'vue'
import SearchInput from '../components/SearchInput.vue'
import ViewStats from '../components/ViewStats.vue'
import Leaderboard from '../components/Leaderboard.vue'
import SeasonTrackingCTA from '../components/SeasonTrackingCTA.vue'
import EmailCollectionModal from '../components/EmailCollectionModal.vue'
import type { Athlete } from '../types/athlete'

const emit = defineEmits<{
  athleteSelect: [athlete: Athlete | { id: number; firstname: string; lastname: string }]
}>()

const isEmailModalOpen = ref(false)

function handleAthleteSelect(athlete: Athlete | { id: number; firstname: string; lastname: string }) {
  emit('athleteSelect', athlete)
}

function openEmailModal() {
  isEmailModalOpen.value = true
}

function closeEmailModal() {
  isEmailModalOpen.value = false
}
</script>

<template>
  <div class="home-view">
    <header class="app-header">
      <div class="title-wrapper">
        <h1 class="app-title">TRACK WRAPPED</h1>
        <div class="year-badge animate-glitch">2025</div>
      </div>
      <p class="app-subtitle">YOUR SEASON. YOUR STORY. <span class="highlight">UNLEASHED.</span></p>
    </header>

    <SearchInput @athlete-select="handleAthleteSelect" />

    <ViewStats />

    <SeasonTrackingCTA @click="openEmailModal" />

    <Leaderboard @athlete-select="handleAthleteSelect" />

    <EmailCollectionModal 
      :is-open="isEmailModalOpen" 
      @close="closeEmailModal" 
    />
  </div>
</template>

<style scoped>
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
  top: 70px;
  right: -30px;
  font-family: var(--font-family-heading);
  font-size: 5rem;
  color: var(--color-accent-primary);
  transform: rotate(-25deg);
  text-shadow: 0 0 10px rgba(204, 255, 0, 0.5);
  z-index: 10;
  font-weight: 600;
  pointer-events: none;
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
  .app-header {
    margin-bottom: var(--spacing-xl);
  }

  .app-title {
    font-size: 3.5rem;
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

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
