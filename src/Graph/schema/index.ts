import {
  TypeAuthData,
  TypeUser,
  TypePlayer,
  TypeLocation,
  TypeMatch,
  TypeMatchPlayer,
  TypeSuccessOrFailure
} from './types'
import {
  SigninInput,
  SignupInput,
  UpdateUserConnectedInput,
  UpdateUserInput,
  CreatePlayerInput,
  UpdatePlayerInput,
  PlayerFilters,
  DeletePlayerInput
} from './inputs'
import { gql } from 'apollo-server'

const typeDefs = gql(`
${TypeAuthData}
${TypeUser}
${TypePlayer}
${TypeLocation}
${TypeMatch}
${TypeMatchPlayer}
${TypeSuccessOrFailure}

${SignupInput}
${SigninInput}
${UpdateUserConnectedInput}
${UpdateUserInput}
${CreatePlayerInput}
${UpdatePlayerInput}
${DeletePlayerInput}

${PlayerFilters}

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
`)

export default typeDefs
