<template>
  <div class="search-container">
    <div class="search-input-wrapper glass">
      <div class="search-icon">🔍</div>
      <input
        v-model="searchQuery"
        type="text"
        class="search-input"
        placeholder="Search for athletes..."
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
      <div v-if="loading" class="search-loading">
        <div class="spinner"></div>
      </div>
    </div>
    
    <AthleteList 
      :athletes="athletes" 
      :loading="loading"
      :search-query="searchQuery"
      @select="handleAthleteSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDebounce } from '@/composables/useDebounce'
import { searchAthletes } from '@/services/athleteService'
import AthleteList from './AthleteList.vue'
import type { Athlete } from '@/types/athlete'

const searchQuery = ref('')
const debouncedSearchQuery = useDebounce(searchQuery, 300)
const athletes = ref<Athlete[]>([])
const loading = ref(false)
const isFocused = ref(false)

watch(debouncedSearchQuery, async (newQuery) => {
  if (!newQuery || newQuery.trim().length === 0) {
    athletes.value = []
    loading.value = false
    return
  }

  loading.value = true
  
  try {
    const results = await searchAthletes(newQuery)
    athletes.value = results
  } catch (error) {
    console.error('Failed to search athletes:', error)
    athletes.value = []
  } finally {
    loading.value = false
  }
})

const emit = defineEmits<{
  athleteSelect: [athlete: Athlete]
}>()

function handleAthleteSelect(athlete: Athlete) {
  emit('athleteSelect', athlete)
}
</script>

<style scoped>
.search-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  transform: skew(-5deg);
}

.search-input-wrapper:focus-within {
  border-color: var(--color-accent-primary);
  background: rgba(0, 0, 0, 0.8);
  box-shadow: 
    0 0 40px rgba(204, 255, 0, 0.15), /* Softer, wider glow */
    inset 0 0 20px rgba(204, 255, 0, 0.05);
  transform: skew(-5deg) scale(1.02);
}

.search-icon {
  font-size: 1.5rem;
  opacity: 0.5;
  transition: opacity var(--transition-base);
  transform: skew(5deg); /* Counter-skew */
}

.search-input-wrapper:focus-within .search-icon {
  opacity: 1;
  color: var(--color-accent-primary);
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  font-family: var(--font-family-heading);
  letter-spacing: 1px;
  text-transform: uppercase;
  transform: skew(5deg); /* Counter-skew */
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
  font-weight: 400;
  text-transform: none;
  font-family: var(--font-family-primary);
  letter-spacing: 0;
}

.search-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  transform: skew(5deg); /* Counter-skew */
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--color-accent-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .search-input-wrapper {
    padding: var(--spacing-sm) var(--spacing-md);
  }
  
  .search-input {
    font-size: 1.2rem;
  }
}
</style>
