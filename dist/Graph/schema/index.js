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

${inputs_1.SignupInput}
${inputs_1.SigninInput}
${inputs_1.UserInput}

type Query {
  login (signinInput: SigninInput!): AuthData!
  getUserConnected: User!
}
type Mutation {
  signup (signupInput: SignupInput!): AuthData!
  changePassword (oldPassword: String!, newPassword: String!): Boolean!
  changeUsername (newUsername: String!): Boolean!
  updateUserConnected (userInput: UserInput!): Boolean!
}
`);
exports.default = typeDefs;
//# sourceMappingURL=index.js.map