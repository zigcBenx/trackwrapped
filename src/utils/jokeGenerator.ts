import type { ProcessedAthleteStats } from '@/types/athleteDetails'

export function getExperienceSequence(yearsActive: number): string[] {
  const lines = ["You've been on the track scene for a while..."]
  
  if (yearsActive <= 2) {
    lines.push("Just getting started!")
    lines.push("Fresh legs, big dreams 👟")
  } else if (yearsActive <= 5) {
    lines.push("Finding your rhythm...")
    lines.push("No longer a rookie 📚")
  } else if (yearsActive <= 10) {
    lines.push("Seen a lot of starting lines...")
    lines.push("Veteran status loading... 🏠")
  } else {
    lines.push("Longer than some competitors have been alive!")
    lines.push("Is retirement knocking? (Jk) 🏛️")
  }
  
  return lines
}

export function getDisciplineSequence(category: string, discipline: string): string[] {
  const lines = [`Your main event is ${discipline}...`]
  
  if (category === 'sprint') {
    lines.push("Life in the fast lane")
    lines.push("Blink and you'll miss it 🐆")
  } else if (category === 'distance') {
    lines.push("The long game")
    lines.push("Endurance is your middle name 🏃‍♀️")
  } else if (category === 'jump') {
    lines.push("Defying gravity")
    lines.push("The sky is the limit 🚀")
  } else if (category === 'throw') {
    lines.push("Power and precision")
    lines.push("Heavy objects beware 💪")
  } else {
    lines.push("Doing it all")
    lines.push("Why choose one? 🎯")
  }
  
  return lines
}

export function getPerformanceSequence(isImproving: boolean, stats: ProcessedAthleteStats): string[] {
  const lines = ["Analyzing your recent form..."]
  
  if (isImproving) {
    lines.push("The trend line is going up")
    lines.push("Stonks! 📈")
  } else {
    lines.push("Consistency is key")
    lines.push("Trust the process ✨")
  }
  
  return lines
}

export function getCompetitionSequence(frequency: string, totalCompetitions: number): string[] {
  return [
    "Looking at your race calendar...",
    `You've competed ${totalCompetitions} times`,
    frequency === 'frequent' ? "Do you live at the track? ⛺" : "Quality over quantity 👌"
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
    sprint: 'Cheetah',
    distance: stats.mainDiscipline.includes('Marathon') || stats.mainDiscipline.includes('5000') || stats.mainDiscipline.includes('10000') ? 'Camel' : 'Gazelle',
    jump: stats.mainDiscipline.includes('High Jump') || stats.mainDiscipline.includes('Pole') ? 'Grasshopper' : 'Frog',
    throw: Math.random() > 0.5 ? 'Rhino' : 'Gorilla', // Randomize between two
    combined: 'Chameleon'
  }
  
  // Add hurdles detection
  if (stats.mainDiscipline.toLowerCase().includes('hurdle')) {
    return `${frequency} Kangaroo`
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
    lines.push("You prefer climate control")
    lines.push("Indoor Specialist 🏠")
  } else {
    lines.push("You brave the elements")
    lines.push("Outdoor Warrior 🌞")
  }
  
  return lines
}

export function getFinaleSequence(stats: ProcessedAthleteStats): string[] {
  return [
    "What a season it's been!",
    "You showed up and showed out",
    "Here's your summary card 📸"
  ]
}
