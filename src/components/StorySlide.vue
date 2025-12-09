<template>
  <div 
    class="story-slide"
    :style="{ background: background }"
  >
    <div class="slide-content">
      <div v-if="emoji" class="slide-emoji">{{ emoji }}</div>
      <h1 class="slide-title">{{ title }}</h1>
      <p class="slide-text">{{ content }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  content: string
  background: string
  emoji?: string
}

defineProps<Props>()
</script>

<style scoped>
.story-slide {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  position: relative;
  overflow: hidden;
}

.story-slide::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  pointer-events: none;
}

.slide-content {
  max-width: 800px;
  text-align: center;
  z-index: 1;
  animation: slideInFromLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-emoji {
  font-size: 5rem;
  margin-bottom: var(--spacing-lg);
  animation: scaleIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  animation-delay: 0.2s;
  animation-fill-mode: both;
}

.slide-title {
  font-size: var(--font-size-3xl);
  font-weight: 900;
  color: white;
  margin: 0 0 var(--spacing-lg);
  line-height: 1.2;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.8s ease-out;
  animation-delay: 0.3s;
  animation-fill-mode: both;
}

.slide-text {
  font-size: var(--font-size-xl);
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
  line-height: 1.6;
  font-weight: 500;
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.8s ease-out;
  animation-delay: 0.5s;
  animation-fill-mode: both;
}

@media (max-width: 768px) {
  .story-slide {
    padding: var(--spacing-lg);
  }
  
  .slide-emoji {
    font-size: 3.5rem;
  }
  
  .slide-title {
    font-size: var(--font-size-2xl);
  }
  
  .slide-text {
    font-size: var(--font-size-lg);
  }
}

@media (max-width: 480px) {
  .slide-emoji {
    font-size: 2.5rem;
  }
  
  .slide-title {
    font-size: var(--font-size-xl);
  }
  
  .slide-text {
    font-size: var(--font-size-base);
  }
}
</style>
