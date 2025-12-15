<template>
  <SlideWrapper 
    background="linear-gradient(135deg, #22d3ee 0%, #2563eb 50%, #d946ef 100%)"
    type="veteran"
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
      <div class="slide-emoji fade-in-up" style="animation-delay: 0ms">📅</div>
      <h1 class="slide-title fade-in-up" style="animation-delay: 150ms">{{ yearsActive }} Years in Track & Field</h1>

      <div class="massive-stat fade-in-up" style="animation-delay: 300ms">
        <div class="stat-value-massive">{{ yearsActive }}</div>
        <div class="stat-label-massive">YEARS ACTIVE</div>
        <div class="stat-subtext">{{ veteranJoke }}</div>
      </div>
    </div>
  </SlideWrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import SlideWrapper from './SlideWrapper.vue'

interface Props {
  yearsActive: number
  nickname: string
}

const props = defineProps<Props>()

const phase = ref<'buildup' | 'reveal'>('buildup')
const currentLineIndex = ref(-1)

// Generate sequence based on years
const sequence = computed(() => {
  const lines = ["You've been on the track scene for a while..."]
  
  if (props.yearsActive <= 2) {
    lines.push("Just getting started!")
    lines.push("Fresh legs, big dreams 👟")
  } else if (props.yearsActive <= 5) {
    lines.push("Finding your rhythm...")
    lines.push("No longer a rookie 📚")
  } else if (props.yearsActive <= 10) {
    lines.push("Seen a lot of starting lines...")
    lines.push("Veteran status loading... 🏠")
  } else {
    lines.push("Longer than some competitors have been alive!")
    lines.push("Is retirement knocking? (Jk) 🏛️")
  }
  
  return lines
})

// Generate joke based on years (from spec)
const veteranJoke = computed(() => {
  if (props.yearsActive <= 2) {
    return "Fresh legs! The track is your playground 🏃"
  } else if (props.yearsActive <= 5) {
    return "Getting serious! You know your way around a starting block 💪"
  } else if (props.yearsActive <= 10) {
    return "Veteran status unlocked! You've seen enough starting blocks to build a house 🏠"
  } else {
    return "Track legend! You remember when timing chips were optional ⏱️"
  }
})

let sequenceTimer: any = null

function startSequence() {
  phase.value = 'buildup'
  currentLineIndex.value = -1
  
  const advance = () => {
    if (currentLineIndex.value < sequence.value.length - 1) {
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
}

.story-line {
  font-family: 'Inter', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.story-line.visible {
  opacity: 1;
  transform: translateY(0);
}

.reveal-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.slide-emoji {
  font-size: 4rem; /* Reduced from 6rem */
  margin-bottom: var(--spacing-lg);
  filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.3));
}

.slide-title {
  font-family: 'Inter', sans-serif;
  font-size: 1.2rem; /* Reduced from 1.5rem */
  text-transform: uppercase;
  letter-spacing: 4px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.massive-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.stat-value-massive {
  font-family: 'Bebas Neue', 'Arial Black', sans-serif; font-weight: 900;
  font-size: 5rem; /* Reduced from 6rem */
  line-height: 0.9;
  color: white;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
}

.stat-label-massive {
  font-family: 'Inter', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #10b981;
  letter-spacing: 2px;
  margin-top: var(--spacing-md);
}

.stat-subtext {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-top: var(--spacing-md);
  font-style: italic;
  text-align: center;
  max-width: 90%;
}

/* Nickname reveal */
.nickname-reveal {
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-xl);
  border-top: 2px solid rgba(255, 255, 255, 0.3);
  text-align: center;
  animation: fadeIn 1s ease-in 0.5s both;
  width: 100%;
}

.nickname-label {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: var(--spacing-sm);
}

.nickname-value {
  font-family: 'Bebas Neue', 'Arial Black', sans-serif; font-weight: 900;
  font-size: 3rem; /* Reduced from 3.5rem */
  color: #10b981;
  text-shadow: 0 0 20px rgba(0, 255, 157, 0.5);
  letter-spacing: 2px;
  word-break: break-word;
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

@media (max-width: 768px) {
  .story-line { font-size: 1.8rem; }
  .stat-value-massive { font-size: clamp(5rem, 15vw, 8rem); }
  .stat-label-massive { font-size: 1.2rem; }
  .nickname-value { font-size: clamp(2rem, 8vw, 3rem); }
  
  .slide-emoji {
    font-size: 4rem;
    margin-bottom: var(--spacing-lg);
  }
  
  .massive-stat { margin-bottom: var(--spacing-xl); }
  .nickname-reveal { 
    margin-top: var(--spacing-xl);
    padding-top: var(--spacing-xl);
  }
}

@media (max-height: 700px) {
  .slide-emoji { display: none; }
  .stat-value-massive { font-size: 5rem; }
  .massive-stat { margin-bottom: var(--spacing-lg); }
  .nickname-reveal { margin-top: var(--spacing-lg); padding-top: var(--spacing-lg); }
}

/* Float-in animation for reveal phase */
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
</style>
