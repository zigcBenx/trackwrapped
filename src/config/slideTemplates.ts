import type { ProcessedAthleteStats } from '@/types/athleteDetails'
import {
  getWelcomeMessage,
  getExperienceJoke,
  getDisciplineJoke,
  getPerformanceJoke,
  getCompetitionJoke,
  generateNickname,
  getFinaleMessage,
  getIndoorOutdoorJoke
} from '@/utils/jokeGenerator'
import {
  getWorldRecordComparison,
  getNemesisJoke,
  getVictoryRateJoke,
  getTopRivalsJoke,
  getWindSpeedJoke
} from '@/utils/newSlideJokes'

export interface SlideConfig {
  id: string
  type: 'welcome' | 'experience' | 'discipline' | 'performance' | 'competition' | 'nickname' | 'worldrecord' | 'victoryrate' | 'nemesis' | 'rivals' | 'wind' | 'finale'
  title: (data: SlideData) => string
  content: (data: SlideData) => string
  background: string
  emoji?: string
}

export interface SlideData {
  firstName: string
  lastName: string
  stats: ProcessedAthleteStats
  nickname?: string
}

export const slideTemplates: SlideConfig[] = [
  {
    id: 'welcome',
    type: 'welcome',
    title: (data) => getWelcomeMessage(data.firstName),
    content: () => "Swipe or press → to continue",
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    emoji: '🎉'
  },
  {
    id: 'experience',
    type: 'experience',
    title: (data) => `${data.stats.yearsActive} Year${data.stats.yearsActive !== 1 ? 's' : ''} in Track & Field`,
    content: (data) => getExperienceJoke(data.stats.yearsActive),
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    emoji: '📅'
  },
  {
    id: 'discipline',
    type: 'discipline',
    title: (data) => `Main Event: ${data.stats.mainDiscipline}`,
    content: (data) => getDisciplineJoke(data.stats.disciplineCategory, data.stats.mainDiscipline),
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    emoji: '🏃'
  },
  {
    id: 'performance',
    type: 'performance',
    title: () => 'Performance Check',
    content: (data) => getPerformanceJoke(data.stats.isImproving, data.stats),
    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    emoji: '📊'
  },
  {
    id: 'competition',
    type: 'competition',
    title: (data) => `${data.stats.totalCompetitions} Competition${data.stats.totalCompetitions !== 1 ? 's' : ''}`,
    content: (data) => getCompetitionJoke(data.stats.competitionFrequency, data.stats.totalCompetitions),
    background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    emoji: '🏆'
  },
  {
    id: 'nickname',
    type: 'nickname' as const,
    title: () => 'Your TrackWrapped Nickname',
    content: (data) => data.nickname || generateNickname(data.stats, data.firstName),
    background: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    emoji: '⭐'
  },
  {
    id: 'worldrecord',
    type: 'worldrecord' as const,
    title: () => 'Famous Athlete Comparison',
    content: (data) => getWorldRecordComparison(data.stats.bestPerformance, data.stats.mainDiscipline),
    background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    emoji: '🏅'
  },
  {
    id: 'victoryrate',
    type: 'victoryrate' as const,
    title: (data) => `${data.stats.victoryRate}% Victory Rate`,
    content: (data) => getVictoryRateJoke(data.stats.victoryRate),
    background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    emoji: '🎯'
  },
  {
    id: 'nemesis',
    type: 'nemesis' as const,
    title: () => 'Nemesis Alert',
    content: (data) => getNemesisJoke(data.stats.nemesis),
    background: 'linear-gradient(135deg, #434343 0%, #000000 100%)',
    emoji: '😈'
  },
  {
    id: 'rivals',
    type: 'rivals' as const,
    title: () => 'Top 3 Rivals',
    content: (data) => getTopRivalsJoke(data.stats.topRivals),
    background: 'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)',
    emoji: '⚔️'
  },
  {
    id: 'wind',
    type: 'wind' as const,
    title: () => 'Wind Conditions',
    content: (data) => getWindSpeedJoke(data.stats.averageWind, data.stats.hasWindData),
    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    emoji: '🌬️'
  },
  {
    id: 'finale',
    type: 'finale',
    title: (data) => data.nickname || generateNickname(data.stats, data.firstName),
    content: (data) => {
      const stats = data.stats
      const lines: string[] = []
      
      // Main statistics
      lines.push(`📊 Career Stats:`)
      lines.push(`🏃 ${stats.totalCompetitions} Total Competitions`)
      
      if (stats.currentSeasonCompetitions > 0) {
        lines.push(`📅 ${stats.currentSeasonCompetitions} Races This Season`)
      }
      
      if (stats.averageResultScore > 0) {
        lines.push(`⭐ ${stats.averageResultScore} Average Performance Score`)
      }
      
      if (stats.topPlacements > 0) {
        lines.push(`🥇 ${stats.topPlacements} Podium Finishes`)
      }
      
      // Indoor/Outdoor joke
      const indoorOutdoorJoke = getIndoorOutdoorJoke(stats.indoorCompetitions, stats.outdoorCompetitions)
      if (indoorOutdoorJoke) {
        lines.push(`\n${indoorOutdoorJoke}`)
      }
      
      return lines.join('\n')
    },
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    emoji: '🎊'
  }
]

// Helper function to get all slides with data
export function generateSlides(data: SlideData): SlideConfig[] {
  // Generate nickname once and add to data
  const nickname = generateNickname(data.stats, data.firstName)
  const dataWithNickname = { ...data, nickname }
  
  return slideTemplates.map(template => ({
    ...template,
    // Pre-compute title and content for easier rendering
    computedTitle: template.title(dataWithNickname),
    computedContent: template.content(dataWithNickname)
  })) as any
}
