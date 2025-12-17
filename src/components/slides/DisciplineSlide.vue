<template>
  <SlideWrapper 
    background="#000000"
    type="discipline"
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
      <div class="slide-emoji fade-in-up" style="animation-delay: 0ms">{{ disciplineEmoji }}</div>
      <h1 class="slide-title fade-in-up" style="animation-delay: 150ms">This is Your Arena</h1>
      <div class="massive-stat fade-in-up" style="animation-delay: 300ms">
        <div class="stat-value-massive neon-cyan slam-in" style="animation-delay: 450ms">{{ mainDiscipline }}</div>
        <div class="stat-label-massive">MAIN EVENT</div>
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
}

.slide-emoji {
  font-size: 6rem;
  margin-bottom: var(--spacing-xl);
  filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.3));
}

.slide-title {
  font-family: var(--font-family-heading);
  font-size: 2rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xl);
  text-align: center;
}

.massive-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value-massive {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 10rem;
  line-height: 0.8;
  color: white;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
  text-align: center;
  word-break: break-word;
  max-width: 100%;
  transform: skew(-5deg);
}

.neon-cyan {
  color: var(--color-accent-tertiary);
  text-shadow: 
    4px 4px 0px rgba(255, 255, 255, 0.2),
    0 0 20px rgba(0, 240, 255, 0.5);
}

.stat-label-massive {
  font-family: 'Inter', sans-serif;
  font-size: 2.5rem;
  font-weight: 900;
  text-transform: uppercase;
  color: white;
  letter-spacing: 4px;
  margin-top: var(--spacing-md);
  text-shadow: 2px 2px 0px rgba(0,0,0,0.5);
}

/* Animations */
.slam-in {
  animation: slamIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
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
  .story-line { font-size: 2.5rem; }
  .stat-value-massive { font-size: 6rem; }
  .stat-label-massive { font-size: 2rem; }
}
</style>
