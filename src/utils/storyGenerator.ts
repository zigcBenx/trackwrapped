import type { AthleteDetails, AthleteResult, ProcessedAthleteStats } from '@/types/athleteDetails'

export function processAthleteData(
  details: AthleteDetails,
  results: AthleteResult[]
): ProcessedAthleteStats {
  // Calculate years active
  const activeSeasons = details.activeSeasons || []
  const yearsActive = activeSeasons.length
  const firstYear = activeSeasons.length > 0 ? Math.min(...activeSeasons) : 0
  const lastYear = activeSeasons.length > 0 ? Math.max(...activeSeasons) : 0

  // Total competitions
  const totalCompetitions = results.length

  // Determine main discipline and category
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

  // Best performance
  const bestPerformance = details.personalbests && details.personalbests.length > 0
    ? details.personalbests.reduce((best, current) =>
        current.resultScore > best.resultScore ? current : best
      )
    : null

  // Check for world records
  const hasWorldRecord = details.personalbests?.some(pb => pb.records.includes('WR')) || false

  // Calculate top placements
  const topPlacements = results.filter(r => r.place <= 3).length

  // Calculate average place
  const validPlacements = results.filter(r => r.place > 0)
  const averagePlace = validPlacements.length > 0
    ? validPlacements.reduce((sum, r) => sum + r.place, 0) / validPlacements.length
    : 0

  // Determine if improving (compare recent vs older results)
  const isImproving = analyzeProgression(results)

  // Competition frequency
  const competitionFrequency = categorizeCompetitionFrequency(totalCompetitions, yearsActive)

  // Indoor vs Outdoor competitions
  const indoorCompetitions = results.filter(r => r.location.indoor).length
  const outdoorCompetitions = results.filter(r => !r.location.indoor).length

  // Current season competitions (2024 or latest year)
  const currentYear = new Date().getFullYear()
  const currentSeasonCompetitions = results.filter(r => {
    const year = new Date(r.date).getFullYear()
    return year === currentYear || year === lastYear
  }).length

  // Average result score
  const validScores = results.filter(r => r.resultScore > 0)
  const averageResultScore = validScores.length > 0
    ? Math.round(validScores.reduce((sum, r) => sum + r.resultScore, 0) / validScores.length)
    : 0

  // Victory rate (podium finishes / total competitions)
  const victoryRate = totalCompetitions > 0
    ? Math.round((topPlacements / totalCompetitions) * 100)
    : 0

  // Analyze rivals and nemesis
  const rivalAnalysis = analyzeRivals(results, details.firstname, details.lastname)

  // Average wind speed (for sprint/jump events)
  const windAnalysis = analyzeWindConditions(results)

  return {
    yearsActive,
    firstYear,
    lastYear,
    totalCompetitions,
    mainDiscipline,
    disciplineCategory,
    bestPerformance,
    hasWorldRecord,
    topPlacements,
    averagePlace,
    isImproving,
    competitionFrequency,
    indoorCompetitions,
    outdoorCompetitions,
    currentSeasonCompetitions,
    averageResultScore,
    victoryRate,
    nemesis: rivalAnalysis.nemesis,
    topRivals: rivalAnalysis.topRivals,
    averageWind: windAnalysis.averageWind,
    hasWindData: windAnalysis.hasWindData
  }
}

interface RivalAnalysis {
  nemesis: { name: string; losses: number } | null
  topRivals: Array<{ name: string; meetings: number }>
}

function analyzeRivals(results: AthleteResult[], firstName: string, lastName: string): RivalAnalysis {
  // Track all competitors we've faced
  const competitorMap = new Map<string, {
    name: string
    meetings: number
    losses: number  // times they beat us
  }>()

  // Analyze each result
  results.forEach(result => {
    if (!result.competitors || result.competitors.length === 0) return

    // Find our place in this competition
    const ourPlace = result.place

    // Analyze each competitor
    result.competitors.forEach((competitor: import('@/types/athleteDetails').Competitor) => {
      // Skip ourselves
      if (competitor.firstname === firstName && competitor.lastname === lastName) return

      const competitorKey = `${competitor.firstname} ${competitor.lastname}`
      
      if (!competitorMap.has(competitorKey)) {
        competitorMap.set(competitorKey, {
          name: competitorKey,
          meetings: 0,
          losses: 0
        })
      }

      const competitorData = competitorMap.get(competitorKey)!
      competitorData.meetings++

      // If they placed better than us, count it as a loss
      if (competitor.place < ourPlace && competitor.place > 0 && ourPlace > 0) {
        competitorData.losses++
      }
    })
  })

  // Convert to array and sort
  const competitors = Array.from(competitorMap.values())

  // Find nemesis (person who beat us most often)
  const nemesis = competitors
    .filter(c => c.losses > 0)
    .sort((a, b) => b.losses - a.losses)[0]

  // Find top rivals (people we competed against most)
  const topRivals = competitors
    .filter(c => c.meetings >= 2)  // At least 2 meetings
    .sort((a, b) => b.meetings - a.meetings)
    .slice(0, 3)
    .map(c => ({ name: c.name, meetings: c.meetings }))

  return {
    nemesis: nemesis ? { name: nemesis.name, losses: nemesis.losses } : null,
    topRivals
  }
}

interface WindAnalysis {
  averageWind: number | null
  hasWindData: boolean
}

function analyzeWindConditions(results: AthleteResult[]): WindAnalysis {
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
