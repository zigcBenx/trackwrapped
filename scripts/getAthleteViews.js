import { sql } from '@vercel/postgres'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
config({ path: join(__dirname, '..', '.env') })

/**
 * Enhanced script to get athlete statistics from the database
 * Supports:
 * --limit X : Show only top X athletes
 * --csv     : Export results to athlete_views.csv
 */

const API_BASE_URL = 'https://worldathletics.nimarion.de'
const args = process.argv.slice(2)
const limitArg = args.find(arg => arg.startsWith('--limit=') || arg === '-l')
const limit = limitArg ? parseInt(limitArg.split('=')[1] || args[args.indexOf(limitArg) + 1]) : null
const exportCsv = args.includes('--csv')

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

    const totalAthletes = result.rows.length
    console.log(`Found ${totalAthletes} athletes in the database\n`)
    
    const displayRows = limit ? result.rows.slice(0, limit) : result.rows
    console.log(`Fetching names for ${displayRows.length} athletes...\n`)

    // Fetch names with limited concurrency
    const CONCURRENCY = 5
    const athletesWithNames = []
    
    for (let i = 0; i < displayRows.length; i += CONCURRENCY) {
      const chunk = displayRows.slice(i, i + CONCURRENCY)
      const chunkResults = await Promise.all(chunk.map(async (row) => {
        const { firstName, lastName } = await getAthleteName(row.athlete_id)
        return {
          athleteId: row.athlete_id,
          firstName,
          lastName,
          views: parseInt(row.views),
          createdAt: row.created_at,
          updatedAt: row.updated_at
        }
      }))
      athletesWithNames.push(...chunkResults)
      // Small delay between chunks
      await new Promise(resolve => setTimeout(resolve, 50))
    }

    // Calculate additional stats
    const totalViews = result.rows.reduce((sum, r) => sum + parseInt(r.views), 0)
    const avgViews = totalAthletes > 0 ? (totalViews / totalAthletes).toFixed(2) : 0
    const mostRecent = result.rows.reduce((prev, current) => 
      (new Date(prev.updated_at) > new Date(current.updated_at)) ? prev : current
    , result.rows[0])

    // Print results
    console.log('='.repeat(80))
    console.log('ATHLETE PROFILE VIEWS REPORT')
    console.log('='.repeat(80))
    console.log(`Total Unique Athletes: ${totalAthletes}`)
    console.log(`Total Views:           ${totalViews}`)
    console.log(`Average Views/Athlete: ${avgViews}`)
    if (mostRecent) {
      console.log(`Most Recent View:      Athlete ${mostRecent.athlete_id} at ${new Date(mostRecent.updated_at).toLocaleString()}`)
    }
    console.log('='.repeat(80))
    console.log('\n')

    if (athletesWithNames.length > 0) {
      console.table(athletesWithNames.map((a, index) => ({
        Rank: index + 1,
        'Athlete ID': a.athleteId,
        'Name': `${a.firstName} ${a.lastName}`,
        Views: a.views,
        'Last Viewed': new Date(a.updatedAt).toLocaleString()
      })))
    }

    if (exportCsv) {
      const csvHeader = 'Rank,Athlete ID,First Name,Last Name,Views,Last Viewed\n'
      const csvRows = athletesWithNames.map((a, index) => 
        `${index + 1},${a.athleteId},"${a.firstName}","${a.lastName}",${a.views},"${new Date(a.updatedAt).toISOString()}"`
      ).join('\n')
      
      const fileName = 'athlete_views.csv'
      fs.writeFileSync(fileName, csvHeader + csvRows)
      console.log(`\n✅ Exported results to ${fileName}`)
    }

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
