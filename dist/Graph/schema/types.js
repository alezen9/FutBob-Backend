"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeSuccessOrFailure = exports.TypeMatchPlayer = exports.TypeMatch = exports.TypeLocation = exports.TypePlayer = exports.TypeScore = exports.TypePhysical = exports.TypeDefense = exports.TypeDribbling = exports.TypePassing = exports.TypeShooting = exports.TypePace = exports.TypeUser = exports.TypeAuthData = void 0;
exports.TypeAuthData = `type AuthData {
  token: String!,
  expiresIn: String!
}`;
exports.TypeUser = `type User {
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
}`;
exports.TypePace = `type PlayerScorePace {
    acceleration: Int!,
    sprintSpeed: Int!
}`;
exports.TypeShooting = `type PlayerScoreShooting {
    positioning: Int!,
    finishing: Int!,
    shotPower: Int!,
    longShots: Int!,
    volleys: Int!,
    penalties: Int!
}`;
exports.TypePassing = `type PlayerScorePassing {
    vision: Int!,
    crossing: Int!,
    freeKick: Int!,
    shortPassing: Int!,
    longPassing: Int!,
    curve: Int!
}`;
exports.TypeDribbling = `type PlayerScoreDribbling {
    agility: Int!,
    balance: Int!,
    reactions: Int!,
    ballControl: Int!,
    dribbling: Int!,
    composure: Int!
}`;
exports.TypeDefense = `type PlayerScoreDefense {
    interceptions: Int!,
    heading: Int!,
    defensiveAwareness: Int!,
    standingTackle: Int!,
    slidingTackle: Int!
}`;
exports.TypePhysical = `type PlayerScorePhysical {
    jumping: Int!,
    stamina: Int!,
    strength: Int!,
    aggression: Int!
}`;
exports.TypeScore = `type PlayerScore {
    pace: PlayerScorePace!,
    shooting: PlayerScoreShooting!,
    passing: PlayerScorePassing!,
    dribbling: PlayerScoreDribbling!,
    defense: PlayerScoreDefense!,
    physical: PlayerScorePhysical!
}`;
exports.TypePlayer = `type Player {
    _id: String!
    positions: [Int]!,
    type: Int!,
    matches: [Match],
    state: Int,
    user: User!,
    score: PlayerScore!
  }`;
exports.TypeLocation = `type Location {
    type: String!,
    coordinates: [Float!]
  }`;
exports.TypeMatch = `type Match {
    _id: String!,
    location: Location
    state: Int!
    type: Int!
    ditchedPlayers: [Player]
    confirmedPlayers: MatchPlayer
    notes: String
  }`;
exports.TypeMatchPlayer = `type MatchPlayer {
    player: Player!
    rating: Int
    goals: Int
  }`;
exports.TypeSuccessOrFailure = `type SuccessOrFailure {
    errorMessage: String,
    success: Boolean!
  }`;
//# sourceMappingURL=types.js.map