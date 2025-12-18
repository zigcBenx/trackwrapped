import type { AthleteResult } from '@/types/athleteDetails'

export interface RivalAnalysis {
  nemesis: { name: string; losses: number; meetings: number } | null
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
    meetingNames: string[]
    lossMeetingNames: string[]
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
          losses: 0,
          meetingNames: [],
          lossMeetingNames: []
        })
      }

      const competitorData = competitorMap.get(competitorKey)!
      
      // Only count meeting if we haven't seen it for this competitor yet
      if (!competitorData.meetingNames.includes(result.competition)) {
        competitorData.meetings++
        competitorData.meetingNames.push(result.competition)
      }

      // If they placed better than us, count it as a loss (only once per meeting)
      if (competitor.place < ourPlace && competitor.place > 0 && ourPlace > 0) {
        if (!competitorData.lossMeetingNames.includes(result.competition)) {
          competitorData.losses++
          competitorData.lossMeetingNames.push(result.competition)
        }
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
  const topRivalsRaw = competitors
    .filter(c => c.meetings >= 2)  // At least 2 meetings
    .sort((a, b) => b.meetings - a.meetings)
    .slice(0, 3)

  const topRivals = topRivalsRaw.map(c => ({ name: c.name, meetings: c.meetings }))

  // console.log('--- RIVALS ANALYSIS ---')
  // console.log('Total Competitors:', competitors.length)
  // console.log('Top 5 by Meetings:', JSON.stringify(competitors.sort((a, b) => b.meetings - a.meetings).slice(0, 5), null, 2))
  // console.log('Top 5 by Losses:', JSON.stringify(competitors.sort((a, b) => b.losses - a.losses).slice(0, 5), null, 2))
  // console.log('NEMESIS:', JSON.stringify(nemesis, null, 2))
  // console.log('TOP RIVALS (Raw):', JSON.stringify(topRivalsRaw, null, 2))
  // console.log('-----------------------')

  return {
    nemesis: nemesis ? { name: nemesis.name, losses: nemesis.losses, meetings: nemesis.meetings } : null,
    topRivals
  }
}
