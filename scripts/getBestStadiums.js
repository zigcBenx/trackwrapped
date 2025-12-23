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
 * Script to find the best stadiums/venues based on athlete performance.
 * Analyzes results from athletes in the database and finds venues
 * where they achieved their best scores.
 * 
 * Supports:
 * --limit X : Show only top X stadiums (default: 5)
 * --year Y  : Specify the year (default: 2025)
 * --min-results N : Minimum results at venue to qualify (default: 20)
 * --no-cache: Ignore local cache and fetch fresh data
 */

const API_BASE_URL = 'https://worldathletics.nimarion.de'
const args = process.argv.slice(2)
const limitArg = args.find(arg => arg.startsWith('--limit=') || arg === '-l')
const limit = limitArg ? parseInt(limitArg.split('=')[1] || args[args.indexOf(limitArg) + 1]) : 5
const yearArg = args.find(arg => arg.startsWith('--year=') || arg === '-y')
const year = yearArg ? parseInt(yearArg.split('=')[1] || args[args.indexOf(yearArg) + 1]) : 2025
const minResultsArg = args.find(arg => arg.startsWith('--min-results='))
const MIN_RESULTS = minResultsArg ? parseInt(minResultsArg.split('=')[1]) : 20
const noCache = args.includes('--no-cache')

const CACHE_FILE = join(__dirname, '..', `.athlete_stadium_cache_${year}.json`)

// Load cache
let cache = {}
if (!noCache && fs.existsSync(CACHE_FILE)) {
  try {
    cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'))
  } catch (e) {
    console.error('Failed to load cache:', e.message)
  }
}

async function getAthleteResults(athleteId) {
  // Check cache first
  if (cache[athleteId]) {
    return cache[athleteId]
  }

  try {
    const resultsResponse = await fetch(`${API_BASE_URL}/athletes/${athleteId}/results`)
    if (!resultsResponse.ok) return []
    const allResults = await resultsResponse.json()

    // Filter by year and extract venue data
    const yearResults = []
    
    if (allResults && Array.isArray(allResults)) {
      allResults.forEach(r => {
        const resultYear = new Date(r.date).getFullYear()
        if (resultYear === year && r.resultScore && r.location) {
          const city = r.location.city || 'Unknown'
          const country = r.location.country || 'Unknown'
          const venueKey = `${city}, ${country}`
          
          yearResults.push({
            venue: venueKey,
            city: city,
            country: country,
            score: r.resultScore
          })
        }
      })
    }

    cache[athleteId] = yearResults
    return yearResults
  } catch (error) {
    console.error(`Error fetching results for athlete ${athleteId}:`, error.message)
    return []
  }
}

async function getBestStadiums() {
  try {
    // Get all athletes from the database
    const result = await sql`SELECT athlete_id FROM athlete_views`
    const athleteIds = result.rows.map(row => row.athlete_id)

    console.log(`Found ${athleteIds.length} athletes in database`)
    console.log(`Analyzing stadium performance for year ${year}...`)
    console.log(`Minimum results per venue: ${MIN_RESULTS}`)
    console.log('')

    const venueData = {}
    let processed = 0

    for (const athleteId of athleteIds) {
      const results = await getAthleteResults(athleteId)
      processed++
      
      if (results.length > 0) {
        results.forEach(r => {
          if (!venueData[r.venue]) {
            venueData[r.venue] = {
              venue: r.venue,
              city: r.city,
              country: r.country,
              totalScore: 0,
              resultCount: 0,
              scores: []
            }
          }
          
          venueData[r.venue].totalScore += r.score
          venueData[r.venue].resultCount += 1
          venueData[r.venue].scores.push(r.score)
        })
        
        console.log(`✓ [${processed}/${athleteIds.length}] Athlete ${athleteId}: ${results.length} results`)
      } else {
        console.log(`✗ [${processed}/${athleteIds.length}] Athlete ${athleteId}: No results`)
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    // Calculate averages and filter by minimum results
    const stadiumsArray = Object.values(venueData)
      .filter(v => v.resultCount >= MIN_RESULTS)
      .map(v => ({
        venue: v.venue,
        city: v.city,
        country: v.country,
        avgScore: Math.round(v.totalScore / v.resultCount),
        resultCount: v.resultCount,
        lastUpdated: new Date().toISOString()
      }))
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, limit)

    console.log('')
    console.log('='.repeat(60))
    console.log(`TOP ${limit} STADIUMS (${year})`)
    console.log('='.repeat(60))
    console.log('')

    stadiumsArray.forEach((stadium, index) => {
      console.log(`${index + 1}. ${stadium.venue}`)
      console.log(`   Avg Score: ${stadium.avgScore} | Results: ${stadium.resultCount}`)
      console.log('')
    })

    // Save to JSON file
    const outputPath = join(__dirname, '..', 'public', 'data', `stadium_stats_${year}.json`)
    const outputDir = dirname(outputPath)
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(stadiumsArray, null, 2))
    console.log(`✓ Saved to ${outputPath}`)

    // Save cache
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2))
    console.log(`✓ Cache saved to ${CACHE_FILE}`)

    return stadiumsArray
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

// Run the script
getBestStadiums()
  .then(() => {
    console.log('Done!')
    process.exit(0)
  })
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
