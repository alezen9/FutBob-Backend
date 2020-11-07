import {
  TypeAuthData,
  TypeUser,
  TypePlayer,
  TypeGeoPoint,
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
  TypeListOf,
  TypeField,
  TypeMeasurements
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
  PaginationInput,
  CreateFieldInput,
  UpdateFieldInput,
  DeleteFieldInput,
  FieldsFilters
} from './inputs'
import { gql } from 'apollo-server'

const typeDefs = gql(`
${TypeAuthData}
${TypeUser}
${TypePlayer}
${TypeGeoPoint}
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
${TypeField}
${TypeMeasurements}
${TypeListOf('Player')}
${TypeListOf('Field')}


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
${CreateFieldInput}
${UpdateFieldInput}
${DeleteFieldInput}
${FieldsFilters}


type Query {
  login (signinInput: SigninInput!): AuthData!
  getUserConnected: User!
  getPlayers (playerFilters: PlayerFilters!): ListOfPlayer!
  getFields (fieldsFilters: FieldsFilters!): ListOfField!
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

  createField (createFieldInput: CreateFieldInput!): String!
  updateField (updateFieldInput: UpdateFieldInput!): Boolean!
  deleteField (deleteFieldInput: DeleteFieldInput!): Boolean!
}
`)

export default typeDefs
