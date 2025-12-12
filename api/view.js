import { sql } from '@vercel/postgres'

export default async function handler(req, res) {
  // Handle GET request for top athletes
  if (req.method === 'GET') {
    return handleGetTopAthletes(req, res)
  }

  // Handle POST request for tracking views
  if (req.method === 'POST') {
    return handleTrackView(req, res)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

async function handleGetTopAthletes(req, res) {
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

    // Get top 3 athletes by views
    const result = await sql`
      SELECT athlete_id, views, updated_at
      FROM athlete_views
      ORDER BY views DESC
      LIMIT 3
    `

    const topAthletes = result.rows.map((row) => ({
      athleteId: row.athlete_id,
      views: row.views,
      updatedAt: row.updated_at
    }))

    return res.status(200).json({
      success: true,
      topAthletes
    })
  } catch (error) {
    console.error('Error fetching top athletes:', error)
    return res.status(500).json({
      error: 'Failed to fetch top athletes',
      details: error.message
    })
  }
}

async function handleTrackView(req, res) {
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
