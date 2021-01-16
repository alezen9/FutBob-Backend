import { ZenServer } from "../../"
import { CreateUserInput, UpdateRegistryInput } from "../../../Graph/User/inputs"
import { paramsToString } from "../../helpers"

class UserServer {
   private _server: ZenServer

   constructor(server: ZenServer) {
      this._server = server
   }

   async create (body: CreateUserInput) {
      const query = `
      mutation {
         User_create(userInput: ${paramsToString(body)})
      }`
      return this._server.API({ query, name: 'User_create' })
   }

   async update (body: UpdateRegistryInput) {
      const query = `
      mutation {
         User_create(userInput: ${paramsToString(body)})
      }`
      return this._server.API({ query, name: 'User_create' })
   }

   async getMe (fields: string) {
      const query = `
      query {
         User_getMe ${fields}
      }`
      return this._server.API({ query, name: 'User_getMe' })
   }

   async changeMyUsername (newUsername: string) {
      const query = `
      mutation {
         User_changeMyUsername(newUsername: "${newUsername}")
      }`
      return this._server.API({ query, name: 'User_changeMyUsername' })
   }

   async changeMyPassword (oldPassword: string, newPassword: string) {
      const query = `
      mutation {
         User_changeMyPassword(oldPassword: "${oldPassword}", newPassword: "${newPassword}")
      }`
      return this._server.API({ query, name: 'User_changeMyPassword' })
   }

   async delete (_id: string) {
      const query = `
      mutation {
         User_delete(_id: "${_id}")
      }`
      return this._server.API({ query, name: 'User_delete' })
   }
}

export default UserServer