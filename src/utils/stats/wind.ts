import type { AthleteResult } from '@/types/athleteDetails'

export interface WindAnalysis {
  averageWind: number | null
  hasWindData: boolean
}

/**
 * Analyze wind conditions from results
 * @param results - Athlete results (pre-filtered by year if needed)
 * @returns Wind analysis: average and whether data exists
 */
export function analyzeWindConditions(results: AthleteResult[]): WindAnalysis {
  const resultsWithWind = results.filter(r => r.wind !== null && r.wind !== undefined)
  
  if (resultsWithWind.length === 0) {
    return { averageWind: null, hasWindData: false }
  }

  const totalWind = resultsWithWind.reduce((sum, r) => sum + (r.wind || 0), 0)
  const averageWind = totalWind / resultsWithWind.length

  return {
    averageWind: Math.round(averageWind * 10) / 10, // Round to 1 decimal
    hasWindData: true
  }
}
