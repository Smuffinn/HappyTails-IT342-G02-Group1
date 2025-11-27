export const QUIZ_CATEGORIES = {
  activeDog: {
    id: 'activeDog',
    title: 'Adventure Buddy (Active Dog)',
    description:
      'You thrive on movement and outdoor fun and have time for structured care. Athletic dogs that enjoy hikes, beach runs, training games, and consistent routines will keep up with your energy.',
    highlights: [
      'Enjoys daily exercise and outdoor adventures',
      'Great for active households that love the outdoors',
      'Needs daily training touchpoints, grooming, and downtime care',
    ],
    suggestedFilters: {
      species: 'Dog',
      size: 'large',
      temperament: 'Active',
    },
  },
  calmCat: {
    id: 'calmCat',
    title: 'Cozy Companion (Calm Cat)',
    description:
      'Peaceful evenings and quiet company are your style. Relaxed cats who love window watching, gentle affection, and cozy spaces will fit right in.',
    highlights: [
      'Independent but enjoys gentle companionship',
      'Prefers calm environments and predictable routines',
      'Low-maintenance grooming and exercise needs',
    ],
    suggestedFilters: {
      species: 'Cat',
      temperament: 'Calm',
    },
  },
  playfulFriend: {
    id: 'playfulFriend',
    title: 'Playmate Pro (Social Buddy)',
    description:
      'Your home is the heart of the party. Sociable pets who adore playdates, squeaky toys, and interactive games will love your energy.',
    highlights: [
      'Great for families with kids or multiple caretakers',
      'Responds well to enrichment puzzles and playtime',
      'Eager to learn tricks and join in daily activities',
    ],
    suggestedFilters: {
      species: 'Dog',
      size: 'medium',
      temperament: 'Friendly',
    },
  },
  gentleSenior: {
    id: 'gentleSenior',
    title: 'Heartful Guardian (Senior Sweetheart)',
    description:
      'You value patience, presence, and a nurturing home. Mature pets who appreciate slow walks, comfy beds, and lots of love will flourish with you.',
    highlights: [
      'Ideal for adopters who enjoy quiet routines',
      'Typically house-trained and manners-ready',
      'Appreciates short strolls and soft bedding',
    ],
    suggestedFilters: {
      minAgeLabel: '7',
      temperament: 'Gentle',
    },
  },
  pocketPal: {
    id: 'pocketPal',
    title: 'Pocket Pal (Small & Special)',
    description:
      'You cherish mindful care and can dedicate generous space for habitats. Small pets—rabbits, guinea pigs, or special species—need roomy exercise pens, daily enclosure cleaning, and gentle handling to thrive with you.',
    highlights: [
      'Requires a roomy enclosure or supervised free-roam zone',
      'Needs daily enclosure refreshes and enrichment setups',
      'Responds to gentle handling and quiet routines',
    ],
    suggestedFilters: {
      size: 'small',
    },
  },
}

export const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    prompt: 'How would you describe your typical weekend?',
    options: [
      {
        value: 'hike',
        label: 'Out early for hikes, markets, and meet-ups',
        scores: { activeDog: 3, playfulFriend: 1 },
      },
      {
        value: 'home',
        label: 'Cozy at home with a book or series marathon',
        scores: { calmCat: 3, gentleSenior: 1 },
      },
      {
        value: 'family',
        label: 'Hosting friends or playing with kids',
        scores: { playfulFriend: 3 },
      },
      {
        value: 'craft',
        label: 'Enjoying quiet hobbies or caring projects indoors',
        scores: { pocketPal: 2, gentleSenior: 1 },
      },
    ],
  },
  {
    id: 'q2',
    prompt: 'How much daily time can you dedicate to exercise or play?',
    options: [
      {
        value: '90',
        label: '90 minutes or more – bring on the adventure!',
        scores: { activeDog: 3 },
      },
      {
        value: '60',
        label: 'About an hour – consistent and active',
        scores: { playfulFriend: 2, activeDog: 1 },
      },
      {
        value: '30',
        label: '30 minutes – a calm stroll or gentle play',
        scores: { calmCat: 2, gentleSenior: 1 },
      },
      {
        value: 'short',
        label: 'Short sessions sprinkled throughout the day',
        scores: { pocketPal: 2, gentleSenior: 1 },
      },
    ],
  },
  {
    id: 'q3',
    prompt: 'What kind of space can you offer for a pet to safely explore?',
    options: [
      {
        value: 'yard',
        label: 'Detached home with a fenced yard or large outdoor zone',
        scores: { activeDog: 3, playfulFriend: 1 },
      },
      {
        value: 'dedicatedRoom',
        label: 'Indoor home with a dedicated pet-safe room or exercise pen',
        scores: { pocketPal: 3, calmCat: 1 },
      },
      {
        value: 'shared',
        label: 'Apartment or condo with nearby parks and enrichment corners',
        scores: { calmCat: 2, playfulFriend: 1 },
      },
      {
        value: 'cozyShared',
        label: 'Cozy shared space or studio set up for quiet living',
        scores: { gentleSenior: 2, pocketPal: 1 },
      },
    ],
  },
  {
    id: 'q4',
    prompt: 'How comfortable are you with daily care routines (feeding, cleaning, training)?',
    options: [
      {
        value: 'structuredCare',
        label: 'Daily training, exercise, and detailed care fit easily into my schedule.',
        scores: { activeDog: 2, playfulFriend: 1, pocketPal: 1 },
      },
      {
        value: 'consistentCare',
        label: 'I can commit to daily feeding, litter/yard tidy-ups, and regular grooming.',
        scores: { calmCat: 2, gentleSenior: 1, pocketPal: 1 },
      },
      {
        value: 'supportCare',
        label: 'Light daily tasks are fine, with deeper cleans scheduled weekly.',
        scores: { gentleSenior: 2, calmCat: 1 },
      },
      {
        value: 'minimalCare',
        label: 'I need a very low-maintenance companion.',
        scores: { calmCat: 1 },
      },
    ],
  },
  {
    id: 'q5',
    prompt: 'What best describes your ideal pet’s energy?',
    options: [
      {
        value: 'high',
        label: 'High energy – let’s go, go, go!',
        scores: { activeDog: 3 },
      },
      {
        value: 'medium',
        label: 'Medium – playful bursts with cuddle breaks',
        scores: { playfulFriend: 2, activeDog: 1 },
      },
      {
        value: 'low',
        label: 'Low – calm company and gentle strolls',
        scores: { calmCat: 1, gentleSenior: 2 },
      },
      {
        value: 'varied',
        label: 'Varied – happy with short, engaging sessions',
        scores: { pocketPal: 2 },
      },
    ],
  },
]

export function tallyQuizScores(answers) {
  const totals = Object.keys(QUIZ_CATEGORIES).reduce((acc, key) => {
    acc[key] = 0
    return acc
  }, {})

  answers.forEach((answer) => {
    if (!answer?.scores) return
    Object.entries(answer.scores).forEach(([category, value]) => {
      totals[category] = (totals[category] || 0) + value
    })
  })

  return totals
}

export function getTopCategories(totals) {
  const entries = Object.entries(totals || {})
  if (!entries.length) return []

  const highest = Math.max(...entries.map(([, value]) => value))
  if (!Number.isFinite(highest)) return []

  return entries
    .filter(([, value]) => value === highest)
    .map(([category]) => QUIZ_CATEGORIES[category])
    .filter(Boolean)
}
