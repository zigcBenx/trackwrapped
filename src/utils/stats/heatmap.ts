import type { AthleteResult } from '@/types/athleteDetails'

/**
 * Calculate competition heatmap data for GitHub-style calendar
 * Groups competitions by week and calculates intensity
 * @param results - Athlete results
 * @returns Weekly competition data for heatmap
 */
export function calculateCompetitionHeatmap(results: AthleteResult[]) {
  // Get the current year or most recent year from results
  const years = results.map(r => new Date(r.date).getFullYear())
  const targetYear = years.length > 0 ? Math.max(...years) : new Date().getFullYear()
  
  // Filter results for target year
  const yearResults = results.filter(r => new Date(r.date).getFullYear() === targetYear)
  
  // Create a map of week number to competition count
  const weekMap = new Map<number, number>()
  
  yearResults.forEach(result => {
    const date = new Date(result.date)
    const weekNum = getWeekNumber(date)
    weekMap.set(weekNum, (weekMap.get(weekNum) || 0) + 1)
  })
  
  // Generate array of 52 weeks with counts
  const weeks: Array<{ week: number; count: number; intensity: number }> = []
  
  // Find max count for intensity calculation
  const maxCount = Math.max(...Array.from(weekMap.values()), 1)
  
  for (let week = 1; week <= 52; week++) {
    const count = weekMap.get(week) || 0
    const intensity = count > 0 ? Math.min(Math.ceil((count / maxCount) * 4), 4) : 0
    weeks.push({ week, count, intensity })
  }
  
  return {
    weeks,
    year: targetYear,
    totalCompetitions: yearResults.length
  }
}

/**
 * Get ISO week number for a date
 * @param date - Date to get week number for
 * @returns Week number (1-52/53)
 */
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNum = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  return weekNum
}
