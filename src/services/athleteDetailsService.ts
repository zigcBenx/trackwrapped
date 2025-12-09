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

export async function getCompleteAthleteData(athleteId: number) {
  const [details, results] = await Promise.all([
    getAthleteDetails(athleteId),
    getAthleteResults(athleteId)
  ])

  return { details, results }
}
