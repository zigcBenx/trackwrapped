<template>
  <SlideWrapper
    background="linear-gradient(135deg, #22d3ee 0%, #2563eb 50%, #d946ef 100%)"
    type="discipline"
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
      <div class="slide-emoji fade-in-up" style="animation-delay: 0ms">{{ disciplineEmoji }}</div>
      <h1 class="slide-title fade-in-up" style="animation-delay: 150ms">Main Event</h1>
      <div class="massive-stat fade-in-up" style="animation-delay: 300ms">
        <div class="stat-value-massive">{{ mainDiscipline }}</div>
        <div class="stat-label-massive">MAIN DISCIPLINE</div>
      </div>
    </div>
  </SlideWrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import SlideWrapper from './SlideWrapper.vue'
import { getDisciplineSequence } from '@/utils/jokeGenerator'

interface Props {
  disciplineCategory: string
  mainDiscipline: string
}

const props = defineProps<Props>()

const phase = ref<'buildup' | 'reveal'>('buildup')
const currentLineIndex = ref(-1)
const sequence = getDisciplineSequence(props.disciplineCategory, props.mainDiscipline)

const disciplineEmoji = computed(() => {
  switch (props.disciplineCategory.toLowerCase()) {
    case 'sprint':
    case 'distance':
      return '🏃'
    case 'jump':
      return '🤸'
    case 'throw':
      return '🥏'
    case 'combined':
      return '🏅'
    default:
      return '🏃'
  }
})

let sequenceTimer: any = null

function startSequence() {
  phase.value = 'buildup'
  currentLineIndex.value = -1
  
  const advance = () => {
    if (currentLineIndex.value < sequence.length - 1) {
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
}

.stat-value-massive {
  font-family: 'Bebas Neue', 'Arial Black', sans-serif;
  font-weight: 900;
  font-size: 7.5rem; /* Increased by 50% */
  line-height: 0.85;
  letter-spacing: 0.02em;
  color: #ffffff;
  text-transform: uppercase;
  text-shadow: 0 0 40px rgba(255, 255, 255, 0.5);
  text-align: center;
  word-break: break-word;
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

@media (max-width: 768px) {
  .story-line { font-size: 1.8rem; }
  .stat-value-massive { font-size: 2rem; }
  .stat-label-massive { font-size: 1.2rem; }
}

@media (max-width: 480px) {
  .stat-value-massive { font-size: 1.5rem; }
  .stat-label-massive { font-size: 1rem; }
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
