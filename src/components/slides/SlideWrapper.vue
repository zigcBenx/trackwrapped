<template>
  <div 
    class="slide-wrapper"
    :style="{ background: background }"
    :class="`slide-type-${type}`"
  >
    <!-- Slanted Background Pattern -->
    <div v-if="showPattern" class="slanted-bg"></div>

    <!-- Vignette overlay -->
    <div class="vignette-overlay"></div>
    
    <!-- Main slide content -->
    <div class="slide-content">
      <slot></slot>
    </div>
    
    <!-- Branding footer -->
    <div class="slide-branding">
      by trackwrapped.vercel.app
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  background: string
  type?: string
  showPattern?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'default',
  showPattern: true
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
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  padding: var(--spacing-md);
  /* Removed border-radius and box-shadow for full immersion */
  background-color: var(--color-bg-primary);
}

/* Slanted Background Pattern */
.slanted-bg {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(255, 255, 255, 0.03) 10px,
    rgba(255, 255, 255, 0.03) 20px
  );
  transform: rotate(-15deg);
  pointer-events: none;
  z-index: 0;
}

/* Noise Texture Overlay */
.vignette-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 1;
  opacity: 0.4;
  mix-blend-mode: overlay;
}

.slide-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 100%; /* Allow full width */
  text-align: center;
  z-index: 2;
  position: relative;
}

/* Branding footer - Minimal */
.slide-branding {
  position: absolute;
  bottom: var(--spacing-md);
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-family-heading);
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 2px;
  z-index: 3;
  text-transform: uppercase;
}

@media (max-width: 768px) {
  .slide-wrapper {
    padding: var(--spacing-sm);
    padding-bottom: calc(var(--spacing-xl) + 20px);
  }
  
  .slide-branding {
    bottom: var(--spacing-sm);
    font-size: 0.8rem;
  }
}
</style>
