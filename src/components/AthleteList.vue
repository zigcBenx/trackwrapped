<template>
  <div class="athlete-list">
    <div v-if="athletes.length === 0 && !loading" class="athlete-list__empty">
      <div class="empty-state">
        <div class="empty-state__icon">🏃‍♂️</div>
        <p class="empty-state__text">
          {{ searchQuery ? 'No athletes found' : 'Start typing to search for athletes' }}
        </p>
      </div>
    </div>
    
    <div v-else class="athlete-list__grid">
      <AthleteCard
        v-for="(athlete, index) in athletes"
        :key="athlete.id"
        :athlete="athlete"
        :style="{ animationDelay: `${index * 50}ms` }"
        @select="handleAthleteSelect"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import AthleteCard from './AthleteCard.vue'
import type { Athlete } from '@/types/athlete'

interface Props {
  athletes: Athlete[]
  loading?: boolean
  searchQuery?: string
}

defineProps<Props>()

const emit = defineEmits<{
  select: [athlete: Athlete]
}>()

function handleAthleteSelect(athlete: Athlete) {
  emit('select', athlete)
}
</script>

<style scoped>
.athlete-list {
  width: 100%;
  margin-top: var(--spacing-xl);
}

.athlete-list__empty {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.empty-state {
  text-align: center;
  animation: fadeIn var(--transition-slow) ease-out;
}

.empty-state__icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-md);
  opacity: 0.5;
}

.empty-state__text {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  font-weight: 500;
}

.athlete-list__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-md);
  animation: fadeIn var(--transition-base) ease-out;
}

@media (max-width: 768px) {
  .athlete-list__grid {
    grid-template-columns: 1fr;
  }
}
</style>
