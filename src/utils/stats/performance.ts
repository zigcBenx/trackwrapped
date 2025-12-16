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

  // Debug logging
  console.log('RESULTS FOR STATS', resultsForStats)
  console.log('ALL RACES', resultsForStats.map(r => ({ race: r.race, place: r.place, competition: r.competition })))
  console.log('TRUE FINALS ONLY (F/FA/FB)', finalResults.map(r => ({ race: r.race, place: r.place, competition: r.competition })))
  console.log('TOP PLACEMENTS IN FINALS', topPlacements)

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

  console.log('TOTAL COMPETITIONS', totalCompetitions)
  console.log('PODIUM FINISHES IN FINALS', topPlacements)
  console.log('VICTORY RATE', victoryRate)

  // Season-over-season comparison - always use ALL results, not filtered
  const seasonComparison = calculateSeasonComparison(results)

  // Percentile ranking based on average score
  const percentile = calculatePercentile(averageResultScore)

  return {
    bestPerformance,
    hasWorldRecord,
    topPlacements,
    averagePlace,
    isImproving,
    averageResultScore,
    victoryRate,
    currentSeasonAvgScore: seasonComparison.currentSeasonAvg,
    lastSeasonAvgScore: seasonComparison.lastSeasonAvg,
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

  // Calculate averages
  const currentSeasonAvg = currentSeasonResults.length > 0
    ? Math.round(currentSeasonResults.reduce((sum, r) => sum + r.resultScore, 0) / currentSeasonResults.length)
    : 0

  const lastSeasonAvg = lastSeasonResults.length > 0
    ? Math.round(lastSeasonResults.reduce((sum, r) => sum + r.resultScore, 0) / lastSeasonResults.length)
    : 0

  // Calculate percent change
  const changePercent = lastSeasonAvg > 0
    ? Math.round(((currentSeasonAvg - lastSeasonAvg) / lastSeasonAvg) * 100)
    : 0

  return {
    currentSeasonAvg,
    lastSeasonAvg,
    changePercent
  }
}

/**
 * Calculate percentile ranking based on average result score
 * Fixed thresholds based on World Athletics scoring system
 */
function calculatePercentile(avgScore: number): { rank: string; label: string } {
  // World Athletics result scores typically range from ~100 (beginner) to 1400+ (elite)
  // These thresholds are approximate based on competitive levels

  if (avgScore >= 1200) {
    return { rank: '0.1%', label: 'World Class Elite' }
  } else if (avgScore >= 1150) {
    return { rank: '1%', label: 'Elite International' }
  } else if (avgScore >= 1100) {
    return { rank: '5%', label: 'National Elite' }
  } else if (avgScore >= 1000) {
    return { rank: '10%', label: 'Advanced Competitive' }
  } else if (avgScore >= 900) {
    return { rank: '15%', label: 'Competitive' }
  } else if (avgScore >= 800) {
    return { rank: '20%', label: 'Club Level' }
  } else if (avgScore >= 600) {
    return { rank: '50%', label: 'Recreational' }
  } else {
    return { rank: '>50%', label: 'Developing' }
  }
}
