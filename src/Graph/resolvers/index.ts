import authResolver from './auth'
import userResolver from './user'
import playerResolver from './player'
import fieldsResolver from './fields'

const resolvers = {
  Query: {
    ...authResolver.Query,
    ...userResolver.Query,
    ...playerResolver.Query,
    ...fieldsResolver.Query
  },
  Mutation: {
    ...authResolver.Mutation,
    ...userResolver.Mutation,
    ...playerResolver.Mutation,
    ...fieldsResolver.Mutation
  }
  // Subscription: {
  //   ...authResolver.Subscription,
  //   ...parkingsResolver.Subscription
  // }
}

export default resolvers
