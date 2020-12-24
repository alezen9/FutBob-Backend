import { get } from 'lodash'
import { ZenServer } from "../../"
import { paramsToString } from '../../helpers'
import { SigninInput, SignupInput } from "./types"

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

   async signUp(signupInput: SignupInput, fields: string): Promise<any> {
      const query = `
      mutation {
         signup(signupInput: ${paramsToString(signupInput)})${fields}
      }`
      return this._server.API({ query, name: 'signup' })
   }

   async login(signinInput: SigninInput, fields: string): Promise<any> {
      const query = `
      query {
         login(signinInput: ${paramsToString(signinInput)})${fields}
      }`
      return this._server.API({ query, name: 'login' })
   }
}

export default AuthServer