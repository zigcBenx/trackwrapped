import type { AthleteResult } from '@/types/athleteDetails'

/**
 * Calculate competition statistics
 * @param results - Athlete results (pre-filtered by year if needed)
 * @param yearsActive - Number of years active (for frequency calculation)
 * @returns Competition stats: total, frequency, indoor/outdoor counts
 */
export function calculateCompetitionStats(results: AthleteResult[], yearsActive: number) {
  const totalCompetitions = results.length
  
  // Competition frequency
  const competitionFrequency = categorizeCompetitionFrequency(totalCompetitions, yearsActive)
  
  // Indoor vs Outdoor
  const indoorCompetitions = results.filter(r => r.location.indoor).length
  const outdoorCompetitions = results.filter(r => !r.location.indoor).length
  
  return {
    totalCompetitions,
    competitionFrequency,
    indoorCompetitions,
    outdoorCompetitions
  }
}

function categorizeCompetitionFrequency(
  total: number,
  years: number
): 'rare' | 'occasional' | 'regular' | 'frequent' {
  if (years === 0) return 'rare'

  const perYear = total / years

  if (perYear < 2) return 'rare'
  if (perYear < 5) return 'occasional'
  if (perYear < 10) return 'regular'
  return 'frequent'
}
