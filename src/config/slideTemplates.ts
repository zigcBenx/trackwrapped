import type { ProcessedAthleteStats } from '@/types/athleteDetails'
import {
  getWelcomeMessage,
  getExperienceSequence,
  getDisciplineSequence,
  getPerformanceSequence,
  getCompetitionSequence,
  generateNickname,
  getFinaleSequence,
  getIndoorOutdoorSequence
} from '@/utils/jokeGenerator'
import {
  getWorldRecordSequence,
  getNemesisSequence,
  getVictoryRateSequence,
  getTopRivalsSequence,
  getWindSpeedSequence
} from '@/utils/newSlideJokes'
import { getWorldRecord } from '@/config/worldRecords'

export interface SlideConfig {
  id: string
  type: 'welcome' | 'experience' | 'discipline' | 'performance' | 'competition' | 'nickname' | 'worldrecord' | 'victoryrate' | 'nemesis' | 'rivals' | 'wind' | 'finale'
  title: (data: SlideData) => string
  storySequence: (data: SlideData) => string[]
  statReveal: (data: SlideData) => { value: string, label: string, subtext?: string }
  background: string
  emoji?: string
  layout?: 'default' | 'hero' | 'split' | 'versus'
  data?: SlideData
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
    storySequence: () => ["Ready to unwrap your year?", "Let's dive in..."],
    statReveal: (data) => ({ value: data.firstName, label: "TrackWrapped", subtext: "Swipe to start" }),
    background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
    emoji: '🎉',
    layout: 'hero'
  },
  {
    id: 'experience',
    type: 'experience',
    title: () => "Experience Check",
    storySequence: (data) => getExperienceSequence(data.stats.yearsActive),
    statReveal: (data) => ({ 
      value: `${data.stats.yearsActive}`, 
      label: "YEARS ACTIVE",
      subtext: "You're a veteran!" 
    }),
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    emoji: '📅'
  },
  {
    id: 'discipline',
    type: 'discipline',
    title: () => "Main Event",
    storySequence: (data) => getDisciplineSequence(data.stats.disciplineCategory, data.stats.mainDiscipline),
    statReveal: (data) => ({ 
      value: data.stats.mainDiscipline, 
      label: "MAIN DISCIPLINE" 
    }),
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    emoji: '🏃'
  },
  {
    id: 'performance',
    type: 'performance',
    title: () => "Performance Trend",
    storySequence: (data) => getPerformanceSequence(data.stats.isImproving, data.stats),
    statReveal: (data) => ({ 
      value: data.stats.isImproving ? "UP" : "STEADY", 
      label: "TREND",
      subtext: data.stats.isImproving ? "Personal Bests Incoming!" : "Consistency is King"
    }),
    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    emoji: '📊'
  },
  {
    id: 'competition',
    type: 'competition',
    title: () => "Race Frequency",
    storySequence: (data) => getCompetitionSequence(data.stats.competitionFrequency, data.stats.totalCompetitions),
    statReveal: (data) => ({ 
      value: `${data.stats.totalCompetitions}`, 
      label: "COMPETITIONS",
      subtext: "That's a lot of bib numbers!"
    }),
    background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    emoji: '🏆'
  },
  {
    id: 'nickname',
    type: 'nickname' as const,
    title: () => "Your Nickname",
    storySequence: () => ["Based on your stats...", "We found the perfect title..."],
    statReveal: (data) => ({ 
      value: data.nickname || generateNickname(data.stats, data.firstName), 
      label: "EARNED TITLE" 
    }),
    background: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    emoji: '⭐'
  },
  {
    id: 'worldrecord',
    type: 'worldrecord' as const,
    title: () => "The Comparison",
    storySequence: (data) => getWorldRecordSequence(data.stats.bestPerformance, data.stats.mainDiscipline),
    statReveal: (data) => ({ 
      value: "VS WR", 
      label: "COMPARISON",
      subtext: "See the bars below"
    }),
    background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    emoji: '🏅',
    layout: 'split'
  },
  {
    id: 'victoryrate',
    type: 'victoryrate' as const,
    title: () => "Podium Potential",
    storySequence: (data) => getVictoryRateSequence(data.stats.victoryRate),
    statReveal: (data) => ({ 
      value: `${data.stats.victoryRate}%`, 
      label: "VICTORY RATE" 
    }),
    background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    emoji: '🎯',
    layout: 'split'
  },
  {
    id: 'nemesis',
    type: 'nemesis' as const,
    title: () => "Nemesis Alert",
    storySequence: (data) => getNemesisSequence(data.stats.nemesis),
    statReveal: (data) => ({ 
      value: data.stats.nemesis?.name || "NONE", 
      label: "ARCH RIVAL",
      subtext: data.stats.nemesis ? `${data.stats.nemesis.losses} Losses` : "You are safe... for now"
    }),
    background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
    emoji: '😈',
    layout: 'versus'
  },
  {
    id: 'rivals',
    type: 'rivals' as const,
    title: () => "The Squad",
    storySequence: (data) => getTopRivalsSequence(data.stats.topRivals),
    statReveal: (data) => ({ 
      value: `${data.stats.topRivals.length}`, 
      label: "TOP RIVALS",
      subtext: "Familiar Faces"
    }),
    background: 'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)',
    emoji: '⚔️'
  },
  {
    id: 'wind',
    type: 'wind' as const,
    title: () => "Wind Gods",
    storySequence: (data) => getWindSpeedSequence(data.stats.averageWind, data.stats.hasWindData),
    statReveal: (data) => ({ 
      value: data.stats.averageWind ? `${data.stats.averageWind > 0 ? '+' : ''}${data.stats.averageWind}` : "N/A", 
      label: "AVG WIND (m/s)" 
    }),
    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    emoji: '🌬️'
  },
  {
    id: 'finale',
    type: 'finale',
    title: () => "Wrapped Up",
    storySequence: (data) => getFinaleSequence(data.stats),
    statReveal: (data) => ({ 
      value: "2025", 
      label: "SEASON COMPLETE",
      subtext: "Share your story!"
    }),
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    emoji: '🎊'
  }
]

// Helper function to get all slides with data
export function generateSlides(data: SlideData): SlideConfig[] {
  const nickname = generateNickname(data.stats, data.firstName)
  const dataWithNickname = { ...data, nickname }
  
  return slideTemplates.map(template => ({
    ...template,
    data: dataWithNickname, // Attach data for component usage
    computedTitle: template.title(dataWithNickname),
    computedSequence: template.storySequence(dataWithNickname),
    computedReveal: template.statReveal(dataWithNickname)
  })) as any
}
