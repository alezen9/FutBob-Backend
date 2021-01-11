export default {
  Query: `
      getFreeAgents (freeAgentFilters: FreeAgentFilters!): ListOfFreeAgent!
   `,
  Mutation: `
      createFreeAgent (createFreeAgentInput: CreateFreeAgentInput!): String!
      updateFreeAgent (updateFreeAgentInput: UpdateFreeAgentInput!): Boolean!
      deleteFreeAgent (_id: String!): Boolean!
   `,
  Subscription: ``
}
