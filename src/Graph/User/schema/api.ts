export default {
  Query: `
    getUserConnected: User!
  `,
  Mutation: `
    changePassword (oldPassword: String!, newPassword: String!): Boolean!
    changeUsername (newUsername: String!): Boolean!
    updateUserConnected (userInput: UpdateUserConnectedInput!): Boolean!
    updateUser (userInput: UpdateUserInput!): Boolean!
   `,
  Subscription: ``
}
