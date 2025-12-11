<template>
  <div class="athlete-hero">
    <!-- Dynamic Silhouette Background -->
    <div class="silhouette-container" :class="disciplineCategory">
      <div class="silhouette"></div>
    </div>

    <!-- Massive Typography -->
    <div class="hero-content">
      <h1 class="hero-name">
        <span class="first-name">{{ firstName }}</span>
        <span class="last-name">{{ lastName }}</span>
      </h1>
      
      <div class="hero-stats">
        <div class="hero-stat">
          <span class="stat-number">{{ totalCompetitions }}</span>
          <span class="stat-label">Competitions</span>
        </div>
        <div class="hero-stat">
          <span class="stat-number">{{ yearsActive }}</span>
          <span class="stat-label">Years Active</span>
        </div>
      </div>

      <div class="aka-section">
        <span class="aka-label">aka</span>
        <span class="aka-value">{{ nickname }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  firstName: string
  lastName: string
  disciplineCategory: 'sprint' | 'distance' | 'jump' | 'throw' | 'combined'
  totalCompetitions: number
  yearsActive: number
  nickname: string
}

defineProps<Props>()
</script>

<style scoped>
.athlete-hero {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--spacing-xl);
}

/* Silhouette Backgrounds */
.silhouette-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  opacity: 0.4;
  mix-blend-mode: overlay;
  pointer-events: none;
}

.silhouette {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: contrast(1.2) brightness(0.8);
}

/* Define silhouette images based on category (using CSS gradients/shapes for now, ideally SVGs) */
.sprint .silhouette {
  background-image: radial-gradient(circle at 70% 30%, rgba(255,255,255,0.8) 0%, transparent 60%),
                    linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 100%);
}

.distance .silhouette {
  background-image: radial-gradient(circle at 30% 40%, rgba(255,255,255,0.8) 0%, transparent 60%);
}

.jump .silhouette {
  background-image: radial-gradient(circle at 50% 20%, rgba(255,255,255,0.8) 0%, transparent 70%);
}

.throw .silhouette {
  background-image: radial-gradient(circle at 80% 50%, rgba(255,255,255,0.8) 0%, transparent 60%);
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: left;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
}

.hero-name {
  display: flex;
  flex-direction: column;
  line-height: 0.9;
  text-transform: uppercase;
  font-family: 'Bebas Neue', sans-serif;
  margin-bottom: var(--spacing-xl);
  transform: rotate(-2deg);
}

.first-name {
  font-size: 3rem;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 2px;
  animation: slideInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.last-name {
  font-size: 4rem; /* Reduced from 4.5rem */
  color: white;
  font-weight: 900;
  letter-spacing: -2px;
  text-shadow: 4px 4px 0px rgba(0,0,0,0.3);
  animation: slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s backwards;
  white-space: nowrap; /* Force single line */
}

.hero-stats {
  display: flex;
  justify-content: space-between; /* Better alignment */
  gap: var(--spacing-lg);
  margin-top: var(--spacing-lg);
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s backwards;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: var(--spacing-lg);
}

.hero-stat {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.stat-label {
  font-family: 'Outfit', sans-serif;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 4px;
}

.stat-number {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 3.5rem;
  line-height: 1;
  color: #00ff9d;
}

.aka-section {
  margin-top: auto; /* Push to bottom */
  text-align: center;
  padding-top: var(--spacing-xl);
  animation: fadeIn 1s ease 0.5s backwards;
}

.aka-label {
  display: block;
  font-family: 'Outfit', sans-serif;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 4px;
  font-style: italic;
}

.aka-value {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2rem;
  color: white;
  letter-spacing: 1px;
}

@keyframes slideInLeft {
  from { transform: translateX(-100px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slideInRight {
  from { transform: translateX(100px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes fadeInUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (max-width: 768px) {
  .first-name { font-size: 2.5rem; }
  .last-name { font-size: 4rem; }
  .stat-number { font-size: 3rem; }
}
</style>
