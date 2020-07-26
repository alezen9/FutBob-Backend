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
  UserInput
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
${UserInput}

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
`)

export default typeDefs
