import { ZenServer } from "../../"
import { paramsToString } from "../../helpers"
import { CreatePlayerInputWithUser, CreatePlayerInputWithId, DeletePlayerInput, PlayerFilters, UpdatePlayerInfoInput } from "./types"

class PlayerServer {
   private _server: ZenServer

   constructor(server: ZenServer) {
      this._server = server
   }

   async create (createPlayerInput: CreatePlayerInputWithUser|CreatePlayerInputWithId) {
      const query = `
      mutation {
         createPlayer(createPlayerInput: ${paramsToString(createPlayerInput)})
      }`
      return this._server.API({ query, name: 'createPlayer' })
   }

   async update (updatePlayerInput: UpdatePlayerInfoInput) {
      const query = `
      mutation {
         updatePlayer(updatePlayerInput: ${paramsToString(updatePlayerInput)})
      }`
      return this._server.API({ query, name: 'updatePlayer' })
   }


   async delete (deletePlayerInput: DeletePlayerInput) {
      const query = `
      mutation {
         deletePlayer(deletePlayerInput: ${paramsToString(deletePlayerInput)})
      }`
      return this._server.API({ query, name: 'deletePlayer' })
   }


   async getList (playerFilters: PlayerFilters, fields: string) {
      const query = `
      query {
         getPlayers(playerFilters: ${paramsToString(playerFilters)}) ${fields}
      }`
      return this._server.API({ query, name: 'getPlayers' })
   }
}

export default PlayerServer