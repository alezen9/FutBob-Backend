"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePlayerInput = exports.UpdatePlayerInput = exports.PlayerFilters = exports.CreatePlayerInput = exports.RadarDataInput = exports.UpdateUserInput = exports.UpdateUserConnectedInput = exports.SignupInput = exports.SigninInput = void 0;
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
    username: String!,
    password: String!
  }`;
exports.UpdateUserConnectedInput = `input UpdateUserConnectedInput {
    name: String,
    surname: String,
    dateOfBirth: String,
    phone: String,
    email: String,
    sex: Int
}`;
exports.UpdateUserInput = `input UpdateUserInput {
    _id: String!,
    name: String,
    surname: String,
    dateOfBirth: String,
    phone: String,
    email: String,
    sex: Int
}`;
exports.RadarDataInput = `
input radarData {
  speed: Int!,
  stamina: Int!,
  defence: Int!,
  balance: Int!,
  ballControl: Int!,
  passing: Int!,
  finishing: Int!
}`;
exports.CreatePlayerInput = `
input playerData {
  positions: [Int!]!,
  state: Int,
  type: Int!,
  radarData: radarData!
}

input userData {
  name: String!,
  surname: String!,
  dateOfBirth: String!,
  phone: String!,
  email: String,
  sex: Int!
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
  radarData: radarData
}`;
exports.DeletePlayerInput = `input DeletePlayerInput {
  _id: String!,
  idUser: String!,
  type: Int!
}`;
//# sourceMappingURL=inputs.js.map