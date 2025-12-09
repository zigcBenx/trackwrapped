export interface AthleteLocation {
  stadium?: string
  city?: string
  country: string
  indoor: boolean
}

export interface PersonalBest {
  date: string
  discipline: string
  disciplineCode: string
  mark: string
  performanceValue: number
  isTechnical: boolean
  location: AthleteLocation
  legal: boolean
  resultScore: number
  wind?: number | null
  competition: string | null
  category: string | null
  race: string | null
  place: number | null
  records: string[]
  competitionId: number
  eventId: number
}

export interface AthleteResult {
  category: string
  competition: string
  date: string
  discipline: string
  disciplineCode: string
  place: number
  resultScore: number
  wind?: number | null
  mark: string
  performanceValue: number
  isTechnical: boolean
  legal: boolean
  location: AthleteLocation
  race: string
  records: string[]
  competitionId: number
  eventId: number
}

export interface AthleteDetails {
  id: number
  firstname: string
  lastname: string
  birthdate: string | null
  country: string
  sex: string | null
  athleteRepresentativeId: number
  activeSeasons: number[]
  currentWorldRankings: any[]
  seasonsbests: any[]
  personalbests: PersonalBest[]
}

export interface ProcessedAthleteStats {
  yearsActive: number
  firstYear: number
  lastYear: number
  totalCompetitions: number
  mainDiscipline: string
  disciplineCategory: 'sprint' | 'distance' | 'jump' | 'throw' | 'combined'
  bestPerformance: PersonalBest | null
  hasWorldRecord: boolean
  topPlacements: number
  averagePlace: number
  isImproving: boolean
  competitionFrequency: 'rare' | 'occasional' | 'regular' | 'frequent'
  indoorCompetitions: number
  outdoorCompetitions: number
  currentSeasonCompetitions: number
  averageResultScore: number
  victoryRate: number
  nemesis: { name: string; losses: number } | null
  topRivals: Array<{ name: string; meetings: number }>
  averageWind: number | null
  hasWindData: boolean
}

