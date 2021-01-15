import { ZenServer } from "../../"
import { CreateFreeAgentInput, FiltersFreeAgent, UpdateFreeAgentInput } from "../../../Graph/FreeAgent/inputs"
import { Pagination } from "../../../MongoDB/Entities"
import { paramsToString } from "../../helpers"

class FreeAgentServer {
   private _server: ZenServer

   constructor(server: ZenServer) {
      this._server = server
   }

   async create(body: CreateFreeAgentInput): Promise<any> {
      const query = `
      mutation {
         FreeAgent_create(body: ${paramsToString(body)})
      }`
      return this._server.API({ query, name: 'FreeAgent_create' })
   }

   async update(body: UpdateFreeAgentInput): Promise<any> {
      const query = `
      mutation {
         FreeAgent_update(body: ${paramsToString(body)})
      }`
      return this._server.API({ query, name: 'FreeAgent_update' })
   }

   async delete(_id: string): Promise<any> {
      const query = `
      mutation {
         FreeAgent_delete(_id: "${_id}")
      }`
      return this._server.API({ query, name: 'FreeAgent_delete' })
   }

  async getList(filters: FiltersFreeAgent, pagination: Pagination, fields: string): Promise<any> {
      const query = `
         query {
            FreeAgent_getList(filters: ${paramsToString(filters)}, pagination: ${paramsToString(pagination)}) ${fields}
         }`
      return this._server.API({ query, name: 'FreeAgent_getList' })
   }
}

export default FreeAgentServer