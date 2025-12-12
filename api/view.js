import { sql } from '@vercel/postgres'

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { athleteId } = req.body

  // Validate athleteId
  if (!athleteId || typeof athleteId !== 'string') {
    return res.status(400).json({ error: 'Invalid athleteId' })
  }

  try {
    // Ensure table exists
    await sql`
      CREATE TABLE IF NOT EXISTS athlete_views (
        athlete_id TEXT PRIMARY KEY,
        views INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    // UPSERT: Insert new or increment existing
    const result = await sql`
      INSERT INTO athlete_views (athlete_id, views)
      VALUES (${athleteId}, 1)
      ON CONFLICT (athlete_id)
      DO UPDATE SET views = athlete_views.views + 1, updated_at = NOW()
      RETURNING views
    `

    const views = result.rows[0].views

    return res.status(200).json({
      success: true,
      athleteId,
      views
    })
  } catch (error) {
    console.error('Error tracking view:', error)
    return res.status(500).json({
      error: 'Failed to track view',
      details: error.message
    })
  }
}
