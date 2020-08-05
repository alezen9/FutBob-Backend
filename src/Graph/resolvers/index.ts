import authResolver from './auth'
import userResolver from './user'
import playerResolver from './player'

const resolvers = {
  Query: {
    ...authResolver.Query,
    ...userResolver.Query,
    ...playerResolver.Query
  },
  Mutation: {
    ...authResolver.Mutation,
    ...userResolver.Mutation,
    ...playerResolver.Mutation
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
