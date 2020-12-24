import { AxiosInstance } from 'axios'
// start modules
import AuthServer from './Modules/Auth'
import FieldServer from './Modules/Field'
import PlayerServer from './Modules/Player'
import UserServer from './Modules/User'
import FreeAgentServer from './Modules/FreeAgent'
// end modules
import { zenAxiosInstance } from './helpers/ZenAxios'

export class ZenServer {
  _self: AxiosInstance
  /** start modules */
  auth: AuthServer
  user: UserServer
  player: PlayerServer
  field: FieldServer
  freeAgent: FreeAgentServer
  /** end modules */

  constructor (_host?: string) {
   // axios
   this._self = zenAxiosInstance.create(_host)
   // modules
   this.auth = new AuthServer(this)
   this.user = new UserServer(this)
   this.player = new PlayerServer(this)
   this.field = new FieldServer(this)
   this.freeAgent = new FreeAgentServer(this)
  }

  async API ({ query, name }) {
    return await this._self.post('/graphql', { query })
      .then((res:any) => {
        const { data, errors } = res
        if (errors && errors.length) throw errors[0].message
        else return data[name]
      })
  }
}