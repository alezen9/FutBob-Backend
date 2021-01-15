import { ZenServer } from "../../"
import { CreateFieldInput, FiltersField, UpdateFieldInput } from "../../../Graph/Field/inputs"
import { Pagination } from "../../../MongoDB/Entities"
import { paramsToString } from "../../helpers"

class FieldServer {
   private _server: ZenServer

   constructor(server: ZenServer) {
      this._server = server
   }

   async create(body: CreateFieldInput): Promise<any> {
      const query = `
      mutation {
         Field_create(body: ${paramsToString(body)})
      }`
      return this._server.API({ query, name: 'Field_create' })
   }

   async update(body: UpdateFieldInput): Promise<any> {
      const query = `
      mutation {
         Field_update(body: ${paramsToString(body)})
      }`
      return this._server.API({ query, name: 'Field_update' })
   }

   async delete(_id: string): Promise<any> {
      const query = `
      mutation {
         Field_delete(_id: "${_id}")
      }`
      return this._server.API({ query, name: 'Field_delete' })
   }

   async getList(filters: FiltersField, pagination: Pagination, fields: string): Promise<any> {
      const query = `
      query {
         Field_getList(filters: ${paramsToString(filters)}, pagination: ${paramsToString(pagination)}) ${fields}
      }`
      return this._server.API({ query, name: 'Field_getList' })
   }
}

export default FieldServer