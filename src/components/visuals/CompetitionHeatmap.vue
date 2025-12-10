<template>
  <div class="competition-heatmap">
    <div class="heatmap-header">
      <div class="year-label">{{ year }}</div>
    </div>
    
    <div class="heatmap-grid">
      <div
        v-for="week in weeks"
        :key="week.week"
        class="heatmap-cell"
        :class="`intensity-${week.intensity}`"
        :title="`Week ${week.week}: ${week.count} competition${week.count !== 1 ? 's' : ''}`"
      >
        <div class="cell-inner"></div>
      </div>
    </div>
    
    <div class="heatmap-legend">
      <div class="legend-label">Less</div>
      <div class="legend-cells">
        <div class="legend-cell intensity-0"></div>
        <div class="legend-cell intensity-1"></div>
        <div class="legend-cell intensity-2"></div>
        <div class="legend-cell intensity-3"></div>
        <div class="legend-cell intensity-4"></div>
      </div>
      <div class="legend-label">More</div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Week {
  week: number
  count: number
  intensity: number
}

interface Props {
  weeks: Week[]
  year: number
}

defineProps<Props>()
</script>

<style scoped>
.competition-heatmap {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.heatmap-header {
  margin-bottom: var(--spacing-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.year-label {
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
}

.heatmap-grid {
  display: grid;
  grid-template-columns: repeat(52, 1fr);
  gap: 3px;
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-lg);
}

.heatmap-cell {
  aspect-ratio: 1;
  border-radius: 2px;
  position: relative;
  transition: all 0.2s ease;
  cursor: pointer;
}

.cell-inner {
  width: 100%;
  height: 100%;
  border-radius: 2px;
  transition: transform 0.2s ease;
}

.heatmap-cell:hover .cell-inner {
  transform: scale(1.2);
}

/* Intensity levels - GitHub-style */
.intensity-0 {
  background: rgba(255, 255, 255, 0.1);
}

.intensity-1 {
  background: rgba(0, 255, 157, 0.3);
}

.intensity-2 {
  background: rgba(0, 255, 157, 0.5);
}

.intensity-3 {
  background: rgba(0, 255, 157, 0.7);
}

.intensity-4 {
  background: rgba(0, 255, 157, 1);
}

/* Legend */
.heatmap-legend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.legend-label {
  font-family: 'Outfit', sans-serif;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

.legend-cells {
  display: flex;
  gap: 3px;
}

.legend-cell {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

@media (max-width: 768px) {
  .heatmap-grid {
    grid-template-columns: repeat(26, 1fr);
    gap: 2px;
  }
  
  .year-label {
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .heatmap-grid {
    grid-template-columns: repeat(13, 1fr);
    padding: var(--spacing-sm);
  }
  
  .legend-cell {
    width: 10px;
    height: 10px;
  }
}
</style>
