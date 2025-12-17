<template>
  <SlideWrapper 
    background="#000000"
    type="experience"
    :showPattern="true"
    @click="handleTap"
  >
    <!-- Buildup Phase -->
    <div v-if="phase === 'buildup'" class="buildup-container">
      <div 
        v-for="(line, index) in sequence" 
        :key="index"
        class="story-line"
        :class="{ 'visible': index <= currentLineIndex }"
      >
        {{ line }}
      </div>
    </div>

    <!-- Reveal Phase -->
    <div v-else class="reveal-container">
      <div class="slide-emoji slam-in" style="animation-delay: 0ms">📅</div>
      <h1 class="slide-title fade-in-up" style="animation-delay: 150ms">{{ yearsActive }} YEARS IN THE GAME</h1>
      <div class="massive-stat slam-in" style="animation-delay: 300ms">
        <div class="stat-value-massive neon-yellow">{{ yearsActive }}</div>
        <div class="stat-label-massive">YEARS ACTIVE</div>
        <div class="stat-badge fade-in-up" style="animation-delay: 600ms">
          Veteran status unlocked! 🔓
        </div>
      </div>
    </div>
  </SlideWrapper>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SlideWrapper from './SlideWrapper.vue'
import { getExperienceSequence } from '@/utils/jokeGenerator'

interface Props {
  yearsActive: number
}

const props = defineProps<Props>()

const phase = ref<'buildup' | 'reveal'>('buildup')
const currentLineIndex = ref(-1)
const sequence = getExperienceSequence(props.yearsActive)

let sequenceTimer: any = null

function startSequence() {
  phase.value = 'buildup'
  currentLineIndex.value = -1

  const advance = () => {
    if (currentLineIndex.value < sequence.length - 1) {
      currentLineIndex.value++
      sequenceTimer = setTimeout(advance, 1500)
    } else {
      sequenceTimer = setTimeout(() => {
        phase.value = 'reveal'
      }, 2000)
    }
  }

  sequenceTimer = setTimeout(advance, 500)
}

function handleTap() {
  if (phase.value === 'buildup') {
    clearTimeout(sequenceTimer)
    phase.value = 'reveal'
  }
}

onMounted(() => {
  startSequence()
})
</script>

<style scoped>
.buildup-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  min-height: 300px;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.story-line {
  font-family: 'Inter', sans-serif;
  font-size: 3rem;
  font-weight: 900;
  color: white;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  letter-spacing: -1px;
  text-transform: uppercase;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.story-line.visible {
  opacity: 1;
  transform: translateY(0);
}

.reveal-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}

.slide-emoji {
  font-size: 6rem;
  margin-bottom: var(--spacing-xl);
  filter: drop-shadow(0 0 30px rgba(255, 215, 0, 0.4));
}

.slide-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 4rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: white;
  margin-bottom: var(--spacing-xl);
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
  text-align: center;
  line-height: 0.9;
  max-width: 90%;
}

.massive-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: skew(-5deg);
}

.stat-value-massive {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 16rem;
  line-height: 0.8;
  color: white;
  text-shadow: 
    8px 8px 0px rgba(255, 255, 255, 0.1),
    0 0 40px rgba(255, 255, 255, 0.2);
}

.neon-yellow {
  color: #FFD700;
  text-shadow: 
    4px 4px 0px rgba(255, 255, 255, 0.2),
    0 0 30px rgba(255, 215, 0, 0.6);
}

.stat-label-massive {
  font-family: 'Inter', sans-serif;
  font-size: 2.5rem;
  font-weight: 900;
  text-transform: uppercase;
  color: white;
  letter-spacing: 6px;
  margin-top: var(--spacing-md);
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
}

.stat-badge {
  margin-top: var(--spacing-xl);
  background: white;
  color: black;
  padding: 1rem 2rem;
  font-family: 'Inter', sans-serif;
  font-weight: 900;
  text-transform: uppercase;
  font-size: 1.4rem;
  transform: skew(-5deg);
  box-shadow: 
    8px 8px 0px var(--color-accent-primary),
    0 0 30px rgba(255, 255, 255, 0.4);
  letter-spacing: 1px;
  border: 2px solid white;
}

/* Animations */
.slam-in {
  animation: slamIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  opacity: 0;
  transform: scale(3);
}

@keyframes slamIn {
  to {
    opacity: 1;
    transform: scale(1) skew(-5deg);
  }
}

.fade-in-up {
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
  transform: translateY(30px);
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .story-line { font-size: 2rem; }
  .slide-title { font-size: 3rem; }
  .stat-value-massive { font-size: 12rem; }
  .stat-label-massive { font-size: 1.8rem; }
  .stat-badge { font-size: 1.1rem; padding: 0.8rem 1.5rem; }
}
</style>
