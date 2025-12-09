export interface Athlete {
  id: number
  country: string
  firstname: string
  lastname: string
  birthdate: string | null
  levenshteinDistance: number
  sex: 'M' | 'W'
}

export interface AthleteSearchResponse {
  athletes: Athlete[]
  error?: string
}
