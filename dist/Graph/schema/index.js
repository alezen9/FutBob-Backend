"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const inputs_1 = require("./inputs");
const apollo_server_1 = require("apollo-server");
const typeDefs = apollo_server_1.gql(`
${types_1.TypeAuthData}
${types_1.TypeUser}
${types_1.TypePlayer}
${types_1.TypeLocation}
${types_1.TypeMatch}
${types_1.TypeMatchPlayer}
${types_1.TypeSuccessOrFailure}
${types_1.TypePace}
${types_1.TypeShooting}
${types_1.TypePassing}
${types_1.TypeDribbling}
${types_1.TypeDefense}
${types_1.TypePhysical}
${types_1.TypeScore}

${inputs_1.SignupInput}
${inputs_1.SigninInput}
${inputs_1.UpdateUserConnectedInput}
${inputs_1.UpdateUserInput}
${inputs_1.CreatePlayerInput}
${inputs_1.UpdatePlayerInput}
${inputs_1.DeletePlayerInput}
${inputs_1.PlayerScoreInput}
${inputs_1.PlayerFilters}

type Query {
  login (signinInput: SigninInput!): AuthData!
  getUserConnected: User!
  getPlayers (playerFilters: PlayerFilters!): [Player]!
}
type Mutation {
  signup (signupInput: SignupInput!): AuthData!
  changePassword (oldPassword: String!, newPassword: String!): Boolean!
  changeUsername (newUsername: String!): Boolean!
  updateUserConnected (userInput: UpdateUserConnectedInput!): Boolean!,
  updateUser (userInput: UpdateUserInput!): Boolean!,

  createPlayer (createPlayerInput: CreatePlayerInput!): String!
  updatePlayer (updatePlayerInput: UpdatePlayerInput!): Boolean!
  deletePlayer (deletePlayerInput: DeletePlayerInput!): Boolean!
}
`);
exports.default = typeDefs;
//# sourceMappingURL=index.js.map