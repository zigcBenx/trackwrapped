export const worldRecords: Record<'M' | 'W', Record<string, string>> = {
  M: {
    // Sprints
    '100 Metres': '9.58',
    '200 Metres': '19.19',
    '400 Metres': '43.03',

    // Hurdles
    '110 Metres Hurdles': '12.80',
    '400 Metres Hurdles': '45.94',

    // Middle/Long Distance
    '800 Metres': '1:40.91',
    '1500 Metres': '3:26.00',
    '3000 Metres': '7:20.67',
    '5000 Metres': '12:35.36',
    '10,000 Metres': '26:11.00',
    'Marathon': '2:00:35',

    // Steeplechase
    '3000 Metres Steeplechase': '7:53.63',

    // Relays
    '4x100 Metres Relay': '36.84',
    '4x400 Metres Relay': '2:54.29',

    // Jumps
    'High Jump': '2.45',
    'Pole Vault': '6.30',
    'Long Jump': '8.95',
    'Triple Jump': '18.29',

    // Throws
    'Shot Put': '23.56',
    'Discus Throw': '74.35',
    'Hammer Throw': '86.74',
    'Javelin Throw': '98.48',

    // Combined
    'Decathlon': '9126',

    // Indoor
    '60 Metres': '6.34',
    '60 Metres Hurdles': '7.29',
    '200 Metres Indoor': '19.92',
    '400 Metres Indoor': '44.52',
    '800 Metres Indoor': '1:42.67',
    '1500 Metres Indoor': '3:30.60',
    '3000 Metres Indoor': '7:24.90',
    '5000 Metres Indoor': '12:49.60'
  },
  W: {
    // Sprints
    '100 Metres': '10.49',
    '200 Metres': '21.34',
    '400 Metres': '47.60',

    // Hurdles
    '100 Metres Hurdles': '12.20',
    '400 Metres Hurdles': '50.65',

    // Middle/Long Distance
    '800 Metres': '1:53.28',
    '1500 Metres': '3:49.04',
    '3000 Metres': '8:06.11',
    '5000 Metres': '14:00.21',
    '10,000 Metres': '28:54.14',
    'Marathon': '2:11:53',

    // Steeplechase
    '3000 Metres Steeplechase': '8:44.32',

    // Relays
    '4x100 Metres Relay': '40.82',
    '4x400 Metres Relay': '3:15.17',

    // Jumps
    'High Jump': '2.09',
    'Pole Vault': '5.06',
    'Long Jump': '7.52',
    'Triple Jump': '15.74',

    // Throws
    'Shot Put': '22.63',
    'Discus Throw': '76.80',
    'Hammer Throw': '82.98',
    'Javelin Throw': '72.28',

    // Combined
    'Heptathlon': '7291',

    // Indoor
    '60 Metres': '6.92',
    '60 Metres Hurdles': '7.68',
    '200 Metres Indoor': '21.87',
    '400 Metres Indoor': '49.26',
    '800 Metres Indoor': '1:55.82',
    '1500 Metres Indoor': '3:53.09',
    '3000 Metres Indoor': '8:16.60',
    '5000 Metres Indoor': '14:18.37'
  }
}

export function getWorldRecord(discipline: string, gender: string | null = null): string {
  // Default to Men's if no gender provided
  const genderKey: 'M' | 'W' = (gender === 'W' || gender === 'F') ? 'W' : 'M'

  const records = worldRecords[genderKey]

  // Normalize the discipline name for comparison
  const normalizedDiscipline = discipline.trim()

  // Try exact match first (strict)
  if (records[normalizedDiscipline]) {
    return records[normalizedDiscipline]
  }

  // Try case-insensitive exact match
  const disciplineLower = normalizedDiscipline.toLowerCase()
  const exactMatchKey = Object.keys(records).find(key => key.toLowerCase() === disciplineLower)

  if (exactMatchKey && records[exactMatchKey]) {
    return records[exactMatchKey]
  }

  // If no exact match found, return '0' to avoid false matches
  // This prevents "60 Metres" from matching "100 Metres" or "4x400m Relay" from matching "400m Hurdles"
  return '0'
}
