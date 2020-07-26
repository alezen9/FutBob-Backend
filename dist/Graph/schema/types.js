"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeSuccessOrFailure = exports.TypeMatchPlayer = exports.TypeMatch = exports.TypeLocation = exports.TypePlayer = exports.TypeUser = exports.TypeAuthData = void 0;
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
    username: String!,
    futsalPlayer: Player,
    footballPlayer: Player,
    avatar: String
}`;
exports.TypePlayer = `type Player {
    _id: String!
    positions: Int!,
    type: Int!,
    matches: [Match],
    state: Int
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