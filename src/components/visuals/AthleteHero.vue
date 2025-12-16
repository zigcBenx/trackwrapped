<template>
  <div class="athlete-hero">
    <!-- Dynamic Silhouette Background -->
    <div class="silhouette-container" :class="disciplineCategory">
      <div class="silhouette"></div>
    </div>

    <!-- Wrapped Badge -->
    <div class="wrapped-badge slam-in" style="animation-delay: 800ms">
      2025 WRAPPED
    </div>

    <!-- Massive Typography -->
    <div class="hero-content">
      <h1 class="hero-name">
        <span class="first-name slide-in-left">{{ firstName }}</span>
        <span class="last-name slide-in-right">{{ lastName }}</span>
      </h1>
      
      <div class="hero-stats fade-in-up">
        <div class="hero-stat">
          <span class="stat-number">{{ totalCompetitions }}</span>
          <span class="stat-label">Competitions</span>
        </div>
        <div class="hero-stat">
          <span class="stat-number">{{ yearsActive }}</span>
          <span class="stat-label">Years Active</span>
        </div>
      </div>

      <div class="aka-section fade-in-up" style="animation-delay: 400ms">
        <span class="aka-label">KNOWN AS</span>
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
  opacity: 0.3;
  mix-blend-mode: screen;
  pointer-events: none;
}

.silhouette {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: contrast(1.5) brightness(0.6) grayscale(100%);
}

/* Define silhouette images based on category */
.sprint .silhouette {
  background-image: radial-gradient(circle at 70% 30%, var(--color-accent-primary) 0%, transparent 60%),
                    linear-gradient(45deg, transparent 40%, var(--color-accent-secondary) 100%);
}

.distance .silhouette {
  background-image: radial-gradient(circle at 30% 40%, var(--color-accent-tertiary) 0%, transparent 60%);
}

.jump .silhouette {
  background-image: radial-gradient(circle at 50% 20%, var(--color-accent-primary) 0%, transparent 70%);
}

.throw .silhouette {
  background-image: radial-gradient(circle at 80% 50%, var(--color-accent-secondary) 0%, transparent 60%);
}

.wrapped-badge {
  position: absolute;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  background: white;
  color: black;
  font-family: var(--font-family-heading);
  font-size: 1.5rem;
  padding: 4px 12px;
  transform: rotate(5deg);
  z-index: 10;
  font-weight: 700;
  box-shadow: 4px 4px 0 var(--color-accent-secondary);
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
  line-height: 0.8;
  text-transform: uppercase;
  font-family: var(--font-family-heading);
  margin-bottom: var(--spacing-xl);
  transform: rotate(-2deg);
  width: 100%;
}

.first-name {
  font-size: clamp(3rem, 12vw, 8rem);
  color: transparent;
  -webkit-text-stroke: 2px white;
  letter-spacing: 2px;
  white-space: nowrap;
  display: block;
}

.last-name {
  font-size: clamp(4rem, 15vw, 10rem);
  color: var(--color-accent-primary);
  font-weight: 700;
  letter-spacing: -2px;
  text-shadow: 8px 8px 0px rgba(255, 255, 255, 0.1);
  white-space: nowrap;
  display: block;
  margin-left: var(--spacing-md);
}

.hero-stats {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-lg);
  border-top: 4px solid white;
  padding-top: var(--spacing-lg);
  width: 100%;
}

.hero-stat {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.stat-label {
  font-family: var(--font-family-primary);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--color-text-secondary);
  margin-top: 4px;
  font-weight: 700;
}

.stat-number {
  font-family: var(--font-family-heading);
  font-size: 4rem;
  line-height: 0.9;
  color: white;
}

.aka-section {
  text-align: center;
  padding-top: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  align-items: center; /* Fixed alignment */
}

.aka-label {
  font-family: var(--font-family-heading);
  font-size: 1.2rem;
  color: var(--color-accent-secondary);
  margin-bottom: 0;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.aka-value {
  font-family: var(--font-family-heading);
  font-size: 3rem;
  color: white;
  letter-spacing: 1px;
  line-height: 1;
}

/* Animations */
.slide-in-left {
  animation: slideInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
  transform: translateX(-50px);
}

.slide-in-right {
  animation: slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
  opacity: 0;
  transform: translateX(50px);
}

.fade-in-up {
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
  opacity: 0;
  transform: translateY(30px);
}

.slam-in {
  animation: slamIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  opacity: 0;
  transform: scale(2);
}

@keyframes slideInLeft {
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slideInRight {
  to { transform: translateX(0); opacity: 1; }
}

@keyframes fadeInUp {
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slamIn {
  to { opacity: 1; transform: scale(1) rotate(5deg); }
}

@media (max-width: 768px) {
  .athlete-hero {
    padding: var(--spacing-md);
  }
  
  .first-name {
    font-size: 3.5rem;
  }
  
  .last-name {
    font-size: 4.5rem;
    margin-left: var(--spacing-sm);
  }
  
  .stat-number { font-size: 3rem; }
  
  .aka-value { font-size: 2.5rem; }
}
</style>
