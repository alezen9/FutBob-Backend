import { ZenServer } from "../../"
import { CreateAppointmentInput, FiltersAppointment, SetMpvManuallyInput, UpdateAppointmentInvitesInput, UpdateAppointmentMainInput, UpdateAppointmentMatchesInput, UpdateAppointmentStateInput, UpdateAppointmentStatsInput } from "../../../Graph/Appointment/inputs"
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

   async updateMainInfo(body: UpdateAppointmentMainInput): Promise<any> {
      const query = `
      mutation {
         Appointment_UpdateMainInfo(body: ${paramsToString(body)})
      }`
      return this._server.API({ query, name: 'Appointment_UpdateMainInfo' })
   }

   async updateState(body: UpdateAppointmentStateInput): Promise<any> {
      const query = `
      mutation {
         Appointment_UpdateState(body: ${paramsToString(body)})
      }`
      return this._server.API({ query, name: 'Appointment_UpdateState' })
   }

   async updateStats(body: UpdateAppointmentStatsInput): Promise<any> {
      const query = `
      mutation {
         Appointment_UpdateStats(body: ${paramsToString(body)})
      }`
      return this._server.API({ query, name: 'Appointment_UpdateStats' })
   }

   async updateSetMvpManually(body: SetMpvManuallyInput): Promise<any> {
      const query = `
      mutation {
         Appointment_SetMpvManually(body: ${paramsToString(body)})
      }`
      return this._server.API({ query, name: 'Appointment_SetMpvManually' })
   }

   async updateInvites(body: UpdateAppointmentInvitesInput): Promise<any> {
      const query = `
      mutation {
         Appointment_UpdateInvites(body: ${paramsToString(body)})
      }`
      return this._server.API({ query, name: 'Appointment_UpdateInvites' })
   }

   async updateMatches(body: UpdateAppointmentMatchesInput): Promise<any> {
      const query = `
      mutation {
         Appointment_UpdateMatches(body: ${paramsToString(body)})
      }`
      return this._server.API({ query, name: 'Appointment_UpdateMatches' })
   }

  async getList(filters: FiltersAppointment, pagination: Pagination, fields: string): Promise<any> {
      const query = `
         query {
            Appointment_getList(filters: ${paramsToString(filters)}, pagination: ${paramsToString(pagination)}) ${fields}
         }`
      return this._server.API({ query, name: 'Appointment_getList' })
   }
}

export default AppointmentServer