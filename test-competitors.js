import { getCompleteAthleteData } from './src/services/athleteDetailsService'

// Mock fetch for node environment
global.fetch = require('node-fetch')

async function testCompetitorFetching() {
  console.log('Starting test for Žiga Benko (ID: 14759529)...')
  
  try {
    const data = await getCompleteAthleteData(14759529)
    console.log('Fetched data successfully')
    
    const resultsWithCompetitors = data.results.filter(r => r.competitors && r.competitors.length > 0)
    console.log(`Found ${resultsWithCompetitors.length} results with competitors out of ${data.results.length} total results`)
    
    if (resultsWithCompetitors.length > 0) {
      const firstResult = resultsWithCompetitors[0]
      console.log('First result with competitors:', {
        competition: firstResult.competition,
        competitorCount: firstResult.competitors?.length,
        firstCompetitor: firstResult.competitors?.[0]
      })
    } else {
      console.log('No competitors found in any result')
      
      // Log the first result to check IDs
      if (data.results.length > 0) {
        console.log('First result IDs:', {
          competitionId: data.results[0].competitionId,
          eventId: data.results[0].eventId
        })
      }
    }
  } catch (error) {
    console.error('Test failed:', error)
  }
}

testCompetitorFetching()
