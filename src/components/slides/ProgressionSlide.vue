<template>
  <div class="slide-content progression-slide">
    <h2 class="slide-title slide-in-left">THE CLIMB</h2>
    
    <div class="graph-container fade-in-up">
      <!-- Y-Axis Labels (Top/Bottom) -->
      <div class="y-axis">
        <span>{{ formatMark(topLabel) }}</span>
        <span>{{ formatMark(bottomLabel) }}</span>
      </div>

      <div class="graph-wrapper">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="graph-svg">
          <!-- Grid Lines -->
          <line x1="0" y1="25" x2="100" y2="25" class="grid-line" />
          <line x1="0" y1="50" x2="100" y2="50" class="grid-line" />
          <line x1="0" y1="75" x2="100" y2="75" class="grid-line" />

          <!-- The Line -->
          <path
            :d="pathD"
            class="graph-line"
            ref="pathRef"
          />

          <!-- Area under the line (gradient) -->
          <path
            :d="areaD"
            class="graph-area"
          />

          <!-- Data Points -->
          <circle
            v-for="(point, index) in points"
            :key="index"
            :cx="point.x"
            :cy="point.y"
            r="1.5"
            class="data-point"
            :style="{ animationDelay: `${1000 + (index * 100)}ms` }"
          />
        </svg>
        
        <!-- X-Axis Labels (Dates) -->
        <div class="x-axis">
          <span 
            v-for="(point, index) in points" 
            :key="index"
            class="date-label"
            :style="{ left: `${point.x}%` }"
          >
            {{ formatDate(point.date) }}
          </span>
        </div>
        
        <!-- Best Result Label -->
        <div 
          v-if="bestPoint"
          class="best-mark-label"
          :style="{ left: `${bestPoint.x}%`, top: `${bestPoint.y}%` }"
        >
          <span class="label-text">SB</span>
          <span class="label-value">{{ formatMark(bestValue) }}</span>
        </div>
      </div>
    </div>

    <div class="slide-footer fade-in-up" style="animation-delay: 500ms">
      <p class="footer-text">
        <span class="highlight">{{ results.length }}</span> RACES THIS SEASON
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import type { AthleteResult } from '@/types/athleteDetails'

interface Props {
  results: AthleteResult[]
  mainDiscipline: string
  disciplineCategory: 'sprint' | 'distance' | 'jump' | 'throw' | 'combined'
  year?: number
}

const props = withDefaults(defineProps<Props>(), {
  year: 2025
})

// Filter results to main discipline only and sort by date
const filteredResults = computed(() => {
  return props.results
    .filter(r => r.discipline === props.mainDiscipline && r.performanceValue > 0)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
})

// Determine if lower is better (track events)
const isTrack = computed(() => {
  return ['sprint', 'distance', 'combined'].includes(props.disciplineCategory)
})

// Calculate Min/Max for scaling
const values = computed(() => filteredResults.value.map(r => r.performanceValue))
const yMax = computed(() => Math.max(...values.value) * (isTrack.value ? 1.01 : 1.1)) // Add padding
const yMin = computed(() => Math.min(...values.value) * (isTrack.value ? 0.99 : 0.9))

const bestValue = computed(() => {
  return isTrack.value ? Math.min(...values.value) : Math.max(...values.value)
})

// Labels for Y-Axis
const topLabel = computed(() => isTrack.value ? yMin.value : yMax.value)
const bottomLabel = computed(() => isTrack.value ? yMax.value : yMin.value)

// Generate Points (0-100 scale)
const points = computed(() => {
  if (filteredResults.value.length < 2) return []
  
  const minVal = yMin.value
  const maxVal = yMax.value
  const range = maxVal - minVal
  
  return filteredResults.value.map((r, i) => {
    const x = (i / (filteredResults.value.length - 1)) * 100
    
    let normalizedY: number
    if (isTrack.value) {
      // Lower value = Higher position (smaller Y coord)
      // (val - min) / range -> 0 to 1. 
      // If val = min (best), we want 0.
      normalizedY = ((r.performanceValue - minVal) / range) * 100
    } else {
      // Higher value = Higher position (smaller Y coord)
      // (val - min) / range -> 0 to 1.
      // If val = max (best), we want 0.
      // If val = min, we want 100.
      normalizedY = 100 - ((r.performanceValue - minVal) / range) * 100
    }
    
    return { x, y: normalizedY, val: r.performanceValue, mark: r.mark, date: r.date }
  })
})

const bestPoint = computed(() => {
  if (points.value.length === 0) return null
  // Find point matching bestValue
  return points.value.find(p => p.val === bestValue.value)
})

// SVG Path Command
const pathD = computed(() => {
  if (points.value.length === 0) return ''
  return points.value.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`
  }, '')
})

// Area Path Command (close the loop to bottom)
const areaD = computed(() => {
  if (points.value.length === 0) return ''
  return `${pathD.value} L 100 100 L 0 100 Z`
})

function formatMark(val: number): string {
  if (!val) return '-'
  
  if (isTrack.value) {
    // Track events: val is in milliseconds (e.g. 48250 for 48.25s)
    // Convert to seconds
    const seconds = val / 1000
    
    if (seconds < 60) {
      return seconds.toFixed(2)
    } else {
      const mins = Math.floor(seconds / 60)
      const secs = (seconds % 60).toFixed(2).padStart(5, '0')
      return `${mins}:${secs}`
    }
  } else {
    // Field events: val is likely in meters (e.g. 8.25)
    return val.toFixed(2)
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>

<style scoped>
.progression-slide {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: var(--spacing-lg);
}

.slide-title {
  font-family: var(--font-family-heading);
  font-size: clamp(2.5rem, 8vw, 4rem); /* Responsive title */
  color: white;
  margin: var(--spacing-xl) 0;
  text-transform: uppercase;
  text-align: center;
  line-height: 0.9;
}

.graph-container {
  width: 100%;
  height: 60%; /* Increased height */
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding-right: var(--spacing-sm);
  color: var(--color-text-muted);
  font-family: var(--font-family-heading);
  font-size: clamp(0.8rem, 3vw, 1.2rem); /* Responsive axis labels */
}

.graph-wrapper {
  flex: 1;
  height: 100%;
  position: relative;
  border-left: 2px solid rgba(255, 255, 255, 0.1);
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.graph-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.grid-line {
  stroke: rgba(255, 255, 255, 0.05);
  stroke-width: 0.5;
}

.graph-line {
  fill: none;
  stroke: var(--color-accent-primary);
  stroke-width: 2; /* Slightly thicker */
  stroke-linecap: round;
  stroke-linejoin: round;
  filter: drop-shadow(0 0 8px var(--color-accent-primary));
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: drawLine 2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards 0.5s;
}

.graph-area {
  fill: var(--color-accent-primary);
  opacity: 0;
  animation: fadeInArea 1s ease-out forwards 2s;
}

.data-point {
  fill: white;
  opacity: 0;
  animation: fadeInPoint 0.3s ease-out forwards;
}

.x-axis {
  position: absolute;
  bottom: -30px;
  left: 0;
  width: 100%;
  height: 20px;
}

.date-label {
  position: absolute;
  transform: translateX(-50%) rotate(-45deg);
  font-family: var(--font-family-primary);
  font-size: 0.7rem;
  color: var(--color-text-muted);
  white-space: nowrap;
  opacity: 0;
  animation: fadeInPoint 0.3s ease-out forwards;
  animation-delay: 1.5s; /* Delay until graph is drawn */
}

.best-mark-label {
  position: absolute;
  transform: translate(-50%, -120%);
  background: var(--color-accent-secondary);
  padding: 4px 8px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards 2.5s;
  opacity: 0;
  z-index: 10;
}

.best-mark-label::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 6px 6px 0;
  border-style: solid;
  border-color: var(--color-accent-secondary) transparent transparent transparent;
}

.label-text {
  font-size: 0.7rem;
  font-weight: 700;
  color: white;
}

.label-value {
  font-family: var(--font-family-heading);
  font-size: clamp(1rem, 4vw, 1.5rem); /* Responsive label value */
  line-height: 1;
  color: white;
}

.slide-footer {
  margin-top: var(--spacing-md);
  text-align: center;
  padding-bottom: var(--spacing-md);
}

.footer-text {
  font-size: clamp(1rem, 4vw, 1.5rem);
  color: var(--color-text-secondary);
  font-family: var(--font-family-heading);
  letter-spacing: 2px;
}

.highlight {
  color: var(--color-accent-primary);
  font-size: clamp(1.5rem, 6vw, 2.5rem);
}

@keyframes drawLine {
  to { stroke-dashoffset: 0; }
}

@keyframes fadeInArea {
  to { opacity: 0.1; }
}

@keyframes fadeInPoint {
  to { opacity: 1; }
}

@keyframes bounceIn {
  from { opacity: 0; transform: translate(-50%, -100%) scale(0.5); }
  to { opacity: 1; transform: translate(-50%, -120%) scale(1); }
}

@media (max-width: 768px) {
  .progression-slide {
    padding: var(--spacing-md);
  }
  
  .graph-container {
    height: 65%; /* Even taller on mobile */
  }
  
  .date-label {
    font-size: 0.6rem;
  }
}
</style>
