# TrackWrapped Slides Specification

## INTRO SLIDES

### Slide 1: Hero Introduction
**Title:** "[Athlete Name]'s TrackWrapped is here! 🎉"
**Content:**
- Large athlete name (center, bold)
- Country flag + country name
- Athlete photo if available from API
- Subtitle: "Your 2024 Track & Field Story"
**Design:** Purple/blue gradient, party popper emoji, celebratory vibe
**Goal:** Set the stage, make it personal

---

### Slide 2: The Veteran Status
**Title:** "[X] Years in Track & Field"
**Content:**
- Calculate years from first competition date in API
- Display as large number with calendar icon
- Nickname reveal below: "Meet: [Generated Nickname]"
- Subtitle with humor based on years:
  - 0-2 years: "Fresh legs! The track is your playground 🏃"
  - 3-5 years: "Getting serious! You know your way around a starting block 💪"
  - 6-10 years: "Veteran status unlocked! You've seen enough starting blocks to build a house 🏠"
  - 10+ years: "Track legend! You remember when timing chips were optional ⏱️"
**Design:** Pink gradient, calendar icon
**Data needed:** First competition date from athlete history

---

### Slide 3: Your Domain
**Title:** "Main Event: [Discipline Name]"
**Content:**
- Most competed discipline (calculate from results)
- Large emoji representing event type
- Roast/praise based on event and frequency:
  - 100m: "You're fast... but let's be honest, you haven't run more than 400m at once since PE class 🏃💨"
  - Marathon: "Long distance legend. Your warm-up is longer than most people's races 🏃‍♂️"
  - Shot Put: "Throwing things competitively. Living the dream! 💪"
  - High Jump: "Defying gravity, one bar at a time ⬆️"
**Design:** Blue gradient, runner emoji, event-specific icon
**Data needed:** Count disciplines, pick most frequent

---

## SEASON JOURNEY

### Slide 4: Competition Heatmap
**Title:** "Your 2024 Competition Calendar"
**Content:**
- GitHub-style contribution graph (52 weeks, colored squares)
- Color intensity based on number of competitions per week
- Total count: "[X] Total Competitions"
- Joke based on frequency:
  - 1-5: "Quality over quantity! You're more selective than a Michelin star restaurant ⭐"
  - 6-15: "Solid season! You found the sweet spot between training and competing 👌"
  - 16-30: "Busy athlete! Your calendar looks like Tetris 📅"
  - 30+: "Do you even rest? You basically LIVE at the track ⛺"
**Design:** Orange/yellow gradient, chart emoji
**Data needed:** Competition dates throughout season

---

### Slide 5: Track Tourist
**Title:** "Track Tourist 🌍"
**Content:**
- World map with pins/dots on countries competed in
- List of countries below map
- Count: "Competed in [X] countries"
- Joke:
  - 1 country: "Home sweet home! Local legend status 🏠"
  - 2-3 countries: "International experience unlocked! ✈️"
  - 4-5 countries: "Passport getting full! World traveler vibes 🌍"
  - 6+ countries: "Basically a track nomad. Do you even have a home track? 🗺️"
**Design:** Teal/green gradient, world map visual
**Data needed:** Extract unique countries from competition locations

---

### Slide 6: Personal Best Moment
**Title:** "🎯 PERSONAL BEST UNLOCKED"
**Content:**
- Huge PB time/distance (MASSIVE font)
- Event name
- Date achieved
- Location/competition name
- Celebration: "New PB! That's [X]% improvement from last year!" (if data available)
- Or: "Season best! Keep pushing! 💪"
**Design:** Gold gradient, trophy emoji, confetti effect
**Data needed:** Best result from season for main discipline

---

### Slide 7: Podium Power
**Title:** "[X]% Victory Rate 🏆"
**Content:**
- Calculate percentage of top-3 finishes
- Visual: Progress bar or medal icons
- Total podiums: "[X] Podium Finishes"
- Roast/praise based on percentage:
  - 0-10%: "Participation trophy collector! Everyone starts somewhere 🎖️"
  - 11-30%: "Solid competitor! You're in the mix 💪"
  - 31-50%: "Podium regular! They should reserve a spot for you 🥉"
  - 51-75%: "Podium magnet! You basically live on that box 🥈"
  - 76-100%: "Podium dominator! Are you even human? 🥇"
**Design:** Peach/orange gradient, trophy icon, target emoji
**Data needed:** Count top-3 finishes vs total competitions

---

## THE BATTLE

### Slide 8: Top 3 Rivals
**Title:** "Your Rivalry Squad ⚔️"
**Content:**
- List top 3 athletes competed against most
- For each: Name, country flag, number of meetings
- Format: "1. [Name] 🇸🇮 - Faced 8 times"
- Subtitle: "You've faced these athletes a combined [X] times. It's giving 'anime rivalry arc' energy ⚡"
**Design:** Pink/blue gradient, crossed swords emoji
**Data needed:** Parse competition results, count athlete appearances in same races

---

### Slide 9: Nemesis Alert
**Title:** "⚠️ NEMESIS ALERT"
**Content:**
- Dark/dramatic background (black or dark red)
- Devil emoji 😈
- Athlete who beat them most often
- Head-to-head record: "Lost to [Name] [X] times this season"
- Dramatic text: "[Name]: Your personal villain origin story 🦹"
- Or if tied: "[Name]: The one who keeps you up at night 😤"
**Design:** Dark gradient (black to red), devil emoji, dramatic
**Data needed:** Find athlete who placed ahead of them most frequently

---

### Slide 10: Lane Loyalty
**Title:** "Favorite Lane: Lane [X] 🏃"
**Content:**
- Most assigned lane number
- Track lane visual
- Joke based on lane:
  - Lane 1-2: "Inside lane specialist! You love that tight curve 🔄"
  - Lane 3-4: "The sweet spot! Perfect view of everyone 👀"
  - Lane 5-6: "Outside lane warrior! You get the best view 🌅"
  - Lane 7-8: "Outer lane legend! At least you get space 🏃‍♂️"
- Additional: "You ran from lane [X] [Y] times - it's basically your second home 🏠"
**Design:** Cyan/blue gradient, track lane illustration
**Data needed:** Extract lane assignments from race results if available

---

## WILD CARD SLOTS (Rotate 1-2 based on data)

### Wild Card A: Main Excuse Generator
**Title:** "Your Main Excuse 💬"
**Content:**
- Generate excuse based on athlete data:
  - Age > 26: "'I'm getting old' - Used [X] times this season 👴"
  - Avg wind < -0.5: "'Headwind killed my time' - Classic move 🌬️"
  - Multiple false starts: "'I didn't hear the gun' - Sure you didn't 👂"
  - Outer lanes: "'I got stuck in lane 8 again' 🏃"
- Humorous tone, not mean
**Design:** Light gradient, speech bubble emoji
**Data needed:** Age, wind conditions, lane assignments, false starts

---

### Wild Card B: What If Scenario
**Title:** "What If... 🤔"
**Content:**
- Calculate hypothetical improvement:
  - "What if there was no wind? Your PB would be [adjusted time] ⚡"
  - "What if that last jump counted? You'd be [X]cm closer to the WR 📏"
  - "What if you had lane 4 every race? Probably [X]% faster 🏃"
- Shows potential, keeps it aspirational
**Design:** Purple gradient, thinking emoji
**Data needed:** Wind readings, close attempts, lane performance

---

### Wild Card C: Reaction Time
**Title:** "Reaction Time Check ⚡"
**Content:**
- Average reaction time (if available in sprint events)
- Visual: speedometer or lightning bolt
- Roast/praise:
  - < 0.130s: "You're basically psychic! Are you sure you're not jumping the gun? 🔮"
  - 0.130-0.180s: "Solid reactions! Right in the sweet spot ⚡"
  - > 0.180s: "Taking your time at the blocks, huh? Maybe set an alarm? ⏰"
**Design:** Yellow gradient, lightning emoji
**Data needed:** Reaction times from sprint events

---

### Wild Card D: Weather Warrior
**Title:** "Weather Report 🌤️"
**Content:**
- Average wind conditions across races
- Joke based on wind:
  - Avg > +1.5 m/s: "Wind-assisted legend! You basically flew this season 🪁"
  - Avg -1.0 to +1.0 m/s: "Balanced conditions! Fair weather competitor ☀️"
  - Avg < -1.0 m/s: "Running into walls all season! Character builder 💪🧱"
- Additional: Indoor vs outdoor preference if data shows pattern
**Design:** Light blue/pink gradient, wind emoji
**Data needed:** Wind readings from results

---

## FINALE

### Slide 11: World Record Gap
**Title:** "Famous Athlete Comparison 🥇"
**Content:**
- Compare PB to world record holder in their main event
- Large numbers showing both times/distances
- Visual bar showing the gap
- Humorous take: "Only [X] seconds behind [World Record Holder]! You'll catch them by [year calculated humorously] 🚀"
- Example: "Only 9.2 seconds behind Usain Bolt! See you in 2087! 😅"
- Keep it aspirational but funny
**Design:** Pink/rose gradient, medal emoji
**Data needed:** WR for their discipline, athlete's PB

---

### Slide 12: Season Wrapped Card
**Title:** "The [Generated Nickname]"
**Content:**
- Athlete name + nickname at top
- Party emoji 🎉
- Key stats in clean list:
  - "📅 [X] Total Competitions"
  - "🏃 [X] Races This Season"  
  - "⭐ [X] Average Performance Score" (calculated from placements)
  - "🥇 [X] Podium Finishes"
  - "🌍 [X] Countries Visited"
- Bottom text: "Fresh air enthusiast! You clearly prefer competing under the open sky 🌈" (or similar based on indoor/outdoor preference)
**Design:** Purple/blue gradient, party emoji
**Data needed:** Summary of all key metrics

---

### Slide 13: Share Card (Final)
**Title:** "TrackWrapped 2024"
**Content:**
- TrackWrapped logo/branding
- "Your track & field story, wrapped."
- QR code or URL: "Create yours at trackwrapped.com"
- Social CTAs: "Tag your nemesis 😈" or "Share your wrapped 📱"
- Athlete count: "[X] athletes have checked their wrapped"
**Design:** Dark background, clean branding
**Goal:** Drive traffic, encourage sharing

---

## NICKNAME GENERATION LOGIC

**Formula:** `[Frequency Modifier] + [Event Animal]`

**Frequency Modifiers:**
- 1-5 competitions: "Weekend"
- 6-15 competitions: "Steady"
- 16-30 competitions: "Relentless"
- 30+ competitions: "Iron"

**Event Animals:**
- Sprints (100m, 200m): Cheetah
- Middle Distance (400m-1500m): Gazelle
- Long Distance (5000m+): Camel
- Hurdles: Kangaroo
- Throws: Rhino, Gorilla
- Jumps: Frog, Grasshopper
- Combined Events: Chameleon

**Examples:**
- Weekend Cheetah (sprinter, few comps)
- Relentless Rhino (thrower, many comps)
- Iron Gazelle (middle distance, lots of comps)
- Steady Kangaroo (hurdler, regular season)

---

## TECHNICAL NOTES

**Data Sources:**
- World Athletics API endpoints needed:
  - `/api/results-by-athlete` - main results
  - Individual competition details for reaction times, wind, lanes
  - Athlete profile for age, country

**Calculations:**
- Victory rate: (Top 3 finishes / Total competitions) × 100
- Years competing: Current year - Year of first competition
- Most common discipline: Mode of discipline field
- Rivals: Count unique athlete IDs in same competitions
- Nemesis: Athlete who finished ahead most often

**Missing Data Handling:**
- If no reaction time: skip that wild card
- If only 1 country: adjust joke accordingly
- If no wind data: skip wind slide
- Always have fallback jokes

**Performance:**
- Cache API responses
- Pre-calculate nicknames
- Optimize map rendering