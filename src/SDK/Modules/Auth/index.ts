import { get } from 'lodash'
import { ZenServer } from "../../"
import { FinalizeRegistrationInput, LoginInput, RegisterInput, RequestResendInput } from '../../../Graph/Auth/inputs'
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

   async isTokenValid(token: string): Promise<any> {
      const query = `
      query {
         Auth_isTokenValid(token: "${token}")
      }`
      return this._server.API({ query, name: 'Auth_isTokenValid' })
   }

   /** Start registration flow */
   async requestRegistration(body: RegisterInput): Promise<any> {
      const query = `
      mutation {
         Auth_requestRegistration(body: ${paramsToString(body)})
      }`
      return this._server.API({ query, name: 'Auth_requestRegistration' })
   }

   async requestRegistrationEmailResend(body: RequestResendInput): Promise<any> {
      const query = `
      mutation {
         Auth_requestRegistrationEmailResend(body: ${paramsToString(body)})
      }`
      return this._server.API({ query, name: 'Auth_requestRegistrationEmailResend' })
   }

   async finalizeRegistration(body: FinalizeRegistrationInput, fields: string): Promise<any> {
      const query = `
      mutation {
         Auth_finalizeRegistration(body: ${paramsToString(body)})${fields}
      }`
      return this._server.API({ query, name: 'Auth_finalizeRegistration' })
   }
   /** End registration flow */



   /** Start reset password flow */
   async requestResetPassword(email: string): Promise<any> {
      const query = `
      mutation {
         Auth_requestResetPassword(email: "${email}")
      }`
      return this._server.API({ query, name: 'Auth_requestResetPassword' })
   }

   async requestResetPasswordEmailResend(body: RequestResendInput): Promise<any> {
      const query = `
      mutation {
         Auth_requestResetPasswordEmailResend(body: ${paramsToString(body)})
      }`
      return this._server.API({ query, name: 'Auth_requestResetPasswordEmailResend' })
   }

   async finalizeResetPassword(body: FinalizeRegistrationInput, fields: string): Promise<any> {
      const query = `
      mutation {
         Auth_finalizeResetPassword(body: ${paramsToString(body)})${fields}
      }`
      return this._server.API({ query, name: 'Auth_finalizeResetPassword' })
   }
   /** End reset password flow */
   
   async login(body: LoginInput, fields: string): Promise<any> {
      const query = `
      query {
         Auth_login(body: ${paramsToString(body)})${fields}
      }`
      return this._server.API({ query, name: 'Auth_login' })
   }
}

export default AuthServer