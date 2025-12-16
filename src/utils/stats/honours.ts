import type { AthleteDetails } from '@/types/athleteDetails'

export function calculateHonoursAndRecords(details: AthleteDetails) {
  // Calculate Honours
  const honoursMap = new Map<string, number>()
  const recentHonours: Array<{ category: string; place: number; competition: string }> = []
  const currentYear = new Date().getFullYear()
  
  if (details.honours) {
    details.honours.forEach((h: any) => {
      const category = h.category
      const winCount = h.results.filter((r: any) => r.place === 1).length
      const medalCount = h.results.filter((r: any) => r.place <= 3).length
      
      if (medalCount > 0) {
        const current = honoursMap.get(category) || 0
        honoursMap.set(category, current + medalCount)
      }

      // Check for recent honours (this year)
      h.results.forEach((r: any) => {
        const rYear = new Date(r.date).getFullYear()
        if (rYear === currentYear && r.place <= 3) {
          recentHonours.push({
            category: category,
            place: r.place,
            competition: r.competition || category // Fallback to category if competition name missing
          })
        }
      })
    })
  }

  const honours = Array.from(honoursMap.entries()).map(([category, count]) => ({
    category,
    count
  })).sort((a, b) => b.count - a.count)

  // Calculate Records
  let nr = 0
  let wr = 0
  let other = 0

  // Check both PB and SB for records
  const checkRecords = (list: any[]) => {
    if (!list) return
    list.forEach(item => {
      if (item.records && item.records.length > 0) {
        item.records.forEach((r: string) => {
          if (r === 'WR') wr++
          else if (r === 'NR') nr++
          else other++
        })
      }
    })
  }

  checkRecords(details.personalbests)
  checkRecords(details.seasonsbests)

  return {
    honours,
    recentHonours,
    records: { nr, wr, other }
  }
}
