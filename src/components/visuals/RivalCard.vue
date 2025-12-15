<template>
  <div class="rival-card">
    <div class="card-content">
      <div class="wanted-label">NEMESIS DETECTED</div>
      
      <div class="rival-avatar">
        <div class="avatar-placeholder">{{ initials }}</div>
      </div>
      
      <h2 class="rival-name">{{ name }}</h2>
      
      <div class="vs-badge">VS</div>
      
      <div class="stats-container">
        <div class="stat-row">
          <span class="stat-label">Head-to-Head</span>
          <span class="stat-value">{{ meetings }} Meetings</span>
        </div>
        <div class="stat-row loss-row">
          <span class="stat-label">Defeats</span>
          <span class="stat-value">{{ losses }} Losses</span>
        </div>
      </div>
      
      <div class="threat-level">
        <span class="threat-label">Threat Level</span>
        <div class="threat-bar">
          <div class="threat-fill"></div>
        </div>
        <span class="threat-value">EXTREME</span>
      </div>
    </div>
    
    <!-- Glitch Effects -->
    <div class="glitch-overlay"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  name: string
  meetings: number // We might need to pass this if available, or estimate
  losses: number
}

const props = defineProps<Props>()

const initials = computed(() => {
  return props.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
})
</script>

<style scoped>
.rival-card {
  width: 100%;
  max-width: 500px;
  background: #0a0a0a;
  border: 2px solid #ff4444;
  border-radius: var(--radius-lg);
  padding: var(--spacing-sm) var(--spacing-md);
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 50px rgba(255, 68, 68, 0.2);
  transform: rotate(-1deg);
  transition: transform 0.3s ease;
}

.rival-card:hover {
  transform: rotate(0deg) scale(1.02);
  box-shadow: 0 0 70px rgba(255, 68, 68, 0.4);
}

.wanted-label {
  font-family: 'Bebas Neue', 'Arial Black', sans-serif; font-weight: 900;
  font-size: 1.3rem;
  color: #ff4444;
  text-align: center;
  letter-spacing: 2px;
  margin-bottom: var(--spacing-xs);
  text-shadow: 0 0 10px rgba(255, 68, 68, 0.5);
  border-bottom: 2px solid #ff4444;
  padding-bottom: var(--spacing-xs);
}

.rival-avatar {
  width: 60px;
  height: 60px;
  background: #1a1a1a;
  border-radius: 50%;
  margin: 0 auto var(--spacing-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #333;
  box-shadow: inset 0 0 20px rgba(0,0,0,0.8);
}

.avatar-placeholder {
  font-family: 'Bebas Neue', 'Arial Black', sans-serif; font-weight: 900;
  font-size: 1.8rem;
  color: #333;
}

.rival-name {
  font-family: 'Bebas Neue', 'Arial Black', sans-serif; font-weight: 900;
  font-size: 1.8rem;
  color: white;
  text-align: center;
  margin: 0 0 var(--spacing-sm);
  line-height: 1;
  text-transform: uppercase;
  word-break: break-word;
}

.vs-badge {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(15deg);
  font-family: 'Bebas Neue', 'Arial Black', sans-serif; font-weight: 900;
  font-size: 5rem;
  color: rgba(255, 255, 255, 0.05);
  pointer-events: none;
  z-index: 0;
}

.stats-container {
  background: #1a1a1a;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-sm);
  position: relative;
  z-index: 1;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xs);
  font-family: 'Inter', sans-serif;
}

.stat-row:last-child {
  margin-bottom: 0;
}

.stat-label {
  color: #888;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

.stat-value {
  color: white;
  font-weight: 700;
  font-size: 1rem;
}

.loss-row .stat-value {
  color: #ff4444;
}

.threat-level {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.threat-label {
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  color: #888;
  text-transform: uppercase;
  white-space: nowrap;
}

.threat-bar {
  flex: 1;
  height: 6px;
  background: #333;
  border-radius: 3px;
  overflow: hidden;
}

.threat-fill {
  width: 90%;
  height: 100%;
  background: linear-gradient(90deg, #ff4444, #ff0000);
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
  animation: pulse 1s infinite;
}

.threat-value {
  font-family: 'Bebas Neue', 'Arial Black', sans-serif; font-weight: 900;
  color: #ff4444;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
}

@keyframes pulse {
  0% { opacity: 0.8; }
  50% { opacity: 1; }
  100% { opacity: 0.8; }
}

@media (max-width: 768px) {
  .rival-name { font-size: 1.5rem; }
  .wanted-label { font-size: 1.1rem; }
  .rival-avatar { width: 50px; height: 50px; }
  .avatar-placeholder { font-size: 1.5rem; }
  .vs-badge { font-size: 4rem; }
  .rival-card { padding: var(--spacing-xs) var(--spacing-sm); }
  .stat-label { font-size: 0.65rem; }
  .stat-value { font-size: 0.9rem; }
}
</style>
