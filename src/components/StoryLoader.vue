<template>
  <div class="story-loader">
    <!-- Background Pattern -->
    <div class="slanted-bg"></div>
    <div class="vignette-overlay"></div>

    <div class="loader-content">
      <div class="loader-spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      <h2 class="loader-title animate-glitch">PREPARING<br>YOUR WRAPPED</h2>
      <p class="loader-subtitle">CRUNCHING THE NUMBERS...</p>
      
      <div class="loader-instructions">
        <div class="instruction-item">
          <span class="instruction-emoji">👈</span>
          <span class="instruction-text">TAP BACK</span>
        </div>
        <div class="instruction-item">
          <span class="instruction-emoji">👆</span>
          <span class="instruction-text">HOLD TO PAUSE</span>
        </div>
        <div class="instruction-item">
          <span class="instruction-emoji">👉</span>
          <span class="instruction-text">TAP NEXT</span>
        </div>
      </div>
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
  background: var(--color-bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  overflow: hidden;
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

.vignette-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 100%);
  pointer-events: none;
  z-index: 1;
}

.loader-content {
  position: relative;
  z-index: 2;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: slideInFromBottom 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  padding: 0 var(--spacing-md);
  width: 90%; /* Constrain width to ensure margins */
  max-width: 600px; /* Reduced max-width for better readability */
  margin: 0 auto;
}

@keyframes slideInFromBottom {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.loader-spinner {
  position: relative;
  width: 100px;
  height: 100px;
  margin-bottom: var(--spacing-xl);
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid transparent;
  border-top-color: var(--color-accent-primary);
  border-radius: 50%;
  animation: spin 1s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  filter: drop-shadow(0 0 10px rgba(204, 255, 0, 0.5));
}

.spinner-ring:nth-child(2) {
  width: 70%;
  height: 70%;
  top: 15%;
  left: 15%;
  animation-duration: 1.5s;
  animation-direction: reverse;
  border-top-color: var(--color-accent-secondary);
  filter: drop-shadow(0 0 10px rgba(255, 0, 85, 0.5));
}

.spinner-ring:nth-child(3) {
  width: 40%;
  height: 40%;
  top: 30%;
  left: 30%;
  animation-duration: 2s;
  border-top-color: var(--color-accent-tertiary);
  filter: drop-shadow(0 0 10px rgba(0, 240, 255, 0.5));
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loader-title {
  font-family: var(--font-family-heading);
  font-size: 5rem;
  font-weight: 700;
  color: white;
  margin: 10px 10px;
  line-height: 0.9;
  text-transform: uppercase;
  letter-spacing: 4px;
  text-shadow: 4px 4px 0px rgba(255, 255, 255, 0.1);
  transform: skew(-5deg);
}

.loader-subtitle {
  font-family: var(--font-family-heading);
  font-size: 1.5rem;
  color: var(--color-text-secondary);
  margin-top: var(--spacing-md);
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 4px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

@media (max-width: 768px) {
  .loader-content {
    width: 85%; /* Slightly narrower on mobile */
    padding: 0 var(--spacing-sm);
  }

  .loader-spinner {
    width: 80px;
    height: 80px;
  }
  
  .loader-title {
    font-size: clamp(1.8rem, 8vw, 3.5rem); /* Smaller min size to prevent splitting */
    word-break: normal; /* Don't break words unless absolutely necessary */
    overflow-wrap: break-word;
  }
  
  .loader-subtitle {
    font-size: 1rem;
  }
}

.loader-instructions {
  display: flex;
  gap: var(--spacing-xl);
  margin-top: var(--spacing-2xl);
  opacity: 0;
  animation: fadeIn 0.5s ease-out 1s forwards;
}

.instruction-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
}

.instruction-emoji {
  font-size: 2rem;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
}

.instruction-text {
  font-family: var(--font-family-heading);
  font-size: 1rem;
  color: var(--color-text-secondary);
  letter-spacing: 1px;
}

@media (max-width: 768px) {
  .loader-instructions {
    gap: var(--spacing-md);
    margin-top: var(--spacing-xl);
  }
  
  .instruction-emoji { font-size: 1.5rem; }
  .instruction-text { font-size: 0.8rem; }
}
</style>
