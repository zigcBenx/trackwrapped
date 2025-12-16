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
  border-radius: 4px; /* Sharper corners */
  padding: var(--spacing-md);
  transition: all var(--transition-base);
  cursor: pointer;
  animation: scaleIn var(--transition-base) ease-out;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.athlete-card:hover {
  transform: translateY(-4px) skewX(-2deg);
  box-shadow: 
    0 10px 30px -10px rgba(0, 0, 0, 0.5),
    0 0 20px rgba(204, 255, 0, 0.1); /* Neon glow */
  border-color: var(--color-accent-primary);
  background: rgba(255, 255, 255, 0.05);
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
  font-family: var(--font-family-heading);
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  letter-spacing: 1px;
  text-transform: uppercase;
}

.athlete-card__body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.athlete-card__name {
  font-family: var(--font-family-heading);
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.athlete-card__details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.athlete-card__detail {
  display: flex;
  gap: var(--spacing-xs);
  font-size: 0.9rem;
  font-family: var(--font-family-primary);
}

.athlete-card__label {
  color: var(--color-text-muted);
  font-weight: 500;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 1px;
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
    font-size: 1.5rem;
  }
}
</style>
