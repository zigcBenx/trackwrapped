import type { Athlete } from '@/types/athlete'

const API_BASE_URL = 'https://worldathletics.nimarion.de'

export async function searchAthletes(name: string): Promise<Athlete[]> {
  if (!name || name.trim().length === 0) {
    return []
  }

  try {
    const response = await fetch(`${API_BASE_URL}/athletes/search?name=${encodeURIComponent(name)}`)
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data: Athlete[] = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching athletes:', error)
    throw error
  }
}
