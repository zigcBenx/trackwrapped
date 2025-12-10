<template>
  <Transition name="fade">
    <div v-if="isOpen" class="selection-overlay" @click.self="$emit('close')">
      <!-- Coming Soon State -->
      <div v-if="showComingSoon" class="selection-container coming-soon-container">
        <div class="coming-soon-content">
          <div class="icon-wrapper">🚀</div>
          <h2 class="selection-title">Coming Soon</h2>
          <p class="selection-subtitle">
            Lifetime Wrapped is currently under development. <br>
            We're crunching millions of results to bring you the ultimate career retrospective.
          </p>
          
          <button class="select-button primary-button" @click="switchToSeason">
            Show my 2025 Wrapped
          </button>
          
          <button class="text-button" @click="showComingSoon = false">
            Back to Options
          </button>
        </div>
      </div>

      <!-- Selection State -->
      <div v-else class="selection-container">
        <h2 class="selection-title">Choose Your Experience</h2>
        <p class="selection-subtitle">Select the timeframe for your TrackWrapped story</p>
        
        <div class="options-grid">
          <!-- Season Option -->
          <div 
            class="option-card season-card"
            :class="{ selected: selectedOption === 'season' }"
            @click="selectOption('season')"
          >
            <div class="card-header">
              <span class="badge free">Free</span>
              <h3>2025 Season</h3>
            </div>
            <div class="card-content">
              <p>Recap your latest season's highlights, best performances, and key moments.</p>
              <ul class="features-list">
                <li>✨ Season Bests</li>
                <li>📊 Year-to-Date Stats</li>
                <li>🎯 2025 Competitions</li>
              </ul>
            </div>
            <button class="select-button">Select Season</button>
          </div>

          <!-- Lifetime Option -->
          <div 
            class="option-card lifetime-card"
            :class="{ selected: selectedOption === 'lifetime' }"
            @click="selectOption('lifetime')"
          >
            <div class="card-header">
              <span class="badge premium">10€</span>
              <h3>Lifetime Career</h3>
            </div>
            <div class="card-content">
              <p>The ultimate career retrospective. Every race, every record, every rival.</p>
              <ul class="features-list">
                <li>🏆 All-Time Personal Bests</li>
                <li>📈 Complete Career Stats</li>
                <li>⚔️ Full Rivalry History</li>
                <li>🌟 Legacy Analysis</li>
              </ul>
            </div>
            <button class="select-button premium-button">
              Unlock Lifetime
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  isOpen: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
  start: [scope: 'season' | 'lifetime']
}>()

const selectedOption = ref<'season' | 'lifetime' | null>(null)
const isProcessing = ref(false)
const showComingSoon = ref(false)

async function selectOption(option: 'season' | 'lifetime') {
  selectedOption.value = option
  
  if (option === 'lifetime') {
    showComingSoon.value = true
    return
  }
  
  emit('start', option)
}

function switchToSeason() {
  showComingSoon.value = false
  selectOption('season')
}
</script>

<style scoped>
.selection-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
}

.selection-container {
  max-width: 900px;
  width: 100%;
  text-align: center;
}

.selection-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 4rem;
  color: white;
  margin: 0 0 var(--spacing-sm);
  text-transform: uppercase;
  letter-spacing: 2px;
}

.selection-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: var(--spacing-2xl);
}

.options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  perspective: 1000px;
}

.option-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
  position: relative;
  overflow: hidden;
}

.option-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}

.season-card.selected {
  border-color: var(--color-accent-primary);
  box-shadow: 0 0 30px rgba(var(--color-accent-primary-rgb), 0.2);
}

.lifetime-card {
  background: linear-gradient(145deg, rgba(255, 215, 0, 0.05), rgba(0, 0, 0, 0.2));
  border-color: rgba(255, 215, 0, 0.2);
}

.lifetime-card:hover {
  border-color: rgba(255, 215, 0, 0.4);
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.card-header h3 {
  font-size: 2rem;
  font-weight: 800;
  margin: 0;
  color: white;
}

.badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.badge.free {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.badge.premium {
  background: #FFD700;
  color: black;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
}

.card-content p {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: var(--spacing-lg);
  line-height: 1.5;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--spacing-xl);
}

.features-list li {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: var(--spacing-sm);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.select-button {
  width: 100%;
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  border: none;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s;
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.option-card:hover .select-button {
  background: white;
  color: black;
}

.premium-button {
  background: linear-gradient(45deg, #FFD700, #FFA500);
  color: black;
}

.option-card:hover .premium-button {
  background: linear-gradient(45deg, #FFE44D, #FFB732);
  transform: scale(1.02);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .selection-overlay {
    align-items: flex-start;
    padding-top: 10vh;
    overflow-y: auto;
  }

  .selection-container {
    padding-bottom: var(--spacing-2xl);
  }

  .selection-title {
    font-size: 2.5rem;
  }

  .selection-subtitle {
    font-size: 1rem;
    margin-bottom: var(--spacing-xl);
    padding: 0 var(--spacing-md);
  }

  .options-grid {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    max-width: 100%;
    padding: 0 var(--spacing-md);
  }
  
  /* On very small screens or landscape, maybe side-by-side scroll is better? 
     Actually, vertical stack is safer for "selection" to see all options. 
     Let's just make them compact. */
  
  .option-card {
    padding: var(--spacing-lg);
  }

  .card-header h3 {
    font-size: 1.5rem;
  }

  .features-list {
    margin-bottom: var(--spacing-lg);
  }
  
  .features-list li {
    font-size: 0.9rem;
  }
}

/* Horizontal scroll for better "app-like" feel on mobile */
@media (max-width: 600px) {
  .options-grid {
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding: 10px 20px 30px 20px;
    margin: 0 -20px;
    width: calc(100% + 40px);
    gap: 15px;
  }

  .option-card {
    min-width: 85vw;
    scroll-snap-align: center;
    margin-bottom: 0;
  }

}

.coming-soon-container {
  max-width: 600px;
}

.coming-soon-content {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-xl);
  padding: var(--spacing-2xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
}

.icon-wrapper {
  font-size: 4rem;
  margin-bottom: var(--spacing-md);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

.primary-button {
  background: var(--color-accent-primary);
  color: black;
  margin-top: var(--spacing-md);
}

.primary-button:hover {
  background: #00e68a;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 255, 157, 0.3);
}

.text-button {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-family: 'Outfit', sans-serif;
  font-size: 0.9rem;
  cursor: pointer;
  padding: var(--spacing-sm);
  transition: color 0.2s;
}

.text-button:hover {
  color: white;
  text-decoration: underline;
}
</style>
