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
  max-width: 1200px;
  margin: 0 auto;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}

.search-input-wrapper:focus-within {
  border-color: var(--color-accent-primary);
  box-shadow: 
    var(--glass-shadow),
    0 0 30px rgba(0, 212, 255, 0.3);
}

.search-icon {
  font-size: var(--font-size-xl);
  opacity: 0.7;
  transition: opacity var(--transition-base);
}

.search-input-wrapper:focus-within .search-icon {
  opacity: 1;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
  font-weight: 500;
  font-family: var(--font-family-primary);
}

.search-input::placeholder {
  color: var(--color-text-muted);
  font-weight: 400;
}

.search-loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid var(--glass-border);
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
    font-size: var(--font-size-base);
  }
}
</style>
