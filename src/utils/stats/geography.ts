import type { AthleteResult } from '@/types/athleteDetails'

/**
 * Calculate geography statistics (countries competed in)
 * @param results - Athlete results
 * @returns Countries list and count
 */
export function calculateGeographyStats(results: AthleteResult[]) {
  // Extract unique countries from competition locations
  const countries = new Set<string>()
  
  results.forEach(result => {
    if (result.location?.country) {
      countries.add(result.location.country)
    }
  })
  
  const countriesList = Array.from(countries).sort()
  
  return {
    countries: countriesList,
    countriesCount: countriesList.length
  }
}
