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
  // Deduplicate results first to prevent triple-counting if data is messy
  // We keep different races within the same competition (e.g. Heats vs Final)
  const uniqueResults = results.filter((result, index, self) =>
    index === self.findIndex((r) => (
      r.competitionId === result.competitionId &&
      r.race === result.race &&
      r.date === result.date &&
      r.mark === result.mark
    ))
  )

  // Track all competitors we've faced
  const competitorMap = new Map<string, {
    name: string
    meetings: number
    losses: number  // times they beat us
    meetingNames: string[]
  }>()

  // Analyze each result
  uniqueResults.forEach(result => {
    if (!result.competitors || result.competitors.length === 0) return

    // Find our place in this competition
    const ourPlace = result.place

    // Analyze each competitor
    result.competitors.forEach((competitor: import('@/types/athleteDetails').Competitor) => {
      // Skip ourselves
      if (competitor.id === (results[0] as any).athleteId || 
          (competitor.firstname === firstName && competitor.lastname === lastName)) return

      const competitorKey = String(competitor.id)
      
      if (!competitorMap.has(competitorKey)) {
        competitorMap.set(competitorKey, {
          name: `${competitor.firstname} ${competitor.lastname}`,
          meetings: 0,
          losses: 0,
          meetingNames: []
        })
      }

      const competitorData = competitorMap.get(competitorKey)!
      
      // Count every race as a meeting
      competitorData.meetings++
      
      // Include race name for clarity in logs
      const fullMeetingName = result.race ? `${result.competition} (${result.race})` : result.competition
      competitorData.meetingNames.push(fullMeetingName)

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
  const topRivalsRaw = competitors
    .filter(c => c.meetings >= 1)  // At least 1 meeting
    .sort((a, b) => b.meetings - a.meetings)
    .slice(0, 3)

  const topRivals = topRivalsRaw.map(c => ({ name: c.name, meetings: c.meetings }))

  console.log('--- RIVALS ANALYSIS DEBUG ---')
  console.log('Total Results Received:', results.length)
  console.log('Unique Results Found:', uniqueResults.length)
  
  uniqueResults.forEach((r, i) => {
    console.log(`Result ${i}: ${r.competition} (${r.race}) - ${r.date}`)
    if (r.competitors) {
      console.log(`  Competitors: ${r.competitors.length}`)
    }
  })

  console.log('Total Competitors in Map:', competitorMap.size)
  console.log('Top 5 by Meetings:', JSON.stringify(competitors.sort((a, b) => b.meetings - a.meetings).slice(0, 5), null, 2))
  console.log('NEMESIS:', JSON.stringify(nemesis, null, 2))
  console.log('-----------------------')

  return {
    nemesis: nemesis ? { name: nemesis.name, losses: nemesis.losses, meetings: nemesis.meetings } : null,
    topRivals
  }
}
