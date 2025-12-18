import type { AthleteDetails, AthleteResult, PersonalBest } from '@/types/athleteDetails'

/**
 * Calculate performance statistics
 * @param details - Athlete details
 * @param results - Athlete results (should include ALL results for season comparison)
 * @param currentYearResults - Results for current season only (for most stats)
 * @returns Performance stats: best, WR, placements, progression, victory rate
 */
export function calculatePerformanceStats(
  details: AthleteDetails,
  results: AthleteResult[],
  currentYearResults?: AthleteResult[]
) {
  // Use currentYearResults for most calculations if provided, otherwise use all results
  const resultsForStats = currentYearResults || results
  // Best performance from personal bests
  const bestPerformance = details.personalbests && details.personalbests.length > 0
    ? details.personalbests.reduce((best, current) =>
        current.resultScore > best.resultScore ? current : best
      )
    : null

  // Check for world records
  const hasWorldRecord = details.personalbests?.some(pb => pb.records.includes('WR')) || false

  // Top placements (podium finishes) - only count true finals
  // Filter for finals where everyone competed together (not multi-heat finals like "F1", "F2", "F3")
  // True finals have race = "F" or "FA" (or "FB"), not race values with numbers
  const finalResults = resultsForStats.filter(r => {
    const isTrueFinal = r.race === 'F' || r.race === 'FA' || r.race === 'FB'
    return isTrueFinal && r.place > 0 && r.place <= 3
  })
  const topPlacements = finalResults.length

  // Average place
  const validPlacements = resultsForStats.filter(r => r.place > 0)
  const averagePlace = validPlacements.length > 0
    ? validPlacements.reduce((sum, r) => sum + r.place, 0) / validPlacements.length
    : 0

  // Progression analysis
  const isImproving = analyzeProgression(resultsForStats)

  // Average result score
  const validScores = resultsForStats.filter(r => typeof r.resultScore === 'number' && !isNaN(r.resultScore) && r.resultScore > 0)
  const averageResultScore = validScores.length > 0
    ? Math.round(validScores.reduce((sum, r) => sum + r.resultScore, 0) / validScores.length)
    : 0

  // Victory rate (podium finishes in finals / total competitions)
  // This shows what % of competitions you reached the final AND placed on podium
  const totalCompetitions = resultsForStats.length

  const victoryRate = totalCompetitions > 0
    ? Math.round((topPlacements / totalCompetitions) * 100)
    : 0

  // Season-over-season comparison - always use ALL results, not filtered
  const seasonComparison = calculateSeasonComparison(results)

  // Percentile ranking based on BEST score (Power Level)
  // We use the current season's best score for the power level
  const percentile = calculatePercentile(seasonComparison.currentSeasonBest)

  return {
    bestPerformance,
    hasWorldRecord,
    topPlacements,
    averagePlace,
    isImproving,
    averageResultScore,
    victoryRate,
    currentSeasonBestScore: seasonComparison.currentSeasonBest,
    lastSeasonBestScore: seasonComparison.lastSeasonBest,
    scoreChangePercent: seasonComparison.changePercent,
    percentileRank: percentile
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

function calculateSeasonComparison(results: AthleteResult[]) {
  const currentYear = new Date().getFullYear()
  const lastYear = currentYear - 1

  // Get results for current and last season
  const currentSeasonResults = results.filter(r => {
    const year = new Date(r.date).getFullYear()
    return year === currentYear && r.resultScore > 0
  })

  const lastSeasonResults = results.filter(r => {
    const year = new Date(r.date).getFullYear()
    return year === lastYear && r.resultScore > 0
  })

  // Calculate BEST scores
  const currentSeasonBest = currentSeasonResults.length > 0
    ? Math.max(...currentSeasonResults.map(r => r.resultScore))
    : 0

  const lastSeasonBest = lastSeasonResults.length > 0
    ? Math.max(...lastSeasonResults.map(r => r.resultScore))
    : 0

  // Calculate percent change
  const changePercent = lastSeasonBest > 0
    ? Math.round(((currentSeasonBest - lastSeasonBest) / lastSeasonBest) * 100)
    : 0

  return {
    currentSeasonBest,
    lastSeasonBest,
    changePercent
  }
}

/**
 * Calculate percentile ranking based on BEST result score
 * Fixed thresholds based on World Athletics scoring system
 */
function calculatePercentile(bestScore: number): { rank: string; label: string } {
  // World Athletics result scores typically range from ~100 (beginner) to 1400+ (elite)
  // These thresholds match the ShareCardSlide definitions

  if (bestScore >= 1250) {
    return { rank: '0.1%', label: 'LEGENDARY' }
  } else if (bestScore >= 1150) {
    return { rank: '1%', label: 'WORLD CLASS' }
  } else if (bestScore >= 1050) {
    return { rank: '5%', label: 'INTERNATIONAL' }
  } else if (bestScore >= 950) {
    return { rank: '10%', label: 'NATIONAL CLASS' }
  } else if (bestScore >= 800) {
    return { rank: '20%', label: 'LOCAL HERO' }
  } else {
    return { rank: '>50%', label: 'ROOKIE' }
  }
}
