import type { ProcessedAthleteStats, PersonalBest } from '@/types/athleteDetails'

export function getWorldRecordComparison(bestPerformance: PersonalBest | null, discipline: string): string {
  if (!bestPerformance) {
    return "No personal best recorded yet. The journey of a thousand miles begins with a single step! 🏃"
  }

  // This is a simplified version - in reality, we'd need a database of world records
  // For now, we'll create humorous comparisons based on the discipline
  const jokes = [
    `Your PB is... well, let's just say Usain Bolt isn't losing sleep over it 😅`,
    `You're getting there! Only need to shave off... *checks notes* ...quite a bit! 📝`,
    `The gap between you and the world record? Let's call it 'room for improvement' 💪`,
    `World record holders: exist. You: 'Hold my water bottle' 🍼`,
    `You're in the same sport as the world record holder! That's basically the same thing, right? 🤔`
  ]

  return jokes[Math.floor(Math.random() * jokes.length)]
}

export function getNemesisJoke(nemesis: { name: string; losses: number } | null): string {
  if (!nemesis) {
    return "No nemesis detected! Either you're unbeatable, or you need to compete more 🤷"
  }

  const jokes = [
    `${nemesis.name} has beaten you ${nemesis.losses} times. They're living rent-free in your head 🏠`,
    `${nemesis.name}: Your personal villain origin story 🦹‍♂️`,
    `${nemesis.name} sees you at the start line and smiles. You know why. 😏`,
    `Plot twist: ${nemesis.name} doesn't even remember you 💀`
  ]

  return jokes[Math.floor(Math.random() * jokes.length)]
}

export function getVictoryRateJoke(victoryRate: number): string {
  if (victoryRate >= 50) {
    return `${victoryRate}% podium rate! You're basically a podium magnet 🧲🥇`
  } else if (victoryRate >= 30) {
    return `${victoryRate}% podium rate! Not bad! You're like a part-time champion 🏆`
  } else if (victoryRate >= 15) {
    return `${victoryRate}% podium rate. Hey, quality over quantity, right? ...Right? 😅`
  } else if (victoryRate >= 5) {
    return `${victoryRate}% podium rate. Rare, like a shiny Pokémon! ✨`
  } else if (victoryRate > 0) {
    return `${victoryRate}% podium rate. You treasure those moments like gold 🥺💛`
  } else {
    return `0% podium rate. But you show up, and that's what counts! 💪 (Seriously though, keep trying!)`
  }
}

export function getTopRivalsJoke(topRivals: Array<{ name: string; meetings: number }>): string {
  if (topRivals.length === 0) {
    return "No frequent rivals found. You're either too good or too inconsistent to have regular competition 🎭"
  }

  const totalMeetings = topRivals.reduce((sum, r) => sum + r.meetings, 0)
  const rivalNames = topRivals.map(r => r.name).join(', ')

  return `You've faced ${rivalNames} a combined ${totalMeetings} times. It's giving 'anime rivalry arc' energy ⚡`
}

export function getWindSpeedJoke(averageWind: number | null, hasWindData: boolean): string {
  if (!hasWindData || averageWind === null) {
    return "No wind data available. You're either a thrower, or the wind gods don't care about you 🌬️"
  }

  if (averageWind > 1.5) {
    return `Average wind: +${averageWind}m/s. You love a good tailwind! Mother Nature is your training partner 🌪️`
  } else if (averageWind > 0.5) {
    return `Average wind: +${averageWind}m/s. Slightly helpful! The wind whispers encouragement 🍃`
  } else if (averageWind > -0.5) {
    return `Average wind: ${averageWind}m/s. Perfectly balanced, as all things should be ⚖️`
  } else if (averageWind > -1.5) {
    return `Average wind: ${averageWind}m/s. Headwinds build character! (That's what we tell ourselves) 💨`
  } else {
    return `Average wind: ${averageWind}m/s. You're basically running into a wall. Respect. 🧱`
  }
}
