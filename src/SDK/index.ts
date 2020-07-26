import axios, { AxiosInstance } from 'axios'
import { get } from 'lodash'
import { paramsToString } from '../Utils/helpers'
require('dotenv').config()

export class FutBobServer {
    private _self: AxiosInstance
    
  constructor (_host?: string) {
    this._self = axios.create({
      baseURL: _host || process.env.NODE_ENV === 'prod' ? process.env.BASE_API_URL : 'http://localhost:7000',
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

  setToken (token) {
    const tokenSet = get(this._self, 'defaults.headers.common.Authorization', undefined)
    let _token = tokenSet ? tokenSet.split(' ')[1] : undefined
    if (token !== _token) {
      this._self.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
  }

  async user_signUp(signupInput) {
    const query = `
    mutation {
        signup(signupInput: ${paramsToString(signupInput)}){
          token,
          expiresIn
        }
    }`
    return await this._self.post('/graphql', { query })
      .then((res:any) => {
        const { data, errors } = res
        if (errors && errors.length) throw errors[0].message
        else return data.signup
      })
  }
  
}

const apiInstance = new FutBobServer()

export default apiInstance
