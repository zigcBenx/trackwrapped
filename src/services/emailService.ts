/**
 * Service to handle season tracking email submissions
 */

export interface EmailSubmissionResponse {
  success: boolean
  message?: string
  error?: string
}

/**
 * Submit an email for season tracking
 * @param email - The email address to register
 * @param athleteId - Optional athlete ID to associate with the email
 * @returns Response indicating success or failure
 */
export async function submitEmail(email: string, athleteId?: string | null): Promise<EmailSubmissionResponse> {
  if (!email || !email.trim()) {
    return {
      success: false,
      error: 'Email is required'
    }
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      success: false,
      error: 'Invalid email format'
    }
  }

  try {
    const response = await fetch('/api/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        athleteId: athleteId || null
      })
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || 'Failed to submit email'
      }
    }

    return {
      success: true,
      message: data.message || 'Email registered successfully'
    }
  } catch (error) {
    console.error('Error submitting email:', error)
    return {
      success: false,
      error: 'Network error. Please try again.'
    }
  }
}
