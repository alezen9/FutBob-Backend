export const TypeAuthData = `type AuthData {
  token: String!,
  expiresIn: String!
}`

export const TypeUser = `type User {
    _id: String!,
    name: String!,
    surname: String!,
    dateOfBirth: String!,
    phone: String!,
    email: String,
    sex: Int!,
    country: String!,
    username: String!,
    futsalPlayer: Player,
    footballPlayer: Player,
    avatar: String
}`

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
    dribbling: Int!,
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

export const TypeGeoPoint = `type GeoPoint {
    type: String!,
    coordinates: [Float!]
  }`

export const TypeMeasurements = `type Measurements {
    width: Float!,
    height: Float!
  }`

export const TypeField = `type Field {
    _id: String!
    type: Int!,
    name: String!,
    measurements: Measurements!,
    state: Int!,
    price: Int!,
    location: GeoPoint!
  }`

export const TypeMatch = `type Match {
    _id: String!,
    location: GeoPoint
    state: Int!
    type: Int!
    ditchedPlayers: [Player]
    confirmedPlayers: MatchPlayer
    notes: String
  }`

export const TypeMatchPlayer = `type MatchPlayer {
    player: Player!
    rating: Int
    goals: Int
  }`

export const TypeSuccessOrFailure = `type SuccessOrFailure {
    errorMessage: String,
    success: Boolean!
  }`

export const TypeListOf = (type: string) => `type ListOf${type} {
  totalCount: Int!,
  result: [${type}]
}`
