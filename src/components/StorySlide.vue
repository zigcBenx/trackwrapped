<template>
  <div 
    class="story-slide texture-overlay"
    :style="{ background: background }"
    :class="`slide-type-${type}`"
  >
    <div class="slide-content">
      <div v-if="emoji" class="slide-emoji animate-bounce">{{ emoji }}</div>
      <h1 class="slide-title">{{ title }}</h1>
      <p class="slide-text" v-html="formattedContent"></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string
  content: string
  background: string
  emoji?: string
  type?: string
}

const props = defineProps<Props>()

// Format content to preserve line breaks
const formattedContent = computed(() => {
  return props.content.replace(/\n/g, '<br>')
})
</script>

<style scoped>
.story-slide {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl);
  position: relative;
  overflow: hidden;
}

/* Vignette effect */
.story-slide::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, transparent 40%, rgba(0, 0, 0, 0.3) 100%);
  pointer-events: none;
  z-index: 1;
}

.slide-content {
  max-width: 900px;
  text-align: center;
  z-index: 2;
  position: relative;
}

.slide-emoji {
  font-size: 6rem;
  margin-bottom: var(--spacing-xl);
  filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.3));
  animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), float 3s ease-in-out infinite 0.8s;
}

.slide-title {
  font-family: 'Bebas Neue', 'Impact', sans-serif;
  font-size: 4.5rem;
  font-weight: 400;
  letter-spacing: 0.02em;
  color: white;
  margin: 0 0 var(--spacing-xl);
  line-height: 1;
  text-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 4px 20px rgba(0, 0, 0, 0.2);
  animation: slideInFromLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  text-transform: uppercase;
}

.slide-text {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
  line-height: 1.8;
  font-weight: 500;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  animation: fadeIn 1s ease-out 0.3s both;
  max-width: 700px;
  margin: 0 auto;
}

/* Special styling for specific slide types */
.slide-type-victoryrate .slide-title,
.slide-type-worldrecord .slide-title {
  animation: slideInFromLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1), numberGlow 2s ease-in-out infinite 1s;
}

.slide-type-nemesis .slide-title {
  color: #ff4444;
  text-shadow: 
    0 0 20px rgba(255, 68, 68, 0.8),
    0 2px 4px rgba(0, 0, 0, 0.5);
}

.slide-type-nemesis .slide-emoji {
  animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), pulse 1.5s ease-in-out infinite 0.8s;
}

.slide-type-finale .slide-text {
  font-size: 1.25rem;
  line-height: 2;
}

/* Numbers in text should glow */
.slide-text :deep(strong),
.slide-text :deep(b) {
  font-weight: 900;
  font-size: 1.2em;
  color: #fff;
}

@media (max-width: 1024px) {
  .story-slide {
    padding: var(--spacing-xl);
  }
  
  .slide-emoji {
    font-size: 4.5rem;
  }
  
  .slide-title {
    font-size: 3.5rem;
  }
  
  .slide-text {
    font-size: 1.25rem;
  }
}

@media (max-width: 768px) {
  .story-slide {
    padding: var(--spacing-lg);
  }
  
  .slide-emoji {
    font-size: 3.5rem;
    margin-bottom: var(--spacing-md);
  }
  
  .slide-title {
    font-size: 2.5rem;
    margin-bottom: var(--spacing-md);
  }
  
  .slide-text {
    font-size: 1.1rem;
    line-height: 1.6;
  }
}

@media (max-width: 480px) {
  .slide-emoji {
    font-size: 2.5rem;
  }
  
  .slide-title {
    font-size: 2rem;
  }
  
  .slide-text {
    font-size: 1rem;
  }
}
</style>
