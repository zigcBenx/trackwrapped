<template>
  <SlideWrapper 
    background="#000000"
    type="travel"
    :showPattern="true"
    @click="handleTap"
  >
    <!-- Buildup Phase -->
    <div v-if="phase === 'buildup'" class="buildup-container">
      <div 
        v-for="(line, index) in sequence" 
        :key="index"
        class="story-line"
        :class="[
          { 'visible': index <= currentLineIndex },
          index <= currentLineIndex ? (index % 2 === 0 ? 'race-in-left' : 'race-in-right') : ''
        ]"
      >
        {{ line }}
      </div>
    </div>

    <!-- Reveal Phase -->
    <div v-else class="reveal-container">
      <img src="@/assets/world.gif" class="slide-gif fade-in-up" style="animation-delay: 0ms" alt="World" />
      <h1 class="slide-title fade-in-up" style="animation-delay: 150ms">Global Takeover</h1>

      <div class="massive-stat fade-in-up" style="animation-delay: 300ms">
        <div class="stat-value-massive neon-cyan">{{ countriesCount }}</div>
        <div class="stat-label-massive">COUNTRIES CONQUERED</div>
        <div class="stat-subtext">{{ travelJoke }}</div>
      </div>

      <!-- Country List (Poster Style) -->
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
  width: 100%;
  overflow: hidden;
}

.story-line {
  font-family: var(--font-family-heading);
  font-size: 3.5rem;
  font-weight: 700;
  color: white;
  opacity: 0;
  text-transform: uppercase;
  line-height: 1;
  text-align: center;
  width: 100%;
}

.story-line.visible {
  opacity: 1;
}

.reveal-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.slide-gif {
  width: 150px;
  height: 150px;
  margin-bottom: var(--spacing-lg);
  object-fit: contain;
  filter: drop-shadow(0 0 20px rgba(0, 240, 255, 0.3));
}

.slide-title {
  font-family: var(--font-family-heading);
  font-size: 2rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-ys);
  text-align: center;
}

.massive-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.stat-value-massive {
  font-family: var(--font-family-heading);
  font-size: 8rem;
  line-height: 0.9;
  color: white;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
}

.neon-cyan {
  color: var(--color-accent-tertiary);
  text-shadow: 0 0 20px rgba(0, 240, 255, 0.5);
}

.stat-label-massive {
  font-family: var(--font-family-heading);
  font-size: 2rem;
  font-weight: 800;
  text-transform: uppercase;
  color: white;
  letter-spacing: 4px;
  margin-top: var(--spacing-md);
}

.stat-subtext {
  font-family: var(--font-family-primary);
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin-top: var(--spacing-xs);
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
}

.country-tag {
  background: rgba(255, 255, 255, 0.05);
  padding: 8px 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 8px;
  transform: skewX(-10deg);
  transition: transform 0.2s ease;
}

.country-tag:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--color-accent-tertiary);
}

.country-flag {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  transform: skewX(10deg); /* Counter-skew */
}

.country-name {
  font-family: var(--font-family-heading);
  font-size: 1.2rem;
  color: white;
  text-transform: uppercase;
  letter-spacing: 1px;
  transform: skewX(10deg); /* Counter-skew */
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

@media (max-width: 768px) {
  .story-line { font-size: 2.5rem; }
  .stat-value-massive { font-size: 6rem; }
  .stat-label-massive { font-size: 1.5rem; }
  .slide-gif {
    width: 120px;
    height: 120px;
    margin-bottom: var(--spacing-lg);
  }
}
</style>
