import type { AthleteResult } from '@/types/athleteDetails'

export interface RivalAnalysis {
  nemesis: { name: string; losses: number } | null
  topRivals: Array<{ name: string; meetings: number }>
}

/**
 * Analyze rivals and nemesis from competition results
 * @param results - Athlete results with competitor data
 * @param firstName - Athlete's first name
 * @param lastName - Athlete's last name
 * @returns Rival analysis: nemesis and top rivals
 */
export function analyzeRivals(
  results: AthleteResult[],
  firstName: string,
  lastName: string
): RivalAnalysis {
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
