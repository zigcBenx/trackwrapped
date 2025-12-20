<script setup lang="ts">
import { ref, onMounted } from 'vue'

const totalViews = ref(0)
const uniqueAthletes = ref(0)

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

async function fetchStats() {
  try {
    const response = await fetch('/api/stats')
    if (!response.ok) {
      console.error('Failed to fetch stats')
      return
    }
    const data = await response.json()
    totalViews.value = data.totalViews || 0
    uniqueAthletes.value = data.uniqueAthletes || 0
  } catch (error) {
    console.error('Error fetching stats:', error)
  }
}

onMounted(() => {
  fetchStats()
})
</script>

<template>
  <div class="view-stats">
    <span class="stat-number">{{ formatNumber(totalViews) }}+</span>
    <span class="stat-text">views</span>
    <span class="stat-divider">•</span>
    <span class="stat-number">{{ formatNumber(uniqueAthletes) }}+</span>
    <span class="stat-text">athletes have generated their wrapped</span>
  </div>
</template>

<style scoped>
.view-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0;
  margin: 0;
  font-family: 'Outfit', sans-serif;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.4);
  animation: fadeIn 0.6s ease-out 0.2s backwards;
  flex-wrap: wrap;
  margin-bottom: var(--spacing-xl);
}

.stat-number {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
}

.stat-text {
  font-weight: 400;
}

.stat-divider {
  margin: 0 4px;
  opacity: 0.5;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 480px) {
  .view-stats {
    font-size: 0.75rem;
    gap: 4px;
  }
}
</style>
