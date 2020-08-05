export const TypeAuthData = `type AuthData {
  token: String!,
  expiresIn: String!
}`

export const TypeUser = `type User {
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
}`

export const TypePlayer = `type Player {
    _id: String!
    positions: [Int]!,
    type: Int!,
    matches: [Match],
    state: Int,
    user: User!
  }`

export const TypeLocation = `type Location {
    type: String!,
    coordinates: [Float!]
  }`

export const TypeMatch = `type Match {
    _id: String!,
    location: Location
    state: Int!
    type: Int!
    ditchedPlayers: [Player]
    confirmedPlayers: MatchPlayer
    notes: String
  }`

export const TypeMatchPlayer = `type MatchPlayer {
    player: Player!
    rating: Int
    goals: Int
  }`

export const TypeSuccessOrFailure = `type SuccessOrFailure {
    errorMessage: String,
    success: Boolean!
  }`
