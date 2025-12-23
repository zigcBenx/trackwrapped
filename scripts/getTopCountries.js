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
 * Script to find the top countries by total athlete views (wraps generated).
 * Aggregates athlete views by country to show which countries' athletes
 * are most popular on TrackWrapped.
 * 
 * Supports:
 * --limit X : Show only top X countries (default: 5)
 */

const API_BASE_URL = 'https://worldathletics.nimarion.de'
const args = process.argv.slice(2)
const limitArg = args.find(arg => arg.startsWith('--limit=') || arg === '-l')
const limit = limitArg ? parseInt(limitArg.split('=')[1] || args[args.indexOf(limitArg) + 1]) : 5

async function getTopCountries() {
  try {
    // Get all athlete views from the database
    const result = await sql`
      SELECT athlete_id, views
      FROM athlete_views 
      ORDER BY views DESC
    `
    
    console.log(`Found ${result.rows.length} athletes with views`)
    console.log('Fetching athlete countries...')
    console.log('')

    const countryViews = {}
    let processed = 0

    for (const row of result.rows) {
      const athleteId = row.athlete_id
      const viewCount = row.views
      
      try {
        // Fetch athlete details to get country
        const response = await fetch(`${API_BASE_URL}/athletes/${athleteId}`)
        if (response.ok) {
          const athlete = await response.json()
          const country = athlete.country || athlete.nationality || 'Unknown'
          
          if (!countryViews[country]) {
            countryViews[country] = {
              country: country,
              totalViews: 0,
              athleteCount: 0
            }
          }
          
          countryViews[country].totalViews += viewCount
          countryViews[country].athleteCount += 1
          
          processed++
          if (processed % 50 === 0) {
            console.log(`Processed ${processed}/${result.rows.length} athletes...`)
          }
        }
      } catch (error) {
        console.error(`Error fetching athlete ${athleteId}:`, error.message)
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    // Convert to array and sort by total views
    const countriesArray = Object.values(countryViews)
      .sort((a, b) => b.totalViews - a.totalViews)
      .slice(0, limit)
      .map(c => ({
        ...c,
        lastUpdated: new Date().toISOString()
      }))

    console.log('')
    console.log('='.repeat(60))
    console.log(`TOP ${limit} COUNTRIES BY WRAPS GENERATED`)
    console.log('='.repeat(60))
    console.log('')

    countriesArray.forEach((country, index) => {
      console.log(`${index + 1}. ${country.country}`)
      console.log(`   Total Views: ${country.totalViews.toLocaleString()}`)
      console.log(`   Athletes: ${country.athleteCount}`)
      console.log('')
    })

    // Save to JSON file
    const outputPath = join(__dirname, '..', 'public', 'data', 'country_stats_2025.json')
    const outputDir = dirname(outputPath)
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(countriesArray, null, 2))
    console.log(`✓ Saved to ${outputPath}`)

    return countriesArray
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

// Run the script
getTopCountries()
  .then(() => {
    console.log('Done!')
    process.exit(0)
  })
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
