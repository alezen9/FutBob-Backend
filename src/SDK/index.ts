import axios, { AxiosInstance } from 'axios'
import { get } from 'lodash'
import { paramsToString } from '../Utils/helpers'
import { SigninInput, SignupInput, UserInput } from './Entities'
require('dotenv').config()

export class FutBobServer {
  _self: AxiosInstance
    
  constructor (_host?: string) {
    this._self = axios.create({
      baseURL: _host || process.env.NODE_ENV === 'production' ? process.env.BASE_API_URL : 'http://localhost:7000',
      timeout: 100000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    this._self.interceptors.response.use(
      (response:any):any => response.data || null,
      (error:any):any => {
        throw get(error, 'response.data.errors[0].message', error)
      }
    )
  }

  async API ({query, name}) {
    return await this._self.post('/graphql', { query })
      .then((res:any) => {
        const { data, errors } = res
        if (errors && errors.length) throw errors[0].message
        else return data[name]
      })
  }

  setToken (token: string): void {
    const tokenSet = get(this._self, 'defaults.headers.common.Authorization', undefined)
    let _token = tokenSet ? tokenSet.split(' ')[1] : undefined
    if (token !== _token) {
      this._self.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
  }

  async user_signUp(signupInput: SignupInput, fields: string): Promise<any> {
    const query = `
    mutation {
        signup(signupInput: ${paramsToString(signupInput)})${fields}
    }`
    return this.API({ query, name: 'signup' })
  }

  async user_login(signinInput: SigninInput, fields: string): Promise<any> {
    const query = `
    query {
        login(signinInput: ${paramsToString(signinInput)})${fields}
    }`
    return this.API({ query, name: 'login' })
  }

  async user_getUserConnected(fields: string): Promise<any> {
    const query = `
    query {
        getUserConnected ${fields}
    }`
    return this.API({ query, name: 'getUserConnected' })
  }

  async user_changeUsername(newUsername: string): Promise<any> {
    const query = `
    mutation {
        changeUsername(newUsername: "${newUsername}")
    }`
    return this.API({ query, name: 'changeUsername' })
  }

  async user_changePassword(oldPassword: string, newPassword: string): Promise<any> {
    const query = `
    mutation {
        changePassword(oldPassword: "${oldPassword}", newPassword: "${newPassword}")
    }`
    return this.API({ query, name: 'changePassword' })
  }

  async user_updateUser(userInput: UserInput): Promise<any> {
    const query = `
    mutation {
        updateUserConnected(userInput: ${paramsToString(userInput)})
    }`
    return this.API({ query, name: 'updateUserConnected' })
  }
  
}
