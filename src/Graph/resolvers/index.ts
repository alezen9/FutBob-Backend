import userResolver from './user'
import authResolver from './auth'

const resolvers = {
  Query: {
    // ...userResolver.Query
    ...authResolver.Query
  },
  Mutation: {
    ...authResolver.Mutation
    // ...parkingsResolver.Mutation,
    // ...bookingResolver.Mutation,
    // ...userResolver.Mutation,
    // ...carResolver.Mutation
  }
  // Subscription: {
  //   ...authResolver.Subscription,
  //   ...parkingsResolver.Subscription
  // }
}

export default resolvers
