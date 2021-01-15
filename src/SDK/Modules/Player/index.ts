import { ZenServer } from "../../"
import { CreatePlayerInput, FiltersPlayer, UpdatePlayerInput } from "../../../Graph/Player/inputs"
import { Pagination } from "../../../MongoDB/Entities"
import { paramsToString } from "../../helpers"

class PlayerServer {
   private _server: ZenServer

   constructor(server: ZenServer) {
      this._server = server
   }

   async create (body: CreatePlayerInput) {
      const query = `
      mutation {
         Player_create(body: ${paramsToString(body)})
      }`
      return this._server.API({ query, name: 'Player_create' })
   }

   async update (body: UpdatePlayerInput) {
      const query = `
      mutation {
         Player_update(body: ${paramsToString(body)})
      }`
      return this._server.API({ query, name: 'Player_update' })
   }


   async delete (_id: string) {
      const query = `
      mutation {
         Player_delete(_id: "${_id}")
      }`
      return this._server.API({ query, name: 'Player_delete' })
   }


   async getList (filters: FiltersPlayer, pagination: Pagination, fields: string) {
      const query = `
      query {
         Player_getList(filters: ${paramsToString(filters)}, pagination: ${paramsToString(pagination)}) ${fields}
      }`
      return this._server.API({ query, name: 'Player_getList' })
   }
}

export default PlayerServer