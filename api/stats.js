import { sql } from '@vercel/postgres'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get total unique athletes
    const uniqueAthletesResult = await sql`
      SELECT COUNT(*) as count
      FROM athlete_views
    `

    // Get total views across all athletes
    const totalViewsResult = await sql`
      SELECT SUM(views) as total
      FROM athlete_views
    `

    const uniqueAthletes = parseInt(uniqueAthletesResult.rows[0]?.count || 0)
    const totalViews = parseInt(totalViewsResult.rows[0]?.total || 0)

    return res.status(200).json({
      success: true,
      uniqueAthletes,
      totalViews
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return res.status(500).json({
      error: 'Failed to fetch stats',
      details: error.message
    })
  }
}
