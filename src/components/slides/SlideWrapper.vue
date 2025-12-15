<template>
  <div
    class="slide-wrapper"
    :style="{ background: background }"
    :class="`slide-type-${type}`"
  >
    <!-- Grain/Noise overlay -->
    <div class="grain-overlay"></div>

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
  position: absolute; /* Fix for transitions */
  top: 0;
  left: 0;
  overflow: hidden;
  padding: var(--spacing-2xl);
  border-radius: 24px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}

/* Grain/Noise texture overlay */
.grain-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.04;
  pointer-events: none;
  z-index: 0;
  mix-blend-mode: overlay;
}

/* Vignette effect */
.vignette-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, transparent 40%, rgba(0, 0, 0, 0.4) 100%);
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
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.5px;
  z-index: 3;
  text-transform: lowercase;
}

@media (max-width: 768px) {
  .slide-wrapper {
    border-radius: 0;
    padding: var(--spacing-lg);
    padding-bottom: calc(var(--spacing-2xl) + 20px);
  }
  
  .slide-branding {
    bottom: var(--spacing-md);
    font-size: 0.65rem;
    width: 100%;
    text-align: center;
  }
}

@media (max-height: 700px) {
  .slide-wrapper {
    padding: var(--spacing-md);
    padding-bottom: calc(var(--spacing-xl) + 20px);
  }
}
</style>
