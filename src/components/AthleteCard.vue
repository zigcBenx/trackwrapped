<template>
  <div class="athlete-card glass" @click="handleClick">
    <div class="athlete-card__header">
      <div class="athlete-card__flag">
        <img 
          :src="countryFlagUrl" 
          :alt="athlete.country" 
          class="flag-icon"
          loading="lazy"
          @error="(e) => (e.target as HTMLImageElement).style.display = 'none'"
        />
      </div>
      <div class="athlete-card__country">{{ athlete.country }}</div>
    </div>
    <div class="athlete-card__body">
      <h3 class="athlete-card__name">
        {{ athlete.firstname }} {{ athlete.lastname }}
      </h3>
      <div class="athlete-card__details">
        <span class="athlete-card__detail">
          <span class="athlete-card__label">Gender:</span>
          <span class="athlete-card__value">{{ genderLabel }}</span>
        </span>
        <span v-if="athlete.birthdate" class="athlete-card__detail">
          <span class="athlete-card__label">Born:</span>
          <span class="athlete-card__value">{{ formattedBirthdate }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Athlete } from '@/types/athlete'
import { getCountryFlagUrl } from '@/utils/countryFlags'

interface Props {
  athlete: Athlete
}

const props = defineProps<Props>()
const emit = defineEmits<{
  select: [athlete: Athlete]
}>()

function handleClick() {
  emit('select', props.athlete)
}

const countryFlagUrl = computed(() => {
  return getCountryFlagUrl(props.athlete.country)
})

const genderLabel = computed(() => {
  return props.athlete.sex === 'M' ? 'Male' : 'Female'
})

const formattedBirthdate = computed(() => {
  if (!props.athlete.birthdate) return ''
  
  const date = new Date(props.athlete.birthdate)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
})
</script>

<style scoped>
.athlete-card {
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  transition: all var(--transition-base);
  cursor: pointer;
  animation: scaleIn var(--transition-base) ease-out;
}

.athlete-card:hover {
  transform: translateY(-4px);
  box-shadow: 
    var(--glass-shadow),
    0 0 30px rgba(0, 212, 255, 0.2);
  border-color: var(--color-accent-primary);
}

.athlete-card__header {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-sm);
}

.athlete-card__flag {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.flag-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.athlete-card__country {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-secondary);
  letter-spacing: 0.05em;
}

.athlete-card__body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.athlete-card__name {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.2;
  margin: 0;
}

.athlete-card__details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.athlete-card__detail {
  display: flex;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
}

.athlete-card__label {
  color: var(--color-text-muted);
  font-weight: 500;
}

.athlete-card__value {
  color: var(--color-text-secondary);
  font-weight: 600;
}

@media (max-width: 768px) {
  .athlete-card {
    padding: var(--spacing-sm);
  }
  
  .athlete-card__name {
    font-size: var(--font-size-lg);
  }
}
</style>
