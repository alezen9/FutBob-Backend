export default {
  Query: `
      getPlayers (playerFilters: PlayerFilters!): ListOfPlayer!
   `,
  Mutation: `
      createPlayer (createPlayerInput: CreatePlayerInput!): String!
      updatePlayer (updatePlayerInput: UpdatePlayerInput!): Boolean!
      deletePlayer (deletePlayerInput: DeletePlayerInput!): Boolean!
   `,
  Subscription: ``
}
