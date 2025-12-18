export function getDisciplineEmoji(discipline: string): string {
  const d = discipline.toLowerCase().trim()
  
  // Sprints
  if (d.includes('60m') && !d.includes('hurdle')) return '⚡'
  if (d === '100m' || d === '200m' || d === '400m') return '⚡'
  if (d.includes('relay') || d.includes('4x')) return '🤝'
  
  // Hurdles
  if (d.includes('hurdle') || d.includes('mh')) return '🚧'
  if (d.includes('steeplechase') || d.includes('sc')) return '🌊'
  
  // Middle Distance
  if (d === '800m' || d === '1500m' || d === 'mile') return '🦁'
  
  // Long Distance
  if (d === '3000m' || d === '5000m' || d === '10000m') return '🏃'
  if (d.includes('marathon') || d.includes('road')) return '🛣️'
  if (d.includes('cross')) return '🌲'
  
  // Jumps
  if (d.includes('high jump')) return '🦅'
  if (d.includes('pole vault')) return '🚀'
  if (d.includes('long jump')) return '🦘'
  if (d.includes('triple jump')) return '🐇'
  
  // Throws
  if (d.includes('shot put')) return '💣'
  if (d.includes('discus')) return '🛸'
  if (d.includes('hammer')) return '🔨'
  if (d.includes('javelin')) return '🔱'
  
  // Combined
  if (d.includes('decathlon') || d.includes('heptathlon') || d.includes('pentathlon')) return '👑'
  
  // Walk
  if (d.includes('walk')) return '🚶'

  return '👟' // Default
}
