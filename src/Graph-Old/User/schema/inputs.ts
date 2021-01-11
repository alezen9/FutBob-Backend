export default `
    input UpdateUserConnectedInput {
        name: String,
        surname: String,
        dateOfBirth: String,
        phone: String,
        email: String,
        sex: Int,
        country: String
    }

    input UpdateUserInput {
        _id: String!,
        name: String,
        surname: String,
        dateOfBirth: String,
        phone: String,
        email: String,
        sex: Int,
        country: String
    }
`
