import {
  TypeAuthData,
  TypeUser,
  TypePlayer,
  TypeLocation,
  TypeMatch,
  TypeMatchPlayer,
  TypeSuccessOrFailure,
  TypePace,
  TypeShooting,
  TypePassing,
  TypeDribbling,
  TypeDefense,
  TypePhysical,
  TypeScore,
  TypeListOf
} from './types'
import {
  SigninInput,
  SignupInput,
  UpdateUserConnectedInput,
  UpdateUserInput,
  CreatePlayerInput,
  UpdatePlayerInput,
  PlayerFilters,
  DeletePlayerInput,
  PlayerScoreInput,
  PaginationInput
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
${TypePace}
${TypeShooting}
${TypePassing}
${TypeDribbling}
${TypeDefense}
${TypePhysical}
${TypeScore}
${TypeListOf('Player')}

${PaginationInput}
${SignupInput}
${SigninInput}
${UpdateUserConnectedInput}
${UpdateUserInput}
${CreatePlayerInput}
${UpdatePlayerInput}
${DeletePlayerInput}
${PlayerScoreInput}
${PlayerFilters}

type Query {
  login (signinInput: SigninInput!): AuthData!
  getUserConnected: User!
  getPlayers (playerFilters: PlayerFilters!): ListOfPlayer!
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
