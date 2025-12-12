<template>
  <div class="leaderboard">
    <h2 class="leaderboard-title">🏆 Most Viewed Athletes</h2>
    
    <div v-if="isLoading" class="leaderboard-loading">
      Loading...
    </div>
    
    <div v-else-if="topAthletes.length === 0" class="leaderboard-empty">
      No views yet. Be the first to explore!
    </div>
    
    <div v-else class="leaderboard-list">
      <div
        v-for="(athlete, index) in topAthletes"
        :key="athlete.athleteId"
        class="leaderboard-item"
        :class="{ 'top-1': index === 0, 'top-2': index === 1, 'top-3': index === 2 }"
      >
        <div class="rank-badge">{{ index + 1 }}</div>
        <div class="athlete-info">
          <div class="athlete-id">ID: {{ athlete.athleteId }}</div>
          <div class="athlete-views">{{ athlete.views }} views</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getTopAthletes } from '@/services/viewTrackingService'
import type { TopAthlete } from '@/services/viewTrackingService'

const topAthletes = ref<TopAthlete[]>([])
const isLoading = ref(true)

onMounted(async () => {
  isLoading.value = true
  topAthletes.value = await getTopAthletes()
  isLoading.value = false
})
</script>

<style scoped>
.leaderboard {
  margin-top: var(--spacing-3xl);
  padding: var(--spacing-lg);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  animation: fadeIn 0.6s ease-out;
}

.leaderboard-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin: 0 0 var(--spacing-md) 0;
  color: white;
  letter-spacing: -0.01em;
}

.leaderboard-loading,
.leaderboard-empty {
  text-align: center;
  padding: var(--spacing-lg);
  color: rgba(255, 255, 255, 0.5);
  font-size: var(--font-size-sm);
}

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.leaderboard-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.leaderboard-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
}

.leaderboard-item.top-1 {
  background: rgba(251, 191, 36, 0.1);
  border-color: rgba(251, 191, 36, 0.3);
}

.leaderboard-item.top-2 {
  background: rgba(192, 192, 192, 0.1);
  border-color: rgba(192, 192, 192, 0.3);
}

.leaderboard-item.top-3 {
  background: rgba(205, 127, 50, 0.1);
  border-color: rgba(205, 127, 50, 0.3);
}

.rank-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-weight: 700;
  font-size: var(--font-size-lg);
  color: white;
  flex-shrink: 0;
}

.leaderboard-item.top-1 .rank-badge {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  box-shadow: 0 0 20px rgba(251, 191, 36, 0.4);
}

.leaderboard-item.top-2 .rank-badge {
  background: linear-gradient(135deg, #d1d5db, #9ca3af);
  box-shadow: 0 0 15px rgba(209, 213, 219, 0.3);
}

.leaderboard-item.top-3 .rank-badge {
  background: linear-gradient(135deg, #d97706, #b45309);
  box-shadow: 0 0 15px rgba(217, 119, 6, 0.3);
}

.athlete-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.athlete-id {
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

.athlete-views {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: #00ff9d;
  letter-spacing: 0.5px;
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

@media (max-width: 768px) {
  .leaderboard {
    margin-top: var(--spacing-xl);
    padding: var(--spacing-md);
  }

  .leaderboard-title {
    font-size: var(--font-size-lg);
  }

  .rank-badge {
    width: 36px;
    height: 36px;
    font-size: var(--font-size-base);
  }

  .athlete-views {
    font-size: var(--font-size-base);
  }
}
</style>
