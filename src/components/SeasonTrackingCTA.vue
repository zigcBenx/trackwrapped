<template>
  <div class="season-tracking-cta" @click="handleClick">
    <div class="cta-content">
      <p class="cta-text">Wanna track your whole season? <span class="cta-link">Get notified →</span></p>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  click: []
}>()

function handleClick() {
  emit('click')
}
</script>

<style scoped>
.season-tracking-cta {
  position: relative;
  padding: var(--spacing-md);
  background: transparent;
  border: 1px solid rgba(204, 255, 0, 0.15);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  animation: ctaFadeIn 0.6s ease-out 0.3s backwards;
  margin: var(--spacing-lg) 0;
}

.season-tracking-cta:hover {
  border-color: rgba(204, 255, 0, 0.4);
  background: rgba(204, 255, 0, 0.03);
}

.cta-content {
  position: relative;
  z-index: 2;
}

.cta-text {
  font-family: var(--font-family-base);
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  font-weight: 400;
}

.cta-link {
  color: var(--color-accent-primary);
  font-weight: 600;
  transition: all 0.2s ease;
}

.season-tracking-cta:hover .cta-link {
  text-shadow: 0 0 10px rgba(204, 255, 0, 0.5);
}

@keyframes ctaFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .season-tracking-cta {
    padding: var(--spacing-sm) var(--spacing-md);
  }

  .cta-text {
    font-size: 0.85rem;
  }
}
</style>
