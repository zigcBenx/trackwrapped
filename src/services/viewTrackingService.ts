/**
 * Service to track athlete profile views
 */

export interface ViewTrackingResponse {
  success: boolean
  athleteId: string
  views: number
}

export interface TopAthlete {
  athleteId: string
  views: number
  updatedAt: string
}

export interface TopAthletesResponse {
  success: boolean
  topAthletes: TopAthlete[]
}

/**
 * Track an athlete view by sending a POST request to the API
 * @param athleteId - The athlete ID to track
 * @returns The updated view count
 */
export async function trackAthleteView(athleteId: number | null): Promise<ViewTrackingResponse | null> {
  if (!athleteId) {
    console.warn('Cannot track view: athleteId is null or undefined')
    return null
  }

  // Check if we've already tracked this athlete in this session/browser
  const storageKey = `tracked_athlete_${athleteId}`
  const alreadyTracked = localStorage.getItem(storageKey)
  
  if (alreadyTracked) {
    console.log(`Athlete ${athleteId} already tracked in this browser. Skipping API call.`)
    return null
  }

  try {
    const response = await fetch('/api/view', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        athleteId: String(athleteId)
      })
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Failed to track view:', error)
      return null
    }

    const data: ViewTrackingResponse = await response.json()
    console.log(`Tracked view for athlete ${athleteId}. Total views: ${data.views}`)
    
    // Mark as tracked
    localStorage.setItem(storageKey, 'true')
    
    return data
  } catch (error) {
    console.error('Error tracking athlete view:', error)
    return null
  }
}

/**
 * Get the top 3 athletes by view count
 * @returns Array of top 3 athletes with their view counts
 */
export async function getTopAthletes(): Promise<TopAthlete[]> {
  try {
    const response = await fetch('/api/view', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      console.error('Failed to fetch top athletes')
      return []
    }

    const data: TopAthletesResponse = await response.json()
    return data.topAthletes || []
  } catch (error) {
    console.error('Error getting top athletes:', error)
    return []
  }
}

/**
 * Get the current view count for an athlete (optional)
 * @param athleteId - The athlete ID to get views for
 * @returns The current view count
 */
export async function getAthleteViewCount(athleteId: number | null): Promise<number | null> {
  if (!athleteId) {
    return null
  }

  try {
    const response = await fetch(`/api/view?athleteId=${athleteId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.views || 0
  } catch (error) {
    console.error('Error getting athlete view count:', error)
    return null
  }
}
