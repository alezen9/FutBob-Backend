import axios, { AxiosInstance } from 'axios'
import { get } from 'lodash'
import { paramsToString } from '../Utils/helpers'
import { SigninInput, SignupInput, UserInput, CreatePlayerInputWithId, CreatePlayerInputWithUser, DeletePlayerInput, PlayerFilters, UpdatePlayerInfoInput, UpdateUserPlayerInfoInput, FieldFilters, CreateFieldInput, UpdateFieldInput, CreateFreeAgentInput, FreeAgentFilters } from './Entities'
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

  async API ({ query, name }) {
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

  /** USER */
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

  async user_updateUserConnected(userInput: UserInput): Promise<any> {
    const query = `
    mutation {
        updateUserConnected(userInput: ${paramsToString(userInput)})
    }`
    return this.API({ query, name: 'updateUserConnected' })
  }

  async user_updateUser(userInput: UpdateUserPlayerInfoInput): Promise<any> {
    const query = `
    mutation {
        updateUser(userInput: ${paramsToString(userInput)})
    }`
    return this.API({ query, name: 'updateUser' })
  }




  /** Player */
  async player_createPlayer(createPlayerInput: CreatePlayerInputWithId | CreatePlayerInputWithUser): Promise<any> {
    const query = `
    mutation {
        createPlayer(createPlayerInput: ${paramsToString(createPlayerInput)})
    }`
    return this.API({ query, name: 'createPlayer' })
  }

  async player_updatePlayer(updatePlayerInput: UpdatePlayerInfoInput): Promise<any> {
    const query = `
    mutation {
        updatePlayer(updatePlayerInput: ${paramsToString(updatePlayerInput)})
    }`
    return this.API({ query, name: 'updatePlayer' })
  }

  async player_deletePlayer(deletePlayerInput: DeletePlayerInput): Promise<any> {
    const query = `
    mutation {
        deletePlayer(deletePlayerInput: ${paramsToString(deletePlayerInput)})
    }`
    return this.API({ query, name: 'deletePlayer' })
  }

  async player_getPlayers(playerFilters: PlayerFilters, fields: string): Promise<any> {
    const query = `
    query {
        getPlayers(playerFilters: ${paramsToString(playerFilters)}) ${fields}
    }`
    return this.API({ query, name: 'getPlayers' })
  }




  /** Field */
  async field_getFields(fieldsFilters: FieldFilters, fields: string): Promise<any> {
    const query = `
    query {
        getFields(fieldsFilters: ${paramsToString(fieldsFilters)}) ${fields}
    }`
    return this.API({ query, name: 'getFields' })
  }

  async field_createField(createFieldInput: CreateFieldInput): Promise<any> {
    const query = `
    mutation {
        createField(createFieldInput: ${paramsToString(createFieldInput)})
    }`
    return this.API({ query, name: 'createField' })
  }

  async field_updateField(updateFieldInput: UpdateFieldInput): Promise<any> {
    const query = `
    mutation {
        updateField(updateFieldInput: ${paramsToString(updateFieldInput)})
    }`
    return this.API({ query, name: 'updateField' })
  }

  async field_deleteField(_id: string): Promise<any> {
    const query = `
    mutation {
        deleteField(_id: "${_id}")
    }`
    return this.API({ query, name: 'deleteField' })
  }



  /** Free Agent */
  async freeAgent_createFreeAgent(createFreeAgentInput: CreateFreeAgentInput): Promise<any> {
    const query = `
    mutation {
        createFreeAgent(createFreeAgentInput: ${paramsToString(createFreeAgentInput)})
    }`
    return this.API({ query, name: 'createFreeAgent' })
  }

  async freeAgent_updateFreeAgent(updateFreeAgentInput: Partial<CreateFreeAgentInput> & { _id: string }): Promise<any> {
    const query = `
    mutation {
        updateFreeAgent(updateFreeAgentInput: ${paramsToString(updateFreeAgentInput)})
    }`
    return this.API({ query, name: 'updateFreeAgent' })
  }

  async freeAgent_deleteFreeAgent(_id: string): Promise<any> {
    const query = `
    mutation {
        deleteFreeAgent(_id: "${_id}")
    }`
    return this.API({ query, name: 'deleteFreeAgent' })
  }

  async freeAgent_getFreeAgents(freeAgentFilters: FreeAgentFilters, fields: string): Promise<any> {
    const query = `
    query {
        getFreeAgents(freeAgentFilters: ${paramsToString(freeAgentFilters)}) ${fields}
    }`
    return this.API({ query, name: 'getFreeAgents' })
  }
  
}
