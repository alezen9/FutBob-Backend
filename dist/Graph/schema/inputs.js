"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.CreatePlayerInput = `
input playerData {
  positions: [Int!]!,
  state: Int,
  type: Int!
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
  state: Int
}`;
exports.DeletePlayerInput = `input DeletePlayerInput {
  _id: String!,
  idUser: String!,
  type: Int!
}`;
//# sourceMappingURL=inputs.js.map