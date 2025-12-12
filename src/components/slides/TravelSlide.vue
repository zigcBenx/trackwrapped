<template>
  <SlideWrapper 
    background="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    type="travel"
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
      <div class="slide-emoji">🌍</div>
      <h1 class="slide-title">Global Footprint</h1>
      
      <div class="massive-stat">
        <div class="stat-value-massive">{{ countriesCount }}</div>
        <div class="stat-label-massive">COUNTRIES VISITED</div>
        <div class="stat-subtext">{{ travelJoke }}</div>
      </div>

      <!-- Country List (if not too many) -->
      <div v-if="countries.length > 0 && countries.length <= 12" class="country-list">
        <span v-for="country in countries" :key="country" class="country-tag">
          {{ country }}
        </span>
      </div>
    </div>
  </SlideWrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import SlideWrapper from './SlideWrapper.vue'
import { getTravelSequence } from '@/utils/newSlideJokes'

interface Props {
  countries: string[]
  countriesCount: number
  homeCountry: string
}

const props = defineProps<Props>()

const phase = ref<'buildup' | 'reveal'>('buildup')
const currentLineIndex = ref(-1)

const isDomesticOnly = computed(() => {
  return props.countriesCount === 1 && props.countries[0] === props.homeCountry
})

const sequence = computed(() => {
  return getTravelSequence(props.countriesCount, isDomesticOnly.value, props.homeCountry)
})

const travelJoke = computed(() => {
  if (isDomesticOnly.value) {
    return `Local Hero! You own the tracks of ${props.homeCountry} 🏠`
  } else if (props.countriesCount <= 3) {
    return "Testing the international waters! 🌊"
  } else if (props.countriesCount <= 10) {
    return "Collecting stamps like medals! 🛂"
  } else {
    return "Mr. Worldwide! 🌐"
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
  font-family: 'Outfit', sans-serif;
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
  width: 100%;
}

.slide-emoji {
  font-size: 6rem;
  margin-bottom: var(--spacing-xl);
  filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.3));
}

.slide-title {
  font-family: 'Outfit', sans-serif;
  font-size: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 4px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: var(--spacing-xl);
}

.massive-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.stat-value-massive {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 8rem;
  line-height: 0.9;
  color: white;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
}

.stat-label-massive {
  font-family: 'Outfit', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #00ff9d;
  letter-spacing: 2px;
  margin-top: var(--spacing-md);
}

.stat-subtext {
  font-family: 'Outfit', sans-serif;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin-top: var(--spacing-lg);
  font-style: italic;
  text-align: center;
  max-width: 80%;
}

.country-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--spacing-sm);
  max-width: 600px;
  margin-top: var(--spacing-lg);
}

.country-tag {
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 16px;
  border-radius: 20px;
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  color: white;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

@media (max-width: 768px) {
  .story-line { font-size: 1.8rem; }
  .stat-value-massive { font-size: 6rem; }
  .stat-label-massive { font-size: 1.2rem; }
  
  .slide-emoji {
    font-size: 4rem;
    margin-bottom: var(--spacing-lg);
  }
}
</style>
