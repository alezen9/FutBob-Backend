"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePlayerInput = exports.UpdatePlayerInput = exports.PlayerFilters = exports.CreatePlayerInput = exports.PlayerScoreInput = exports.UpdateUserInput = exports.UpdateUserConnectedInput = exports.SignupInput = exports.SigninInput = void 0;
exports.SigninInput = `input SigninInput {
    username: String!,
    password: String!
  }`;
exports.SignupInput = `input SignupInput {
    name: String!,
    surname: String!,
    dateOfBirth: String!,
    phone: String!,
    email: String,
    sex: Int!,
    country: String!,
    username: String!,
    password: String!
  }`;
exports.UpdateUserConnectedInput = `input UpdateUserConnectedInput {
    name: String,
    surname: String,
    dateOfBirth: String,
    phone: String,
    email: String,
    sex: Int,
    country: String
}`;
exports.UpdateUserInput = `input UpdateUserInput {
    _id: String!,
    name: String,
    surname: String,
    dateOfBirth: String,
    phone: String,
    email: String,
    sex: Int,
    country: String
}`;
exports.PlayerScoreInput = `
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
}`;
exports.CreatePlayerInput = `
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
}`;
exports.PlayerFilters = `input PlayerFilters {
  ids: [String],
  position: Int,
  type: Int,
  matchId: String,
  state: Int
}`;
exports.UpdatePlayerInput = `input UpdatePlayerInput {
  _id: String!,
  positions: [Int],
  state: Int,
  score: PlayerScoreDataInput
}`;
exports.DeletePlayerInput = `input DeletePlayerInput {
  _id: String!,
  idUser: String!,
  type: Int!
}`;
//# sourceMappingURL=inputs.js.map