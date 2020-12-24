import { ZenServer } from "../../"
import { paramsToString } from "../../helpers"
import { UpdateUserPlayerInfoInput } from "../Player/types"
import { UserInput } from "./types"

class UserServer {
   private _server: ZenServer

   constructor(server: ZenServer) {
      this._server = server
   }

   async getMe (fields: string) {
      const query = `
      query {
         getUserConnected ${fields}
      }`
      return this._server.API({ query, name: 'getUserConnected' })
   }

   async changeMyUsername (newUsername: string) {
      const query = `
      mutation {
         changeUsername(newUsername: "${newUsername}")
      }`
      return this._server.API({ query, name: 'changeUsername' })
   }

   async changeMyPassword (oldPassword: string, newPassword: string) {
      const query = `
      mutation {
         changePassword(oldPassword: "${oldPassword}", newPassword: "${newPassword}")
      }`
      return this._server.API({ query, name: 'changePassword' })
   }

   async updateMe (userInput: UserInput) {
      const query = `
      mutation {
         updateUserConnected(userInput: ${paramsToString(userInput)})
      }`
      return this._server.API({ query, name: 'updateUserConnected' })
   }

   async update (userInput: UpdateUserPlayerInfoInput) {
      const query = `
      mutation {
         updateUser(userInput: ${paramsToString(userInput)})
      }`
      return this._server.API({ query, name: 'updateUser' })
   }
}

export default UserServer