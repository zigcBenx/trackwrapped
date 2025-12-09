import fetch from 'node-fetch';

const API_BASE_URL = 'https://worldathletics.nimarion.de';

async function testAthleteDetails() {
  console.log('Fetching details for Žiga Benko (ID: 14759529)...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/athletes/14759529`);
    const data = await response.json();
    
    console.log('Athlete Details Keys:', Object.keys(data));
    if (data.image || data.imageUrl || data.avatar) {
      console.log('Image found:', data.image || data.imageUrl || data.avatar);
    } else {
      console.log('No image field found in root.');
    }
    
    // Check nested objects just in case
    console.log('Full Data Sample:', JSON.stringify(data, null, 2).substring(0, 500));
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testAthleteDetails();
