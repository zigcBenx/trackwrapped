import fetch from 'node-fetch';

const API_BASE_URL = 'https://worldathletics.nimarion.de';

async function testCompetitorFetching() {
  console.log('Starting test for Žiga Benko (ID: 14759529)...');
  
  try {
    // 1. Fetch results
    console.log('Fetching results...');
    const resultsResponse = await fetch(`${API_BASE_URL}/athletes/14759529/results`);
    const results = await resultsResponse.json();
    
    // Take the first result that has valid IDs
    const validResult = results.find(r => r.competitionId && r.eventId);
    
    if (!validResult) {
      console.log('No valid results found with competitionId and eventId');
      return;
    }
    
    console.log('Testing with result:', {
      competition: validResult.competition,
      competitionId: validResult.competitionId,
      eventId: validResult.eventId
    });
    
    // 2. Fetch competition details
    const url = `${API_BASE_URL}/competitions/${validResult.competitionId}/results?eventId=${validResult.eventId}`;
    console.log('Fetching competition details from:', url);
    
    const compResponse = await fetch(url);
    const compData = await compResponse.json();
    
    console.log('Competition Data Structure Keys:', Object.keys(compData));
    
    if (compData.events && compData.events.length > 0) {
      const event = compData.events[0];
      console.log('Event found:', event.discipline);
      
      if (event.races && event.races.length > 0) {
        console.log(`Found ${event.races.length} races`);
        
        let allCompetitors = [];
        event.races.forEach((race, index) => {
          console.log(`Race ${index + 1} results count:`, race.results ? race.results.length : 0);
          if (race.results && race.results.length > 0) {
            console.log('Sample result structure:', JSON.stringify(race.results[0], null, 2));
            allCompetitors = [...allCompetitors, ...race.results];
          }
        });
        
        console.log(`Total competitors found: ${allCompetitors.length}`);
      } else {
        console.log('No races found in event');
      }
    } else {
      console.log('No events found in competition data');
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testCompetitorFetching();
