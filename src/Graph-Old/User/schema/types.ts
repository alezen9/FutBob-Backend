export default `
    type Registry {
        name: String!,
        surname: String!,
        dateOfBirth: String!,
        phone: String!,
        email: String,
        sex: Int!,
        country: String!,
    }
    
    type User {
        _id: String!,
        registry: Registry!
        username: String!,
        player: Player
    }
`
