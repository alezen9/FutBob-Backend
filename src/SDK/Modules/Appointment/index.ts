import { ZenServer } from "../../"
import { CreateAppointmentInput, FiltersAppointment } from "../../../Graph/Appointment/inputs"
import { CreateFreeAgentInput, FiltersFreeAgent, UpdateFreeAgentInput } from "../../../Graph/FreeAgent/inputs"
import { Pagination } from "../../../MongoDB/Entities"
import { paramsToString } from "../../helpers"

class AppointmentServer {
   private _server: ZenServer

   constructor(server: ZenServer) {
      this._server = server
   }

   async create(body: CreateAppointmentInput): Promise<any> {
      const query = `
      mutation {
         Appointment_create(body: ${paramsToString(body)})
      }`
      return this._server.API({ query, name: 'Appointment_create' })
   }

   // async update(body: UpdateFreeAgentInput): Promise<any> {
   //    const query = `
   //    mutation {
   //       FreeAgent_update(body: ${paramsToString(body)})
   //    }`
   //    return this._server.API({ query, name: 'FreeAgent_update' })
   // }

  async getList(filters: FiltersAppointment, pagination: Pagination, fields: string): Promise<any> {
      const query = `
         query {
            Appointment_getList(filters: ${paramsToString(filters)}, pagination: ${paramsToString(pagination)}) ${fields}
         }`
      return this._server.API({ query, name: 'Appointment_getList' })
   }
}

export default AppointmentServer