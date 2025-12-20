<script setup lang="ts">
import Leaderboard from '../components/Leaderboard.vue'
import TravelLeaderboard from '../components/TravelLeaderboard.vue'
import type { Athlete } from '../types/athlete'

const emit = defineEmits<{
  athleteSelect: [athlete: Athlete | { id: number; firstname: string; lastname: string }]
}>()

function handleAthleteSelect(athlete: Athlete | { id: number; firstname: string; lastname: string }) {
  emit('athleteSelect', athlete)
}
</script>

<template>
  <div class="leaderboards-view">
    <div class="scanlines"></div>
    <header class="page-header">
      <div class="header-content">
        <h1 class="page-title animate-glitch">HALL OF FAME</h1>
        <div class="title-accent"></div>
        <p class="page-subtitle">THE ELITE. THE LEGENDS. <span class="highlight">THE UNSTOPPABLE.</span></p>
      </div>
    </header>

    <div class="leaderboards-grid">
      <Leaderboard @athlete-select="handleAthleteSelect" />
      
      <TravelLeaderboard @athlete-select="handleAthleteSelect" />
    </div>
  </div>
</template>

<style scoped>
.leaderboards-view {
  position: relative;
  min-height: 100vh;
  padding-bottom: var(--spacing-3xl);
}

.scanlines {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 50%,
    rgba(255, 255, 255, 0.02) 50%
  );
  background-size: 100% 4px;
  pointer-events: none;
  z-index: 1;
}

.page-header {
  text-align: center;
  margin-bottom: var(--spacing-3xl);
  padding-top: var(--spacing-2xl);
  position: relative;
  z-index: 2;
}

.header-content {
  display: inline-block;
  position: relative;
}

.page-title {
  font-family: var(--font-family-heading);
  font-size: clamp(4rem, 12vw, 10rem);
  font-weight: 700;
  letter-spacing: -2px;
  margin: 0;
  color: white;
  text-transform: uppercase;
  line-height: 0.8;
  transform: skew(-10deg);
  text-shadow: 
    4px 4px 0px var(--color-accent-secondary),
    -4px -4px 0px var(--color-accent-tertiary);
}

.title-accent {
  position: absolute;
  bottom: -10px;
  right: -20px;
  width: 100px;
  height: 10px;
  background: var(--color-accent-primary);
  transform: skew(-10deg);
}

.page-subtitle {
  font-family: var(--font-family-heading);
  font-size: 1.8rem;
  color: var(--color-text-secondary);
  font-weight: 400;
  margin: var(--spacing-md) 0 0 0;
  letter-spacing: 4px;
  text-transform: uppercase;
  transform: skew(-5deg);
}

.highlight {
  color: var(--color-accent-primary);
  font-weight: 700;
}

.leaderboards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-xl);
  margin-top: var(--spacing-xl);
  position: relative;
  z-index: 2;
}

@media (min-width: 768px) {
  .leaderboards-grid {
    grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
    gap: var(--spacing-3xl);
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 3rem;
  }

  .page-subtitle {
    font-size: 1rem;
    letter-spacing: 1px;
  }
}
</style>
