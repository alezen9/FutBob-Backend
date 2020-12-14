export default `
  input SigninInput {
    username: String!,
    password: String!
  }

  input SignupInput {
    name: String!,
    surname: String!,
    dateOfBirth: String!,
    phone: String!,
    email: String,
    sex: Int!,
    country: String!,
    username: String!,
    password: String!
  }
  
`
