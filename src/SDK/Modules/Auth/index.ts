import { get } from 'lodash'
import { ZenServer } from "../../"
import { LoginInput, RegisterInput } from '../../../Graph/Auth/inputs'
import { paramsToString } from '../../helpers'

class AuthServer {
   private _server: ZenServer

   constructor(server: ZenServer) {
      this._server = server
   }

   setToken (token: string): void {
      const tokenSet = get(this._server._self, 'defaults.headers.common.Authorization', undefined)
      let _token = tokenSet ? tokenSet.split(' ')[1] : undefined
      if (token !== _token) {
         this._server._self.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }
   }

   async register(body: RegisterInput): Promise<any> {
      const query = `
      mutation {
         Auth_register(body: ${paramsToString(body)})
      }`
      return this._server.API({ query, name: 'Auth_register' })
   }

   async confirm(code: string, fields: string): Promise<any> {
      const query = `
      query {
         Auth_confirm(code: "${code}")${fields}
      }`
      return this._server.API({ query, name: 'Auth_confirm' })
   }

   async login(body: LoginInput, fields: string): Promise<any> {
      const query = `
      query {
         Auth_login(body: ${paramsToString(body)})${fields}
      }`
      return this._server.API({ query, name: 'Auth_login' })
   }
}

export default AuthServer