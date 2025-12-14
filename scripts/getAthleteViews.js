import { sql } from '@vercel/postgres'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
config({ path: join(__dirname, '..', '.env') })

/**
 * Temporary script to get all athletes from the database with their view counts
 * and fetch their names from the World Athletics API
 */

const API_BASE_URL = 'https://worldathletics.nimarion.de'

async function getAthleteName(athleteId) {
  try {
    const response = await fetch(`${API_BASE_URL}/athletes/${athleteId}`)
    if (!response.ok) {
      return { firstName: 'Unknown', lastName: 'Unknown' }
    }
    const data = await response.json()
    return {
      firstName: data.firstname || 'Unknown',
      lastName: data.lastname || 'Unknown'
    }
  } catch (error) {
    console.error(`Error fetching athlete ${athleteId}:`, error.message)
    return { firstName: 'Unknown', lastName: 'Unknown' }
  }
}

async function getAllAthleteViews() {
  try {
    // Get all athletes from the database ordered by views
    const result = await sql`
      SELECT athlete_id, views, created_at, updated_at
      FROM athlete_views
      ORDER BY views DESC
    `

    console.log(`Found ${result.rows.length} athletes in the database\n`)
    console.log('Fetching athlete names...\n')

    // Fetch names for each athlete
    const athletesWithNames = []
    for (const row of result.rows) {
      const { firstName, lastName } = await getAthleteName(row.athlete_id)
      athletesWithNames.push({
        athleteId: row.athlete_id,
        firstName,
        lastName,
        views: row.views,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      })

      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    // Print results
    console.log('='.repeat(80))
    console.log('ATHLETE PROFILE VIEWS REPORT')
    console.log('='.repeat(80))
    console.log(`Total Athletes: ${athletesWithNames.length}`)
    console.log(`Total Views: ${athletesWithNames.reduce((sum, a) => sum + a.views, 0)}`)
    console.log('='.repeat(80))
    console.log('\n')

    console.table(athletesWithNames.map((a, index) => ({
      Rank: index + 1,
      'Athlete ID': a.athleteId,
      'First Name': a.firstName,
      'Last Name': a.lastName,
      Views: a.views,
      'Last Viewed': new Date(a.updatedAt).toLocaleString()
    })))

    return athletesWithNames
  } catch (error) {
    console.error('Error fetching athlete views:', error)
    throw error
  }
}

// Run the script
getAllAthleteViews()
  .then(() => {
    console.log('\nScript completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Script failed:', error)
    process.exit(1)
  })
