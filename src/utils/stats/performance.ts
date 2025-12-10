import type { AthleteDetails, AthleteResult, PersonalBest } from '@/types/athleteDetails'

/**
 * Calculate performance statistics
 * @param details - Athlete details
 * @param results - Athlete results (pre-filtered by year if needed)
 * @returns Performance stats: best, WR, placements, progression, victory rate
 */
export function calculatePerformanceStats(
  details: AthleteDetails,
  results: AthleteResult[]
) {
  // Best performance from personal bests
  const bestPerformance = details.personalbests && details.personalbests.length > 0
    ? details.personalbests.reduce((best, current) =>
        current.resultScore > best.resultScore ? current : best
      )
    : null

  // Check for world records
  const hasWorldRecord = details.personalbests?.some(pb => pb.records.includes('WR')) || false

  // Top placements (podium finishes)
  const topPlacements = results.filter(r => r.place <= 3).length

  // Average place
  const validPlacements = results.filter(r => r.place > 0)
  const averagePlace = validPlacements.length > 0
    ? validPlacements.reduce((sum, r) => sum + r.place, 0) / validPlacements.length
    : 0

  // Progression analysis
  const isImproving = analyzeProgression(results)

  // Average result score
  const validScores = results.filter(r => r.resultScore > 0)
  const averageResultScore = validScores.length > 0
    ? Math.round(validScores.reduce((sum, r) => sum + r.resultScore, 0) / validScores.length)
    : 0

  // Victory rate (podium finishes / total)
  const totalCompetitions = results.length
  const victoryRate = totalCompetitions > 0
    ? Math.round((topPlacements / totalCompetitions) * 100)
    : 0

  return {
    bestPerformance,
    hasWorldRecord,
    topPlacements,
    averagePlace,
    isImproving,
    averageResultScore,
    victoryRate
  }
}

function analyzeProgression(results: AthleteResult[]): boolean {
  if (results.length < 4) return true // Not enough data, assume improving

  // Sort by date
  const sorted = [...results].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  // Compare first half vs second half average scores
  const midpoint = Math.floor(sorted.length / 2)
  const firstHalf = sorted.slice(0, midpoint)
  const secondHalf = sorted.slice(midpoint)

  const firstAvg = firstHalf.reduce((sum, r) => sum + r.resultScore, 0) / firstHalf.length
  const secondAvg = secondHalf.reduce((sum, r) => sum + r.resultScore, 0) / secondHalf.length

  return secondAvg > firstAvg
}
