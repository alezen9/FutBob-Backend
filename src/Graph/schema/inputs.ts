export const SigninInput = `input SigninInput {
    username: String!,
    password: String!
  }`

export const SignupInput = `input SignupInput {
    name: String!,
    surname: String!,
    dateOfBirth: String!,
    phone: String!,
    email: String,
    sex: Int!,
    username: String!,
    password: String!
  }`

export const UpdateUserConnectedInput = `input UpdateUserConnectedInput {
    name: String,
    surname: String,
    dateOfBirth: String,
    phone: String,
    email: String,
    sex: Int
}`

export const UpdateUserInput = `input UpdateUserInput {
    _id: String!,
    name: String,
    surname: String,
    dateOfBirth: String,
    phone: String,
    email: String,
    sex: Int
}`

export const CreatePlayerInput = `
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
}`

export const PlayerFilters = `input PlayerFilters {
  ids: [String],
  position: Int,
  type: Int,
  matchId: String,
  state: Int
}`

export const UpdatePlayerInput = `input UpdatePlayerInput {
  _id: String!,
  positions: [Int],
  state: Int
}`

export const DeletePlayerInput = `input DeletePlayerInput {
  _id: String!,
  idUser: String!,
  type: Int!
}`
