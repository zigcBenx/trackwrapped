import type { AthleteResult } from '@/types/athleteDetails'

/**
 * Determine main discipline and category
 * @param results - Athlete results (pre-filtered by year if needed)
 * @returns Main discipline and category
 */
export function calculateDisciplineStats(results: AthleteResult[]) {
  // Count disciplines
  const disciplineCounts: Record<string, number> = {}
  results.forEach(result => {
    disciplineCounts[result.discipline] = (disciplineCounts[result.discipline] || 0) + 1
  })

  const mainDiscipline = Object.keys(disciplineCounts).length > 0
    ? Object.keys(disciplineCounts).reduce((a, b) =>
        disciplineCounts[a] > disciplineCounts[b] ? a : b
      )
    : 'Unknown'

  const disciplineCategory = categorizeDiscipline(mainDiscipline)

  return {
    mainDiscipline,
    disciplineCategory
  }
}

function categorizeDiscipline(discipline: string): 'sprint' | 'distance' | 'jump' | 'throw' | 'combined' {
  const lower = discipline.toLowerCase()

  // Sprint events
  if (lower.includes('100') || lower.includes('200') || lower.includes('400') || 
      lower.includes('60') && !lower.includes('1500')) {
    return 'sprint'
  }

  // Distance events
  if (lower.includes('800') || lower.includes('1500') || lower.includes('3000') ||
      lower.includes('5000') || lower.includes('10000') || lower.includes('marathon') ||
      lower.includes('steeplechase')) {
    return 'distance'
  }

  // Jump events
  if (lower.includes('jump') || lower.includes('vault')) {
    return 'jump'
  }

  // Throw events
  if (lower.includes('throw') || lower.includes('shot') || lower.includes('discus') ||
      lower.includes('hammer') || lower.includes('javelin')) {
    return 'throw'
  }

  // Combined events
  if (lower.includes('heptathlon') || lower.includes('decathlon') || lower.includes('pentathlon')) {
    return 'combined'
  }

  return 'sprint' // Default
}
