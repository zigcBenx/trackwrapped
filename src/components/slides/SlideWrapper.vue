<template>
  <div 
    class="slide-wrapper"
    :style="{ background: background }"
    :class="`slide-type-${type}`"
  >
    <!-- Vignette overlay -->
    <div class="vignette-overlay"></div>
    
    <!-- Main slide content -->
    <div class="slide-content">
      <slot></slot>
    </div>
    
    <!-- Branding footer -->
    <div class="slide-branding">
      by trackwrapped.com
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  background: string
  type?: string
}

withDefaults(defineProps<Props>(), {
  type: 'default'
})
</script>

<style scoped>
.slide-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: var(--spacing-2xl);
}

/* Vignette effect */
.vignette-overlay {
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
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 900px;
  text-align: center;
  z-index: 2;
  position: relative;
}

/* Branding footer */
.slide-branding {
  position: absolute;
  bottom: var(--spacing-lg);
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Outfit', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 1px;
  z-index: 3;
  text-transform: lowercase;
}

@media (max-width: 768px) {
  .slide-wrapper {
    padding: var(--spacing-lg);
  }
  
  .slide-branding {
    bottom: var(--spacing-md);
    font-size: 0.75rem;
  }
}
</style>
