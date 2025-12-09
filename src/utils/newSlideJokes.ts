import type { ProcessedAthleteStats, PersonalBest } from '@/types/athleteDetails'

import type { ProcessedAthleteStats, PersonalBest } from '@/types/athleteDetails'

export function getWorldRecordSequence(bestPerformance: PersonalBest | null, discipline: string): string[] {
  if (!bestPerformance) {
    return [
      "Every journey begins somewhere...",
      "You haven't recorded a PB yet",
      "But greatness awaits! 🏃"
    ]
  }

  return [
    `Your best mark in ${discipline}...`,
    "Is impressive in its own right",
    "But how does it compare to the G.O.A.T? 🤔"
  ]
}

export function getNemesisSequence(nemesis: { name: string; losses: number } | null): string[] {
  if (!nemesis) {
    return [
      "We looked for your arch-enemy...",
      "Scanned all your races...",
      "But you have no nemesis! (Yet) 🤷"
    ]
  }

  return [
    "One name keeps popping up...",
    `They've crossed the line before you ${nemesis.losses} times`,
    "It's time to settle the score... 😤"
  ]
}

export function getVictoryRateSequence(victoryRate: number): string[] {
  const lines = [
    "We crunched the numbers...",
    "Calculated your podium finishes...",
  ]

  if (victoryRate >= 50) {
    lines.push("And the results are legendary! 🥇")
  } else if (victoryRate >= 15) {
    lines.push("You're a serious contender! 🏆")
  } else {
    lines.push("Every race is a battle! 💪")
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
    "You've seen some faces often...",
    `Combined ${totalMeetings} showdowns`,
    "These are your main characters ⚔️"
  ]
}

export function getWindSpeedSequence(averageWind: number | null, hasWindData: boolean): string[] {
  if (!hasWindData || averageWind === null) {
    return [
      "Checking the weather report...",
      "No wind data found",
      "Maybe you run indoors? 🌬️"
    ]
  }

  const lines = ["Mother Nature has been watching..."]
  
  if (averageWind > 1.0) {
    lines.push("She's been pushing you forward")
    lines.push("You love a good tailwind! 🌪️")
  } else if (averageWind < -1.0) {
    lines.push("She's been pushing you back")
    lines.push("Headwinds build character! 💨")
  } else {
    lines.push("Conditions have been fair")
    lines.push("Perfectly balanced ⚖️")
  }
  
  return lines
}
