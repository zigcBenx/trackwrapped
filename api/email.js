import { sql } from '@vercel/postgres'

export default async function handler(req, res) {
  // Handle POST request for email submission
  if (req.method === 'POST') {
    return handleEmailSubmission(req, res)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

async function handleEmailSubmission(req, res) {
  const { email, athleteId } = req.body

  // Validate email
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Invalid email' })
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' })
  }

  try {
    // Ensure table exists
    await sql`
      CREATE TABLE IF NOT EXISTS season_tracking_emails (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        athlete_id TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Insert email (will fail if duplicate due to UNIQUE constraint)
    const result = await sql`
      INSERT INTO season_tracking_emails (email, athlete_id)
      VALUES (${email.toLowerCase()}, ${athleteId || null})
      RETURNING id, email, created_at
    `

    return res.status(200).json({
      success: true,
      message: 'Email registered successfully',
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error saving email:', error)
    
    // Check if it's a duplicate email error
    if (error.message && error.message.includes('duplicate key')) {
      return res.status(409).json({
        error: 'Email already registered',
        message: 'This email is already signed up for season tracking'
      })
    }

    return res.status(500).json({
      error: 'Failed to save email',
      details: error.message
    })
  }
}
