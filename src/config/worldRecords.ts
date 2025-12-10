export const worldRecords: Record<string, string> = {
  // Sprints (Men)
  '100 Metres': '9.58',
  '200 Metres': '19.19',
  '400 Metres': '43.03',
  '110 Metres Hurdles': '12.80',
  '400 Metres Hurdles': '45.94',
  
  // Sprints (Women) - simplified, ideally we'd check sex
  // For now, using Men's as default or mixed, 
  // but let's just add common ones. 
  // If we have sex data, we can split.
  
  // Middle/Long Distance
  '800 Metres': '1:40.91',
  '1500 Metres': '3:26.00',
  '5000 Metres': '12:35.36',
  '10,000 Metres': '26:11.00',
  'Marathon': '2:00:35',
  
  // Jumps
  'High Jump': '2.45',
  'Pole Vault': '6.26',
  'Long Jump': '8.95',
  'Triple Jump': '18.29',
  
  // Throws
  'Shot Put': '23.56',
  'Discus Throw': '74.35',
  'Hammer Throw': '86.74',
  'Javelin Throw': '98.48',
  
  // Combined
  'Decathlon': '9126',
  'Heptathlon': '7291'
}

export function getWorldRecord(discipline: string): string {
  // Try exact match
  if (worldRecords[discipline]) return worldRecords[discipline]
  
  // Try partial match
  const key = Object.keys(worldRecords).find(k => discipline.includes(k))
  return (key && worldRecords[key]) || '0'
}
