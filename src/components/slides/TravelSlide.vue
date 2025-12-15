<template>
  <SlideWrapper
    background="linear-gradient(135deg, #22d3ee 0%, #2563eb 50%, #d946ef 100%)"
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
      <div class="slide-emoji fade-in-up" style="animation-delay: 0ms">🌍</div>
      <h1 class="slide-title fade-in-up" style="animation-delay: 150ms">Global Footprint</h1>

      <div class="massive-stat fade-in-up" style="animation-delay: 300ms">
        <div class="stat-value-massive">{{ countriesCount }}</div>
        <div class="stat-label-massive">COUNTRIES VISITED</div>
        <div class="stat-subtext">{{ travelJoke }}</div>
      </div>

      <!-- Country List (if not too many) -->
      <div v-if="countries.length > 0 && countries.length <= 12" class="country-list fade-in-up" style="animation-delay: 450ms">
        <div v-for="country in countries" :key="country" class="country-tag">
          <img 
            :src="getCountryFlagUrl(country)" 
            :alt="country" 
            class="country-flag"
            loading="lazy"
            @error="(e) => (e.target as HTMLImageElement).style.display = 'none'"
          />
          <span class="country-name">{{ country }}</span>
        </div>
      </div>
    </div>
  </SlideWrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import SlideWrapper from './SlideWrapper.vue'
import { getTravelSequence } from '@/utils/newSlideJokes'
import { getCountryFlagUrl } from '@/utils/countryFlags'

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
      sequenceTimer = setTimeout(advance, 300) // Reduced from 1500ms
    } else {
      sequenceTimer = setTimeout(() => {
        phase.value = 'reveal'
      }, 800) // Reduced from 2000ms
    }
  }

  sequenceTimer = setTimeout(advance, 200) // Reduced from 500ms
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
  font-family: 'Bebas Neue', 'Arial Black', sans-serif;
  font-size: 3rem;
  font-weight: 900;
  color: #ffffff;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  opacity: 0;
  transform: translateY(30px); /* Increased from 20px */
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); /* Faster: 0.5s → 0.3s */
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
  font-family: 'Bebas Neue', 'Arial Black', sans-serif;
  font-size: 2rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 6px;
  color: #ffffff;
  margin-bottom: var(--spacing-xl);
}

.massive-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.stat-value-massive {
  font-family: 'Bebas Neue', 'Arial Black', sans-serif;
  font-weight: 900;
  font-size: 12rem; /* Increased by 50% */
  line-height: 0.85;
  letter-spacing: 0.02em;
  color: #ffffff;
  text-transform: uppercase;
  text-shadow: 0 0 40px rgba(255, 255, 255, 0.5);
}

.stat-label-massive {
  font-family: 'Bebas Neue', 'Arial Black', sans-serif;
  font-size: 2.25rem; /* Increased by 50% */
  font-weight: 900;
  text-transform: uppercase;
  color: #ffffff;
  letter-spacing: 4px;
  margin-top: var(--spacing-md);
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.stat-subtext {
  font-family: 'Inter', sans-serif;
  font-size: 1.2rem;
  font-weight: 600;
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
  padding: 6px 12px;
  border-radius: 20px;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: white;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 8px;
}

.country-flag {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.country-name {
  font-weight: 500;
}

@media (max-width: 768px) {
  .story-line { font-size: 1.8rem; }
  .stat-value-massive { font-size: 4rem; }
  .stat-label-massive { font-size: 1.2rem; }
  .stat-subtext { font-size: 1rem; }

  .slide-emoji {
    font-size: 4rem;
    margin-bottom: var(--spacing-lg);
  }
}

@media (max-width: 480px) {
  .stat-value-massive { font-size: 3rem; }
  .stat-label-massive { font-size: 1rem; }
  .stat-subtext { font-size: 0.9rem; }
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
