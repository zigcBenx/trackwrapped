<template>
  <div class="slide-content entry-standards-slide">
    <h2 class="slide-title slide-in-left">THE CHASE</h2>
    
    <div class="standards-container fade-in-up">
      <!-- Current Status -->
      <div class="current-status">
        <span class="label">SEASON BEST</span>
        <span class="value highlight">{{ seasonBest }}</span>
      </div>

      <!-- The Gap Visual -->
      <div class="gap-visual">
        <div class="track-line"></div>
        
        <!-- Athlete Marker -->
        <div class="marker athlete-marker" :style="{ left: `${athletePosition}%` }">
          <div class="marker-icon">🏃</div>
          <div class="marker-label">YOU</div>
        </div>

        <!-- Standard Marker -->
        <div class="marker standard-marker" style="left: 80%">
          <div class="marker-icon">🏆</div>
          <div class="marker-label">WORLD STD</div>
          <div class="marker-value">{{ standardMark }}</div>
        </div>
      </div>

      <!-- The Difference -->
      <div class="difference-display" :class="{ 'qualified': isQualified }">
        <span class="diff-label">TO QUALIFY</span>
        <span class="diff-value">{{ diffText }}</span>
      </div>
    </div>

    <div class="slide-footer fade-in-up" style="animation-delay: 500ms">
      <p class="footer-text">
        KEEP PUSHING. <span class="highlight">NEVER SETTLE.</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  seasonBest: string
  mainDiscipline: string
  gender: string | null
}

const props = defineProps<Props>()

// Mock Standards (In a real app, this would come from an API or comprehensive DB)
// World Athletics Entry Standards (approximate for 2025/Elite level)
const STANDARDS: Record<string, Record<string, string>> = {
  '100m': { 'Male': '10.00', 'Female': '11.07' },
  '200m': { 'Male': '20.16', 'Female': '22.57' },
  '400m': { 'Male': '45.00', 'Female': '50.95' },
  '800m': { 'Male': '1:44.70', 'Female': '1:59.30' },
  '1500m': { 'Male': '3:33.50', 'Female': '4:02.50' },
  '5000m': { 'Male': '13:07.00', 'Female': '14:52.00' },
  '10000m': { 'Male': '27:10.00', 'Female': '30:40.00' },
  '110m Hurdles': { 'Male': '13.27', 'Female': '12.77' }, // 100mH for female mapped here
  '400m Hurdles': { 'Male': '48.70', 'Female': '54.85' },
  '3000m Steeplechase': { 'Male': '8:15.00', 'Female': '9:23.00' },
  'High Jump': { 'Male': '2.33', 'Female': '1.97' },
  'Pole Vault': { 'Male': '5.82', 'Female': '4.73' },
  'Long Jump': { 'Male': '8.27', 'Female': '6.86' },
  'Triple Jump': { 'Male': '17.22', 'Female': '14.55' },
  'Shot Put': { 'Male': '21.50', 'Female': '18.80' },
  'Discus Throw': { 'Male': '67.20', 'Female': '64.50' },
  'Hammer Throw': { 'Male': '78.20', 'Female': '73.60' },
  'Javelin Throw': { 'Male': '85.50', 'Female': '64.00' },
  'Decathlon': { 'Male': '8460', 'Female': '6480' }, // Heptathlon for female
}

function normalizeDiscipline(disc: string): string {
  if (!disc) return ''
  const d = disc.toLowerCase()
  
  if (d.includes('100') && d.includes('hurdles')) return '110m Hurdles' // Covers 100mH and 110mH
  if (d.includes('110') && d.includes('hurdles')) return '110m Hurdles'
  if (d.includes('400') && d.includes('hurdles')) return '400m Hurdles'
  if (d.includes('steeplechase')) return '3000m Steeplechase'
  if (d.includes('high jump')) return 'High Jump'
  if (d.includes('pole vault')) return 'Pole Vault'
  if (d.includes('long jump')) return 'Long Jump'
  if (d.includes('triple jump')) return 'Triple Jump'
  if (d.includes('shot put')) return 'Shot Put'
  if (d.includes('discus')) return 'Discus Throw'
  if (d.includes('hammer')) return 'Hammer Throw'
  if (d.includes('javelin')) return 'Javelin Throw'
  if (d.includes('decathlon') || d.includes('heptathlon')) return 'Decathlon'
  
  // Track events
  if (d === '100m' || d === '100 m') return '100m'
  if (d === '200m' || d === '200 m') return '200m'
  if (d === '400m' || d === '400 m') return '400m'
  if (d === '800m' || d === '800 m') return '800m'
  if (d.includes('1500')) return '1500m'
  if (d.includes('5000')) return '5000m'
  if (d.includes('10000')) return '10000m'

  return disc // Fallback
}

const standardMark = computed(() => {
  const genderKey = props.gender === 'Male' ? 'Male' : 'Female'
  const normalizedDisc = normalizeDiscipline(props.mainDiscipline)
  
  // Handle 100mH vs 110mH gender difference
  if (normalizedDisc === '110m Hurdles' && genderKey === 'Female') {
    // Logic handled in map, but just ensuring key exists
  }

  return STANDARDS[normalizedDisc]?.[genderKey] || '---'
})

// Helper to parse marks (time or distance)
function parseMark(mark: string): number {
  if (!mark || mark === '-' || mark === '---') return 0
  if (mark.includes(':')) {
    const parts = mark.split(':')
    const min = parts[0] ? parseFloat(parts[0]) : 0
    const sec = parts[1] ? parseFloat(parts[1]) : 0
    return min * 60 + sec
  }
  return parseFloat(mark)
}

const isTrack = computed(() => {
  // Simple heuristic: if standard is time-like or discipline is known track
  return ['100m', '200m', '400m', '800m', '1500m', 'Hurdles'].some(d => props.mainDiscipline.includes(d))
})

const isQualified = computed(() => {
  const sb = parseMark(props.seasonBest)
  const std = parseMark(standardMark.value)
  if (!sb || !std) return false
  
  return isTrack.value ? sb <= std : sb >= std
})

const diffText = computed(() => {
  const sb = parseMark(props.seasonBest)
  const std = parseMark(standardMark.value)
  if (!sb || !std) return '---'

  const diff = Math.abs(sb - std)
  const sign = isQualified.value ? '-' : '+'
  
  return `${sign}${diff.toFixed(2)}`
})

const athletePosition = computed(() => {
  const sb = parseMark(props.seasonBest)
  const std = parseMark(standardMark.value)
  if (!sb || !std) return 10 // Default start pos
  
  // Calculate relative position (0-100)
  // Let's say range is +/- 10% of standard
  // If qualified, athlete is past the standard (right side > 80%)
  // If not, athlete is approaching (left side < 80%)
  
  if (isQualified.value) return 90
  
  // Calculate percentage of standard achieved
  let ratio: number
  if (isTrack.value) {
    // Time: lower is better. 
    // e.g. SB 10.5, Std 10.0. Ratio = 10.0 / 10.5 = 0.95
    ratio = std / sb
  } else {
    // Distance: higher is better
    // e.g. SB 8.00, Std 8.27. Ratio = 8.00 / 8.27 = 0.96
    ratio = sb / std
  }
  
  // Map ratio (e.g. 0.8 to 1.0) to position (e.g. 10% to 80%)
  // Let's assume min display ratio is 0.8
  const minRatio = 0.8
  const normalized = Math.max(0, (ratio - minRatio) / (1 - minRatio))
  return 10 + (normalized * 70) // 10% to 80%
})

</script>

<style scoped>
.entry-standards-slide {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: var(--spacing-lg);
}

.slide-title {
  font-family: var(--font-family-heading);
  font-size: 4rem;
  color: white;
  margin-bottom: var(--spacing-2xl);
  text-transform: uppercase;
  text-align: center;
  line-height: 0.9;
}

.standards-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-2xl);
}

.current-status {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.label {
  font-family: var(--font-family-heading);
  font-size: 1.5rem;
  color: var(--color-text-secondary);
  letter-spacing: 2px;
}

.value {
  font-family: var(--font-family-heading);
  font-size: 6rem;
  line-height: 0.9;
  color: white;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
}

.gap-visual {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  position: relative;
  margin: var(--spacing-xl) 0;
}

.track-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, var(--color-accent-primary), transparent);
  opacity: 0.5;
}

.marker {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: left 1s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.marker-icon {
  font-size: 2rem;
  margin-bottom: 8px;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
}

.marker-label {
  font-family: var(--font-family-heading);
  font-size: 1rem;
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.marker-value {
  font-family: var(--font-family-heading);
  font-size: 1.2rem;
  color: white;
}

.standard-marker .marker-icon {
  font-size: 2.5rem;
  filter: drop-shadow(0 0 15px var(--color-accent-secondary));
}

.difference-display {
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  padding: var(--spacing-md) var(--spacing-xl);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transform: skew(-10deg);
}

.difference-display.qualified {
  border-color: var(--color-accent-primary);
  box-shadow: 0 0 20px rgba(204, 255, 0, 0.2);
}

.diff-label {
  display: block;
  font-family: var(--font-family-heading);
  font-size: 1.2rem;
  color: var(--color-text-secondary);
  margin-bottom: 4px;
}

.diff-value {
  font-family: var(--font-family-heading);
  font-size: 3rem;
  color: var(--color-accent-secondary);
}

.qualified .diff-value {
  color: var(--color-accent-primary);
}

.slide-footer {
  margin-top: auto;
  text-align: center;
}

.footer-text {
  font-size: 1.2rem;
  color: var(--color-text-secondary);
  font-family: var(--font-family-heading);
  letter-spacing: 2px;
}

.highlight {
  color: var(--color-accent-primary);
}
</style>
