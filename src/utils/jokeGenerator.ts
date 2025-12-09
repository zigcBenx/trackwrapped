import type { ProcessedAthleteStats } from '@/types/athleteDetails'

export function getExperienceJoke(yearsActive: number): string {
  if (yearsActive <= 2) {
    return "Fresh legs! You're basically still figuring out which shoe goes on which foot 👟"
  } else if (yearsActive <= 5) {
    return "Solid rookie vibes! You've graduated from 'what's a false start?' to actually knowing the rules 📚"
  } else if (yearsActive <= 10) {
    return "Veteran status unlocked! You've seen enough starting blocks to build a house 🏠"
  } else if (yearsActive <= 15) {
    return "Track legend! You've been running longer than some athletes have been alive 👴"
  } else {
    return "Ancient wisdom! At this point, you ARE the track. The track is you. 🏛️"
  }
}

export function getDisciplineJoke(category: string, discipline: string): string {
  const jokes: Record<string, string[]> = {
    sprint: [
      "You're fast... but let's be honest, you haven't run more than 400m at once since PE class 🏃‍♂️💨",
      "Speed demon! Your warm-up is longer than your actual race 😅",
      "Quick bursts of glory! You're like a cheetah, but with better shoes 🐆"
    ],
    distance: [
      "You run marathons for fun. Your idea of a 'quick jog' is most people's weekly mileage 🤯",
      "Endurance machine! You've spent more time running than sleeping this year 🏃‍♀️😴",
      "Long distance legend! Your GPS watch has seen more miles than most cars 🗺️"
    ],
    jump: [
      "You spend more time in the air than on the ground. Birds are jealous 🦅",
      "Defying gravity since day one! Newton would be confused 🚀",
      "Professional air-time collector! You're basically a human pogo stick 🦘"
    ],
    throw: [
      "You throw heavy things far. Simple. Effective. Terrifying. 💪",
      "Strength personified! You make throwing 16-pound balls look easy ⚡",
      "Power player! Your warm-up weights are other people's PRs 🏋️"
    ],
    combined: [
      "Jack of all trades! You do everything... which means you're slightly crazy 🤪",
      "Multi-event warrior! Why specialize when you can suffer in 10 different ways? 🎯",
      "The ultimate athlete! You're basically a track & field Swiss Army knife 🔧"
    ]
  }

  const categoryJokes = jokes[category]
  if (!categoryJokes || categoryJokes.length === 0) {
    return jokes.combined?.[0] ?? "You're an amazing athlete! 🌟"
  }
  return categoryJokes[Math.floor(Math.random() * categoryJokes.length)]
}

export function getPerformanceJoke(isImproving: boolean, stats: ProcessedAthleteStats): string {
  if (isImproving) {
    return "📈 Stonks! Your times are dropping faster than your motivation on leg day. Keep it up!"
  } else if (stats.averagePlace <= 3) {
    return "Steady as she goes! You're more reliable than your alarm clock ⏰ Consistency is key!"
  } else {
    return "Every champion has their seasons! Remember: it's not about the times, it's about the vibes ✨"
  }
}

export function getCompetitionJoke(frequency: string, totalCompetitions: number): string {
  const jokes: Record<string, string> = {
    rare: `${totalCompetitions} competitions? You're more selective than a Michelin star restaurant 🌟`,
    occasional: `${totalCompetitions} competitions! Quality over quantity, we respect it 👌`,
    regular: `${totalCompetitions} competitions! You're a regular on the circuit. The officials know your name 📋`,
    frequent: `${totalCompetitions} competitions?! You basically LIVE at the track. Do you have a tent there? ⛺`
  }

  return jokes[frequency] ?? jokes.regular
}

export function generateNickname(stats: ProcessedAthleteStats, name: string): string {
  const prefixes: string[] = []
  const suffixes: string[] = []

  // Based on experience
  if (stats.yearsActive <= 2) {
    prefixes.push('Rookie')
  } else if (stats.yearsActive <= 5) {
    prefixes.push('Rising')
  } else if (stats.yearsActive <= 10) {
    prefixes.push('Veteran')
  } else {
    prefixes.push('Legendary')
  }

  // Based on performance
  if (stats.hasWorldRecord) {
    suffixes.push('Record Breaker')
  } else if (stats.averagePlace <= 2) {
    suffixes.push('Podium Hunter')
  } else if (stats.isImproving) {
    suffixes.push('Rising Star')
  } else {
    suffixes.push('Competitor')
  }

  // Based on discipline
  const disciplineNames: Record<string, string> = {
    sprint: 'Speedster',
    distance: 'Endurance Beast',
    jump: 'Air Walker',
    throw: 'Power House',
    combined: 'All-Rounder'
  }

  const disciplineName = disciplineNames[stats.disciplineCategory] ?? 'Athlete'

  // Combine elements
  const nickname = `The ${prefixes[0]} ${disciplineName}`
  
  return nickname
}

export function getWelcomeMessage(firstName: string): string {
  const messages = [
    `Let's unwrap ${firstName}'s track career...`,
    `Time to dive into ${firstName}'s athletic journey!`,
    `Ready to see what ${firstName} has been up to?`,
    `${firstName}'s TrackWrapped is here! 🎉`
  ]
  
  return messages[Math.floor(Math.random() * messages.length)]
}

export function getIndoorOutdoorJoke(indoorCount: number, outdoorCount: number): string | null {
  const total = indoorCount + outdoorCount
  if (total === 0) return null

  const indoorPercentage = (indoorCount / total) * 100

  if (indoorPercentage >= 75) {
    return "🏠 Indoor specialist! You seem to prefer climate-controlled comfort over actual weather. Smart choice! ❄️"
  } else if (indoorPercentage >= 60) {
    return "You're definitely not a fan of warm weather - most of your races are indoors! ☃️"
  } else if (indoorPercentage <= 25) {
    return "🌞 Outdoor warrior! You thrive in the elements. Rain, shine, or wind - you're out there! 🌤️"
  } else if (indoorPercentage <= 40) {
    return "Fresh air enthusiast! You clearly prefer competing under the open sky 🌈"
  }

  return null // Balanced indoor/outdoor, no joke needed
}

export function getFinaleMessage(stats: ProcessedAthleteStats): string {
  if (stats.hasWorldRecord) {
    return "A world record holder! You're literally the best in the world at something. That's insane! 🌍🏆"
  } else if (stats.averagePlace <= 2) {
    return "A podium regular! You know what it feels like to stand at the top. Keep chasing gold! 🥇"
  } else if (stats.isImproving) {
    return "On the rise! Your best days are still ahead. Keep grinding! 💪"
  } else {
    return "A true competitor! You show up, you compete, you inspire. That's what it's all about! ❤️"
  }
}
