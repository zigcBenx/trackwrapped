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
 * Script to find the most consistent athletes for a specific season.
 * Calculates consistency based on variance between season best and average scores.
 * Lower variance = more consistent performance.
 * 
 * Supports:
 * --limit X : Show only top X athletes (default: 7)
 * --year Y  : Specify the year (default: 2025)
 * --no-cache: Ignore local cache and fetch fresh data
 */

const API_BASE_URL = 'https://worldathletics.nimarion.de'
const args = process.argv.slice(2)
const limitArg = args.find(arg => arg.startsWith('--limit=') || arg === '-l')
const limit = limitArg ? parseInt(limitArg.split('=')[1] || args[args.indexOf(limitArg) + 1]) : 5
const yearArg = args.find(arg => arg.startsWith('--year=') || arg === '-y')
const year = yearArg ? parseInt(yearArg.split('=')[1] || args[args.indexOf(yearArg) + 1]) : 2025
const noCache = args.includes('--no-cache')

const CACHE_FILE = join(__dirname, '..', `.athlete_consistency_cache_${year}.json`)
const MIN_COMPETITIONS = 8

// Load cache
let cache = {}
if (!noCache && fs.existsSync(CACHE_FILE)) {
  try {
    cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'))
  } catch (e) {
    console.error('Failed to load cache:', e.message)
  }
}

async function getAthleteConsistency(athleteId) {
  // Check cache first
  if (cache[athleteId]) {
    return cache[athleteId]
  }

  try {
    // 1. Get basic details
    const detailsResponse = await fetch(`${API_BASE_URL}/athletes/${athleteId}`)
    if (!detailsResponse.ok) return null
    const details = await detailsResponse.json()

    // 2. Get results
    const resultsResponse = await fetch(`${API_BASE_URL}/athletes/${athleteId}/results`)
    if (!resultsResponse.ok) return null
    const allResults = await resultsResponse.json()

    // 3. Filter by year and calculate scores
    const seasonResults = []
    
    if (allResults && Array.isArray(allResults)) {
      allResults.forEach(r => {
        const resultYear = new Date(r.date).getFullYear()
        if (resultYear === year && r.resultScore) {
          seasonResults.push({
            score: r.resultScore,
            date: r.date
          })
        }
      })
    }

    // Must have at least MIN_COMPETITIONS
    if (seasonResults.length < MIN_COMPETITIONS) {
      return null
    }

    // Calculate season best (highest score)
    const seasonBest = Math.max(...seasonResults.map(r => r.score))
    
    // Calculate average score
    const averageScore = seasonResults.reduce((sum, r) => sum + r.score, 0) / seasonResults.length
    
    // Calculate variance (lower = more consistent)
    const variance = seasonBest - averageScore

    const athleteData = {
      id: athleteId,
      name: `${details.firstname} ${details.lastname}`,
      homeCountry: details.country || details.nationality || '',
      seasonBest: Math.round(seasonBest),
      averageScore: Math.round(averageScore),
      variance: Math.round(variance),
      totalCompetitions: seasonResults.length,
      lastUpdated: new Date().toISOString()
    }

    // Update cache
    cache[athleteId] = athleteData
    return athleteData
  } catch (error) {
    console.error(`Error fetching data for athlete ${athleteId}:`, error.message)
    return null
  }
}

async function getMostConsistentAthletes() {
  try {
    // Get all athletes from the database
    const result = await sql`SELECT athlete_id FROM athlete_views`
    const athleteIds = result.rows.map(row => row.athlete_id)

    console.log(`Found ${athleteIds.length} athletes in database`)
    console.log(`Analyzing consistency for year ${year}...`)
    console.log(`Minimum competitions required: ${MIN_COMPETITIONS}`)
    console.log('')

    const consistencyData = []
    let processed = 0

    for (const athleteId of athleteIds) {
      const data = await getAthleteConsistency(athleteId)
      processed++
      
      if (data) {
        consistencyData.push(data)
        console.log(`✓ [${processed}/${athleteIds.length}] ${data.name}: ${data.variance} variance (${data.totalCompetitions} comps)`)
      } else {
        console.log(`✗ [${processed}/${athleteIds.length}] Athlete ${athleteId}: Insufficient data`)
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    // Sort by variance (ascending - lowest variance = most consistent)
    consistencyData.sort((a, b) => a.variance - b.variance)

    // Take top N
    const topAthletes = consistencyData.slice(0, limit)

    console.log('')
    console.log('='.repeat(60))
    console.log(`TOP ${limit} MOST CONSISTENT ATHLETES (${year})`)
    console.log('='.repeat(60))
    console.log('')

    topAthletes.forEach((athlete, index) => {
      console.log(`${index + 1}. ${athlete.name} (${athlete.homeCountry})`)
      console.log(`   Variance: ${athlete.variance} | Best: ${athlete.seasonBest} | Avg: ${athlete.averageScore}`)
      console.log(`   Competitions: ${athlete.totalCompetitions}`)
      console.log('')
    })

    // Save to JSON file
    const outputPath = join(__dirname, '..', 'public', 'data', `consistency_stats_${year}.json`)
    const outputDir = dirname(outputPath)
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(topAthletes, null, 2))
    console.log(`✓ Saved to ${outputPath}`)

    // Save cache
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2))
    console.log(`✓ Cache saved to ${CACHE_FILE}`)

    return topAthletes
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

// Run the script
getMostConsistentAthletes()
  .then(() => {
    console.log('Done!')
    process.exit(0)
  })
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
