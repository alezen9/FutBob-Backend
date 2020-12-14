
export const TypePace = `type PlayerScorePace {
    acceleration: Int!,
    sprintSpeed: Int!
}`

export const TypeShooting = `type PlayerScoreShooting {
    positioning: Int!,
    finishing: Int!,
    shotPower: Int!,
    longShots: Int!,
    volleys: Int!,
    penalties: Int!
}`

export const TypePassing = `type PlayerScorePassing {
    vision: Int!,
    crossing: Int!,
    freeKick: Int!,
    shortPassing: Int!,
    longPassing: Int!,
    curve: Int!
}`

export const TypeDribbling = `type PlayerScoreDribbling {
    agility: Int!,
    balance: Int!,
    reactions: Int!,
    ballControl: Int!,
    dribbling: Int!,s
    composure: Int!
}`

export const TypeDefense = `type PlayerScoreDefense {
    interceptions: Int!,
    heading: Int!,
    defensiveAwareness: Int!,
    standingTackle: Int!,
    slidingTackle: Int!
}`

export const TypePhysical = `type PlayerScorePhysical {
    jumping: Int!,
    stamina: Int!,
    strength: Int!,
    aggression: Int!
}`

export const TypeScore = `type PlayerScore {
    pace: PlayerScorePace!,
    shooting: PlayerScoreShooting!,
    passing: PlayerScorePassing!,
    dribbling: PlayerScoreDribbling!,
    defense: PlayerScoreDefense!,
    physical: PlayerScorePhysical!
}`

export const TypePlayer = `type Player {
    _id: String!
    positions: [Int]!,
    type: Int!,
    matches: [Match],
    state: Int,
    user: User!,
    score: PlayerScore!
  }`
