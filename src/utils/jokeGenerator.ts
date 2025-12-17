import type { ProcessedAthleteStats } from '@/types/athleteDetails'

export function getExperienceSequence(yearsActive: number): string[] {
  const lines = ["You've been in the arena for a while..."]
  
  if (yearsActive <= 2) {
    lines.push("Fresh blood on the track.")
    lines.push("The future is yours to take. ⚡")
  } else if (yearsActive <= 5) {
    lines.push("Making your name known.")
    lines.push("No longer a rookie. A threat. ⚠️")
  } else if (yearsActive <= 10) {
    lines.push("A seasoned warrior.")
    lines.push("Respect earned in blood & sweat. 🫡")
  } else {
    lines.push("A living legend.")
    lines.push("Decades of dominance. 👑")
  }
  
  return lines
}

export function getDisciplineSequence(category: string, discipline: string): string[] {
  const lines = [`Your battlefield is ${discipline}...`]
  
  if (category === 'sprint') {
    lines.push("Pure explosive power.")
    lines.push("Speed kills. 🐆")
  } else if (category === 'distance') {
    lines.push("Pain is fuel.")
    lines.push("Outlasting the weak. 💀")
  } else if (category === 'jump') {
    lines.push("Gravity is just a suggestion.")
    lines.push("Flight mode engaged. ✈️")
  } else if (category === 'throw') {
    lines.push("Brute force & precision.")
    lines.push("Unleashing the beast. 🦍")
  } else {
    lines.push("Master of all trades.")
    lines.push("The ultimate athlete. ⚔️")
  }
  
  return lines
}

export function getPerformanceSequence(isImproving: boolean, stats: ProcessedAthleteStats): string[] {
  const lines = ["Analyzing your season output..."]

  // Comment on score progression
  if (stats.lastSeasonBestScore > 0) {
    if (stats.scoreChangePercent > 10) {
      lines.push("Leveling up aggressively. 🚀")
    } else if (stats.scoreChangePercent > 0) {
      lines.push("Grinding out the gains. 📈")
    } else if (stats.scoreChangePercent < -10) {
      lines.push("Rebuilding the engine.")
    } else {
      lines.push("Holding the line. 🛡️")
    }
  } else {
    lines.push("Establishing your baseline...")
  }

  // Comment on percentile
  const percentileNum = parseFloat(stats.percentileRank.rank)
  if (percentileNum <= 1) {
    lines.push("ELITE STATUS UNLOCKED. 👑")
  } else if (percentileNum <= 10) {
    lines.push("World Class Material. 🔥")
  } else if (percentileNum <= 50) {
    lines.push("Climbing the ranks. 🧗")
  } else {
    lines.push("The grind never stops. ⚙️")
  }

  return lines
}

export function getCompetitionSequence(frequency: string, totalCompetitions: number): string[] {
  return [
    "Scanning your race calendar...",
    `You stepped up ${totalCompetitions} times`,
    frequency === 'frequent' ? "Track is your second home. 🏠" : "Selective strikes. 🎯"
  ]
}

export function generateNickname(stats: ProcessedAthleteStats, name: string): string {
  // New formula: [Frequency Modifier] + [Event Animal]
  
  // Frequency based on competition count
  let frequency = 'Weekend'
  if (stats.totalCompetitions >= 16) {
    frequency = 'Iron'
  } else if (stats.totalCompetitions >= 10) {
    frequency = 'Relentless'
  } else if (stats.totalCompetitions >= 6) {
    frequency = 'Steady'
  }
  
  // Animal based on discipline category
  const animals: Record<string, string> = {
    sprint: 'Viper',
    distance: stats.mainDiscipline.includes('Marathon') || stats.mainDiscipline.includes('5000') || stats.mainDiscipline.includes('10000') ? 'Titan' : 'Wolf',
    jump: stats.mainDiscipline.includes('High Jump') || stats.mainDiscipline.includes('Pole') ? 'Eagle' : 'Hawk',
    throw: Math.random() > 0.5 ? 'Tank' : 'Goliath', // Randomize between two
    combined: 'Gladiator'
  }
  
  // Add hurdles detection
  if (stats.mainDiscipline.toLowerCase().includes('hurdle')) {
    return `${frequency} Raptor`
  }
  
  const animal = animals[stats.disciplineCategory] ?? 'Athlete'
  return `${frequency} ${animal}`
}

export function getWelcomeMessage(firstName: string): string {
  // Keep as string for title
  return `${firstName}'s TrackWrapped`
}

export function getIndoorOutdoorSequence(indoorCount: number, outdoorCount: number): string[] {
  const total = indoorCount + outdoorCount
  if (total === 0) return ["No preference detected"]

  const indoorPercentage = (indoorCount / total) * 100
  const lines = ["Checking your habitat..."]

  if (indoorPercentage >= 60) {
    lines.push("King of the Boards. 🏟️")
    lines.push("Short track dominance.")
  } else {
    lines.push("Element Proof. ⛈️")
    lines.push("Conquering the outdoors.")
  }
  
  return lines
}

export function getFinaleSequence(stats: ProcessedAthleteStats): string[] {
  return [
    "Season: CONQUERED. 🏁",
    "The numbers don't lie.",
    "Proof of your grind. 📸"
  ]
}
