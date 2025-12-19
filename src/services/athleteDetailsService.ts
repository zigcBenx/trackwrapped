import type { AthleteDetails, AthleteResult, Competitor } from '@/types/athleteDetails'

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
  const [details, allResults] = await Promise.all([
    getAthleteDetails(athleteId),
    getAthleteResults(athleteId)
  ])

  // Filter results based on scope
  let filteredResults = allResults
  if (scope === 'season') {
    // Get the most recent year from results
    const years = allResults.map(r => new Date(r.date).getFullYear())
    const latestYear = Math.max(...years)

    // Filter for that year (e.g. 2025)
    filteredResults = allResults.filter(r => new Date(r.date).getFullYear() === latestYear)

    // If no results for latest year (unlikely if we got year from results), fallback to all
    if (filteredResults.length === 0) filteredResults = allResults
  }

  // Deduplicate results to avoid redundant API calls and overcounting
  // Multiple results can be from one competition (e.g. Heats, Semis, Final)
  // but we want to avoid exact duplicates of the same race.
  const uniqueFilteredResults = filteredResults.filter((result, index, self) =>
    index === self.findIndex((r) => (
      r.competitionId === result.competitionId &&
      r.race === result.race &&
      r.mark === result.mark &&
      r.date === result.date
    ))
  )

  // Fetch competition details for rival analysis
  // Limit to recent competitions to avoid too many API calls
  // For season scope, we use all results (usually < 20)
  // For lifetime, we still limit to recent 20 for performance, or maybe 30 for premium feel
  const limit = scope === 'lifetime' ? 30 : 50
  const recentResults = uniqueFilteredResults.slice(0, limit)
  
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
          const event = compData.events[0]
          
          if (event.races && event.races.length > 0) {
            // Find the specific race where our athlete competed
            // We match by checking if the athleteId is in the results of that race
            // AND we try to match the race type (e.g. "Round 1", "Semifinal")
            const ourRace = event.races.find((race: any) => {
              // 1. Must contain the athlete
              const hasAthlete = race.results && race.results.some((r: any) => 
                r.athletes && r.athletes.some((a: any) => a.id === athleteId)
              )
              if (!hasAthlete) return false
              
              // 2. Try to match the race type if available
              // result.race might be "Round 1" and race.race might be "Round 1 - Heat 2"
              if (result.race && race.race) {
                const resultRaceLower = result.race.toLowerCase()
                const raceRaceLower = race.race.toLowerCase()
                
                // Check for common race type matches
                const isMatch = raceRaceLower.includes(resultRaceLower) || 
                               resultRaceLower.includes(raceRaceLower)
                
                return isMatch
              }
              
              return true
            })

            if (ourRace && ourRace.results) {
              competitors = ourRace.results
              console.log(`Matched race for ${result.competition}: "${result.race}" -> "${ourRace.race}"`)
            } else {
              // Fallback: if we can't find the specific race with name match, 
              // just find the first one that contains the athlete
              const fallbackRace = event.races.find((race: any) => 
                race.results && race.results.some((r: any) => 
                  r.athletes && r.athletes.some((a: any) => a.id === athleteId)
                )
              )
              if (fallbackRace && fallbackRace.results) {
                competitors = fallbackRace.results
              }
            }
          }
        }
        // Map to our Competitor interface
        const mappedCompetitors = competitors
          .map((r: any) => {
            // Athlete info is in the athletes array
            const athlete = r.athletes && r.athletes.length > 0 ? r.athletes[0] : null
            
            if (!athlete) return null

            return {
              id: athlete.id || 0,
              name: `${athlete.firstname} ${athlete.lastname}`,
              firstname: athlete.firstname || '',
              lastname: athlete.lastname || '',
              country: athlete.country || r.country || '',
              place: parseInt(r.place) || 0,
              result: r.mark || '',
              resultScore: r.performanceValue || 0
            }
          })
          .filter((c): c is import('@/types/athleteDetails').Competitor => c !== null && c.id !== 0)
        
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
  const combinedResults = [
    ...resultsWithCompetitors,
    ...filteredResults.slice(limit)
  ]

  return {
    details,
    results: combinedResults,
    allResults: allResults  // Return unfiltered results for season comparison
  }
}
