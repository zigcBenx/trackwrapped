import type { AthleteDetails, AthleteResult } from '@/types/athleteDetails'

const API_BASE_URL = 'https://worldathletics.nimarion.de'

export async function getAthleteDetails(athleteId: number): Promise<AthleteDetails> {
  try {
    const response = await fetch(`${API_BASE_URL}/athletes/${athleteId}`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch athlete details: ${response.status}`)
    }

    const data: AthleteDetails = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching athlete details:', error)
    throw error
  }
}

export async function getAthleteResults(athleteId: number): Promise<AthleteResult[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/athletes/${athleteId}/results`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch athlete results: ${response.status}`)
    }

    const data: AthleteResult[] = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching athlete results:', error)
    throw error
  }
}

export async function getCompleteAthleteData(athleteId: number, scope: 'season' | 'lifetime' = 'season') {
  // Fetch basic details and results
  const [details, results] = await Promise.all([
    getAthleteDetails(athleteId),
    getAthleteResults(athleteId)
  ])

  // Filter results based on scope
  let filteredResults = results
  if (scope === 'season') {
    // Get the most recent year from results
    const years = results.map(r => new Date(r.date).getFullYear())
    const latestYear = Math.max(...years)
    
    // Filter for that year (e.g. 2025)
    filteredResults = results.filter(r => new Date(r.date).getFullYear() === latestYear)
    
    // If no results for latest year (unlikely if we got year from results), fallback to all
    if (filteredResults.length === 0) filteredResults = results
  }

  // Fetch competition details for rival analysis
  // Limit to recent competitions to avoid too many API calls
  // For season scope, we use all results (usually < 20)
  // For lifetime, we still limit to recent 20 for performance, or maybe 30 for premium feel
  const limit = scope === 'lifetime' ? 30 : 50
  const recentResults = filteredResults.slice(0, limit)
  
  const resultsWithCompetitors = await Promise.all(
    recentResults.map(async (result) => {
      try {
        // Fetch competition details using the correct endpoint
        const compResponse = await fetch(
          `${API_BASE_URL}/competitions/${result.competitionId}/results?eventId=${result.eventId}`
        )
        
        if (!compResponse.ok) {
          return result  // Return without competitors if fetch fails
        }

        const compData = await compResponse.json()
        
        // The API returns events -> races -> results
        // We need to find the race where our athlete competed
        // or collect all competitors from the final if applicable
        
        let competitors: any[] = []
        
        if (compData.events && compData.events.length > 0) {
          const event = compData.events[0] // Should be the event we requested
          
          if (event.races && event.races.length > 0) {
            // Collect all results from all races in this event
            // Ideally we'd match the specific race, but for rival analysis, 
            // anyone in the same event/round is relevant
            event.races.forEach((race: any) => {
              if (race.results) {
                competitors = [...competitors, ...race.results]
        // Map to our Competitor interface
        const competitorData = await fetchEventCompetitors(result.competitionId, result.eventId)
        const competitorsArray = competitorData?.competitors || []
        
        const mappedCompetitors = competitorsArray
          .map((comp: any) => {
            if (!comp) return null
            return {
              id: comp.id,
              name: `${comp.firstname} ${comp.lastname}`,
              firstname: comp.firstname,
              lastname: comp.lastname,
              country: comp.country,
              place: parseInt(comp.place) || 0,
              result: comp.mark,
              resultScore: comp.resultScore || 0
            }
          })
          .filter((comp): comp is Competitor => comp !== null) // Filter out nulls and assert type
        
        return {
          ...result,
          competitors: mappedCompetitors
        }
      } catch (error) {
        console.error(`Failed to fetch competitors for competition ${result.competitionId}:`, error)
        return result  // Return without competitors if error
      }
    })
  )

  // Combine results with competitors and remaining results without
  const allResults = [
    ...resultsWithCompetitors,
    ...filteredResults.slice(limit)
  ]

  return { details, results: allResults }
}
