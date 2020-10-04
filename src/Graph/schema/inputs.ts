export const SigninInput = `input SigninInput {
    username: String!,
    password: String!
  }`

export const SignupInput = `input SignupInput {
    name: String!,
    surname: String!,
    dateOfBirth: String!,
    phone: String!,
    email: String,
    sex: Int!,
    country: String!,
    username: String!,
    password: String!
  }`

export const UpdateUserConnectedInput = `input UpdateUserConnectedInput {
    name: String,
    surname: String,
    dateOfBirth: String,
    phone: String,
    email: String,
    sex: Int,
    country: String
}`

export const UpdateUserInput = `input UpdateUserInput {
    _id: String!,
    name: String,
    surname: String,
    dateOfBirth: String,
    phone: String,
    email: String,
    sex: Int,
    country: String
}`

export const PlayerScoreInput = `
input PlayerScorePaceInput {
    acceleration: Int!,
    sprintSpeed: Int!
}

input PlayerScoreShootingInput {
    positioning: Int!,
    finishing: Int!,
    shotPower: Int!,
    longShots: Int!,
    volleys: Int!,
    penalties: Int!
}

input PlayerScorePassingInput {
    vision: Int!,
    crossing: Int!,
    freeKick: Int!,
    shortPassing: Int!,
    longPassing: Int!,
    curve: Int!
}

input PlayerScoreDribblingInput {
    agility: Int!,
    balance: Int!,
    reactions: Int!,
    ballControl: Int!,
    dribbling: Int!,
    composure: Int!
}

input PlayerScoreDefenseInput {
    interceptions: Int!,
    heading: Int!,
    defensiveAwareness: Int!,
    standingTackle: Int!,
    slidingTackle: Int!
}

input PlayerScorePhysicalInput {
    jumping: Int!,
    stamina: Int!,
    strength: Int!,
    aggression: Int!
}

input PlayerScoreDataInput {
  pace: PlayerScorePaceInput!,
  shooting: PlayerScoreShootingInput!,
  passing: PlayerScorePassingInput!,
  dribbling: PlayerScoreDribblingInput!,
  defense: PlayerScoreDefenseInput!,
  physical: PlayerScorePhysicalInput!
}`

export const CreatePlayerInput = `
input playerData {
  positions: [Int!]!,
  state: Int,
  type: Int!,
  score: PlayerScoreDataInput!
}

input userData {
  name: String!,
  surname: String!,
  dateOfBirth: String!,
  phone: String!,
  email: String,
  sex: Int!,
  country: String!
}

input CreatePlayerInput {
  userId: String,
  userData: userData,
  playerData: playerData!
}`

export const PaginationInput = `input PaginationInput {
  skip: Int,
  limit: Int
}`

export const PlayerFilters = `input PlayerFilters {
  ids: [String],
  positions: [Int],
  type: Int,
  matchIds: [String],
  states: [Int],
  countries: [String],
  searchText: String,
  pagination: PaginationInput
}`

export const UpdatePlayerInput = `input UpdatePlayerInput {
  _id: String!,
  positions: [Int],
  state: Int,
  score: PlayerScoreDataInput
}`

export const DeletePlayerInput = `input DeletePlayerInput {
  _id: String!,
  idUser: String!,
  type: Int!
}`
