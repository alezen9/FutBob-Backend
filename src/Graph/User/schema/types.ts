export default `
    type User {
        _id: String!,
        name: String!,
        surname: String!,
        dateOfBirth: String!,
        phone: String!,
        email: String,
        sex: Int!,
        country: String!,
        username: String!,
        futsalPlayer: Player,
        footballPlayer: Player,
        avatar: String
    }
`
