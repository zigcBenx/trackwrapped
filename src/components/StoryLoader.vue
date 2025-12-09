<template>
  <div class="story-loader">
    <div class="loader-content">
      <div class="loader-spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      <h2 class="loader-title">Preparing Your TrackWrapped</h2>
      <p class="loader-subtitle">Analyzing career highlights...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// No props or logic needed - just a visual loader
</script>

<style scoped>
.story-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn var(--transition-base) ease-out;
}

.loader-content {
  text-align: center;
  animation: slideInFromLeft var(--transition-slow) ease-out;
}

.loader-spinner {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto var(--spacing-xl);
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid transparent;
  border-top-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: spin 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.spinner-ring:nth-child(1) {
  animation-delay: -0.45s;
}

.spinner-ring:nth-child(2) {
  animation-delay: -0.3s;
  border-top-color: rgba(255, 255, 255, 0.6);
}

.spinner-ring:nth-child(3) {
  animation-delay: -0.15s;
  border-top-color: rgba(255, 255, 255, 0.4);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loader-title {
  font-size: var(--font-size-2xl);
  font-weight: 800;
  color: white;
  margin: 0 0 var(--spacing-sm);
}

.loader-subtitle {
  font-size: var(--font-size-lg);
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-weight: 500;
}

@media (max-width: 768px) {
  .loader-spinner {
    width: 80px;
    height: 80px;
  }
  
  .loader-title {
    font-size: var(--font-size-xl);
  }
  
  .loader-subtitle {
    font-size: var(--font-size-base);
  }
}
</style>
