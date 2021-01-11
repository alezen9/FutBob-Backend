export default `
  input PlayerScorePaceInput {
    speed: Int!,
    stamina: Int!
  }

  input PlayerScoreShootingInput {
    finishing: Int!,
    shotPower: Int!,
    longShots: Int!
  }

  input PlayerScorePassingInput {
    vision: Int!,
    shortPassing: Int!,
    longPassing: Int!
  }

  input PlayerScoreTechniqueInput {
    agility: Int!,
    ballControl: Int!,
    dribbling: Int!
  }

  input PlayerScoreDefenseInput {
    defensiveAwareness: Int!,
    interception: Int!,
    versus: Int!
  }

  input PlayerScorePhysicalInput {
    strength: Int!
  }

  input PlayerScoreDataInput {
    pace: PlayerScorePaceInput!,
    shooting: PlayerScoreShootingInput!,
    passing: PlayerScorePassingInput!,
    technique: PlayerScoreTechniqueInput!,
    defense: PlayerScoreDefenseInput!,
    physical: PlayerScorePhysicalInput!
  }

  input playerData {
    positions: [Int!]!,
    state: Int,
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
  }

  input PlayerFilters {
    ids: [String],
    positions: [Int],
    states: [Int],
    countries: [String],
    searchText: String,
    pagination: PaginationInput
  }

  input UpdatePlayerInput {
    _id: String!,
    positions: [Int],
    state: Int,
    score: PlayerScoreDataInput
  }

  input DeletePlayerInput {
    _id: String!,
    idUser: String!
  }
`
