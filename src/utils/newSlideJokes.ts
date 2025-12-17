import type { ProcessedAthleteStats, PersonalBest } from '@/types/athleteDetails'

export function getWorldRecordSequence(bestPerformance: PersonalBest | null, discipline: string): string[] {
  if (!bestPerformance) {
    return [
      "Every journey begins somewhere...",
      "You haven't recorded a PB yet",
      "But greatness awaits! 🏃"
    ]
  }

  // Use the discipline from the best performance, not the main discipline
  const actualDiscipline = bestPerformance.discipline || discipline

  return [
    `Your best mark in ${actualDiscipline}...`,
    "Chasing the immortals. ⚡",
    "But how does it compare to the G.O.A.T? 🤔"
  ]
}

export function getNemesisSequence(nemesis: { name: string; losses: number } | null): string[] {
  if (!nemesis) {
    return [
      "We scanned the opposition...",
      "No one dares challenge you. 👑",
      "Dominating solo. 🐺"
    ]
  }

  return [
    "Target Acquired. 🎯",
    `They crossed the line before you ${nemesis.losses} times`,
    "Time to take them down. ⚔️"
  ]
}

export function getVictoryRateSequence(victoryRate: number): string[] {
  const lines = [
    "Analyzing your podium finishes...",
    "Calculating dominance...",
  ]

  if (victoryRate >= 50) {
    lines.push("Dominating the field! 🥇")
  } else if (victoryRate >= 15) {
    lines.push("Podium Hunter! 🏆")
  } else {
    lines.push("Every race is a war! 💪")
  }
  
  return lines
}

export function getTopRivalsSequence(topRivals: Array<{ name: string; meetings: number }>): string[] {
  if (topRivals.length === 0) {
    return [
      "You're a lone wolf...",
      "No regular rivals found",
      "Just you against the clock ⏱️"
    ]
  }

  const totalMeetings = topRivals.reduce((sum, r) => sum + r.meetings, 0)
  
  return [
    "Your recurring nightmares. 😈",
    `Combined ${totalMeetings} showdowns`,
    "The Usual Suspects. ⚔️"
  ]
}

export function getWindSpeedSequence(averageWind: number | null, hasWindData: boolean): string[] {
  if (!hasWindData || averageWind === null) {
    return [
      "Checking conditions...",
      "No wind data found",
      "Maybe you run indoors? 🌬️"
    ]
  }

  const lines = ["Mother Nature's verdict..."]
  
  if (averageWind > 1.0) {
    lines.push("Riding the storm. 🌪️")
    lines.push("Wind assist? We take those.")
  } else if (averageWind < -1.0) {
    lines.push("Fighting the gale. 🛡️")
    lines.push("Resistance training. 💨")
  } else {
    lines.push("Pure speed. No excuses. ⚖️")
    lines.push("Conditions were fair.")
  }
  
  
  return lines
}

export function getTravelSequence(countriesCount: number, isDomesticOnly: boolean, homeCountry: string): string[] {
  if (isDomesticOnly) {
    return [
      "Checking your passport...",
      "Hometown Hero. 🏠",
      `Defending the turf in ${homeCountry}`
    ]
  }

  const lines = ["Checking your passport..."]
  
  if (countriesCount <= 3) {
    return [
      "International Assassin. 🌍",
      "Global threats.",
      "A taste of the world"
    ]
  } else if (countriesCount <= 10) {
    lines.push("You've been getting around!")
    lines.push("Collecting flags like medals 🚩")
  } else {
    return [
      "World Tour Mode. ✈️",
      "No borders.",
      "Just finish lines."
    ]
  }
  
  return lines
}
