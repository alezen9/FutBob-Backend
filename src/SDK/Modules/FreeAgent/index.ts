import { ZenServer } from "../../"
import { paramsToString } from "../../helpers"
import { CreateFreeAgentInput, FreeAgentFilters, UpdateFreeAgentInput } from "./types"

class FreeAgentServer {
   private _server: ZenServer

   constructor(server: ZenServer) {
      this._server = server
   }

   async create(createFreeAgentInput: CreateFreeAgentInput): Promise<any> {
      const query = `
      mutation {
         createFreeAgent(createFreeAgentInput: ${paramsToString(createFreeAgentInput)})
      }`
      return this._server.API({ query, name: 'createFreeAgent' })
   }

   async update(updateFreeAgentInput: UpdateFreeAgentInput): Promise<any> {
      const query = `
      mutation {
         updateFreeAgent(updateFreeAgentInput: ${paramsToString(updateFreeAgentInput)})
      }`
      return this._server.API({ query, name: 'updateFreeAgent' })
   }

   async delete(_id: string): Promise<any> {
      const query = `
      mutation {
         deleteFreeAgent(_id: "${_id}")
      }`
      return this._server.API({ query, name: 'deleteFreeAgent' })
   }

  async getList(freeAgentFilters: FreeAgentFilters, fields: string): Promise<any> {
      const query = `
         query {
            getFreeAgents(freeAgentFilters: ${paramsToString(freeAgentFilters)}) ${fields}
         }`
      return this._server.API({ query, name: 'getFreeAgents' })
   }
}

export default FreeAgentServer