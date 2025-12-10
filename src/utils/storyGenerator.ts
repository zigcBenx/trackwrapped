import type { AthleteDetails, AthleteResult, ProcessedAthleteStats } from '@/types/athleteDetails'
import { calculateCareerStats } from './stats/career'
import { calculateCompetitionStats } from './stats/competitions'
import { calculateDisciplineStats } from './stats/discipline'
import { calculatePerformanceStats } from './stats/performance'
import { analyzeRivals } from './stats/rivals'
import { analyzeWindConditions } from './stats/wind'
import { calculateGeographyStats } from './stats/geography'
import { calculateCompetitionHeatmap } from './stats/heatmap'

/**
 * Process athlete data into statistics
 * @param details - Athlete details from API
 * @param results - Athlete results from API (should be pre-filtered by year if needed)
 * @param year - Optional year for scope (null = lifetime)
 * @returns Processed statistics for all slides
 */
export function processAthleteData(
  details: AthleteDetails,
  results: AthleteResult[],
  year?: number | null
): ProcessedAthleteStats {
  // Career stats
  const careerStats = calculateCareerStats(details, results, year)
  
  // Competition stats
  const competitionStats = calculateCompetitionStats(results, careerStats.yearsActive)
  
  // Discipline stats
  const disciplineStats = calculateDisciplineStats(results)
  
  // Performance stats
  const performanceStats = calculatePerformanceStats(details, results)
  
  // Rival analysis
  const rivalAnalysis = analyzeRivals(results, details.firstname, details.lastname)
  
  // Wind analysis
  const windAnalysis = analyzeWindConditions(results)
  
  // Geography stats
  const geographyStats = calculateGeographyStats(results)
  
  // Competition heatmap
  const competitionHeatmap = calculateCompetitionHeatmap(results)
  
  // Calculate current season competitions (for display purposes)
  const currentYear = new Date().getFullYear()
  const lastYear = careerStats.lastYear
  const currentSeasonCompetitions = results.filter(r => {
    const resultYear = new Date(r.date).getFullYear()
    return resultYear === currentYear || resultYear === lastYear
  }).length

  return {
    // Career
    yearsActive: careerStats.yearsActive,
    firstYear: careerStats.firstYear,
    lastYear: careerStats.lastYear,
    age: careerStats.age,
    
    // Competitions
    totalCompetitions: competitionStats.totalCompetitions,
    competitionFrequency: competitionStats.competitionFrequency,
    indoorCompetitions: competitionStats.indoorCompetitions,
    outdoorCompetitions: competitionStats.outdoorCompetitions,
    currentSeasonCompetitions,
    
    // Discipline
    mainDiscipline: disciplineStats.mainDiscipline,
    disciplineCategory: disciplineStats.disciplineCategory,
    
    // Performance
    bestPerformance: performanceStats.bestPerformance,
    hasWorldRecord: performanceStats.hasWorldRecord,
    topPlacements: performanceStats.topPlacements,
    averagePlace: performanceStats.averagePlace,
    isImproving: performanceStats.isImproving,
    averageResultScore: performanceStats.averageResultScore,
    victoryRate: performanceStats.victoryRate,
    
    // Rivals
    nemesis: rivalAnalysis.nemesis,
    topRivals: rivalAnalysis.topRivals,
    
    // Wind
    averageWind: windAnalysis.averageWind,
    hasWindData: windAnalysis.hasWindData,
    
    // Geography
    countries: geographyStats.countries,
    countriesCount: geographyStats.countriesCount,
    
    // Heatmap
    competitionHeatmap
  }
}
