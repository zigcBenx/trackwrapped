import type { AthleteDetails, AthleteResult } from '@/types/athleteDetails'

/**
 * Calculate career statistics (years active, first/last year)
 * @param details - Athlete details
 * @param results - Athlete results
 * @param year - Optional year for filtering (null = lifetime)
 * @returns Career stats: yearsActive, firstYear, lastYear
 */
export function calculateCareerStats(
  details: AthleteDetails,
  results: AthleteResult[],
  year?: number | null
) {
  const activeSeasons = details.activeSeasons || []
  
  if (year) {
    // For a specific year, just return that year's info
    const hasResultsThisYear = results.some(r => new Date(r.date).getFullYear() === year)
    const age = details.birthdate 
      ? new Date().getFullYear() - new Date(details.birthdate).getFullYear()
      : null
    return {
      yearsActive: hasResultsThisYear ? 1 : 0,
      firstYear: year,
      lastYear: year,
      age
    }
  }
  
  // Lifetime stats
  const yearsActive = activeSeasons.length
  const firstYear = activeSeasons.length > 0 ? Math.min(...activeSeasons) : 0
  const lastYear = activeSeasons.length > 0 ? Math.max(...activeSeasons) : 0
  
  // Calculate age if birthdate available
  const age = details.birthdate 
    ? new Date().getFullYear() - new Date(details.birthdate).getFullYear()
    : null
  
  return {
    yearsActive,
    firstYear,
    lastYear,
    age
  }
}
