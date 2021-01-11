export default {
  Query: `
      login (signinInput: SigninInput!): AuthData!
   `,
  Mutation: `
      signup (signupInput: SignupInput!): AuthData!
   `,
  Subscription: ``
}
