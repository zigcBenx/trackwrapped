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
 * Script to find the most traveled athletes for a specific season.
 * Fetches all athletes from the database, gets their competition history,
 * and counts unique countries they've competed in during the specified year.
 * 
 * Supports:
 * --limit X : Show only top X athletes
 * --csv     : Export results to most_traveled_athletes.csv
 * --year Y  : Specify the year (default: 2025)
 * --no-cache: Ignore local cache and fetch fresh data
 */

const API_BASE_URL = 'https://worldathletics.nimarion.de'
const args = process.argv.slice(2)
const limitArg = args.find(arg => arg.startsWith('--limit=') || arg === '-l')
const limit = limitArg ? parseInt(limitArg.split('=')[1] || args[args.indexOf(limitArg) + 1]) : null
const yearArg = args.find(arg => arg.startsWith('--year=') || arg === '-y')
const year = yearArg ? parseInt(yearArg.split('=')[1] || args[args.indexOf(yearArg) + 1]) : 2025
const exportCsv = args.includes('--csv')
const noCache = args.includes('--no-cache')

const CACHE_FILE = join(__dirname, '..', `.athlete_travel_cache_${year}.json`)

// Load cache
let cache = {}
if (!noCache && fs.existsSync(CACHE_FILE)) {
  try {
    cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'))
  } catch (e) {
    console.error('Failed to load cache:', e.message)
  }
}

async function getAthleteData(athleteId) {
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

    // 3. Filter by year and extract unique countries
    const countries = new Set()
    let seasonCompetitions = 0
    
    if (allResults && Array.isArray(allResults)) {
      allResults.forEach(r => {
        const resultYear = new Date(r.date).getFullYear()
        if (resultYear === year) {
          seasonCompetitions++
          if (r.location && r.location.country) {
            countries.add(r.location.country)
          }
        }
      })
    }

    const athleteData = {
      id: athleteId,
      name: `${details.firstname} ${details.lastname}`,
      countries: Array.from(countries).sort(),
      countryCount: countries.size,
      totalCompetitions: seasonCompetitions,
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

async function getMostTraveledAthletes() {
  try {
    // Get all athletes from the database
    const result = await sql`SELECT athlete_id FROM athlete_views`
    const athleteIds = result.rows.map(r => r.athlete_id)
    
    console.log(`Found ${athleteIds.length} athletes in the database.`)
    console.log(`Analyzing travel history for season ${year}...\n`)

    const CONCURRENCY = 10
    const processedAthletes = []
    
    for (let i = 0; i < athleteIds.length; i += CONCURRENCY) {
      const chunk = athleteIds.slice(i, i + CONCURRENCY)
      const chunkResults = await Promise.all(chunk.map(id => getAthleteData(id)))
      processedAthletes.push(...chunkResults.filter(a => a !== null))
      
      // Save cache periodically
      fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2))
      
      const progress = Math.min(100, Math.round(((i + chunk.length) / athleteIds.length) * 100))
      process.stdout.write(`\rProgress: ${progress}% (${i + chunk.length}/${athleteIds.length})`)
    }
    console.log('\n')

    // Sort by country count
    const sortedAthletes = processedAthletes.sort((a, b) => b.countryCount - a.countryCount)
    const displayAthletes = limit ? sortedAthletes.slice(0, limit) : sortedAthletes

    // Print results
    console.log('='.repeat(80))
    console.log(`MOST TRAVELED ATHLETES REPORT - SEASON ${year}`)
    console.log('='.repeat(80))
    console.log(`Total Athletes Analyzed: ${processedAthletes.length}`)
    console.log('='.repeat(80))
    console.log('\n')

    if (displayAthletes.length > 0) {
      console.table(displayAthletes.map((a, index) => ({
        Rank: index + 1,
        'Athlete ID': a.id,
        'Name': a.name,
        'Countries': a.countryCount,
        'Competitions': a.totalCompetitions,
        'Top Countries': a.countries.slice(0, 3).join(', ') + (a.countries.length > 3 ? '...' : '')
      })))
    }

    if (exportCsv) {
      const csvHeader = 'Rank,Athlete ID,Name,Unique Countries,Total Competitions,Countries List\n'
      const csvRows = sortedAthletes.map((a, index) => 
        `${index + 1},${a.id},"${a.name}",${a.countryCount},${a.totalCompetitions},"${a.countries.join('; ')}"`
      ).join('\n')
      
      const fileName = `most_traveled_athletes_${year}.csv`
      fs.writeFileSync(fileName, csvHeader + csvRows)
      console.log(`\n✅ Exported results to ${fileName}`)
    }

    // Save JSON for the web app
    const webDataDir = join(__dirname, '..', 'public', 'data')
    if (!fs.existsSync(webDataDir)) {
      fs.mkdirSync(webDataDir, { recursive: true })
    }
    const jsonFileName = join(webDataDir, `travel_stats_${year}.json`)
    fs.writeFileSync(jsonFileName, JSON.stringify(cache, null, 2))
    console.log(`✅ Saved web data to ${jsonFileName}`)

    return sortedAthletes
  } catch (error) {
    console.error('Error analyzing traveled athletes:', error)
    throw error
  }
}

// Run the script
getMostTraveledAthletes()
  .then(() => {
    console.log('\nScript completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Script failed:', error)
    process.exit(1)
  })
