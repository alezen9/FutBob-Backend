import dayjs from 'dayjs'
import { MongoDBInstance } from '..'
import { ObjectId } from 'mongodb'
import { mongoUser } from '../User'
import { facetCount } from '../helpers'
import { get } from 'lodash'
import { List } from '../Entities'
import { Appointment } from './Entities'

class MongoAppointment {
  
  async createAppointment (data: any, createdBy: string): Promise<string> {
    
   //  const now = dayjs().toDate()
   //  const player = new Player()
   //  player._id = new ObjectId()
   //  player.createdBy = new ObjectId(createdBy)
   //  player.user = new ObjectId(data.idUser)
   //  player.positions = data.positions
   //  player.state = data.state || PhysicalState.Top
   //  player.type = data.type
   //  player.createdAt = now
   //  player.updatedAt = now
   //  player.score = this.assignScoreValues(data)

   //  await MongoDBInstance.collection.player.insertOne(player)
   //  await mongoUser.assignPlayer({
   //      idUser: data.idUser,
   //      ...player.type === PlayerType.Football && { footballPlayer: (player._id).toHexString() },
   //      ...player.type === PlayerType.Futsal && { futsalPlayer: (player._id).toHexString() }
   //  })
   //  return player._id.toHexString()
   return ''
  }

  async getAppointments (filters: any, createdBy: string): Promise<List<Appointment>> {
    const { 
      ids = [],
      positions = [],
      type,
      states = [],
      countries = [],
      searchText,
      pagination = {}
    } = filters
    const { skip = 0, limit } = pagination
    const _limit = !limit || limit < 0 || limit > 100
      ? 100
      : limit
    return {} as List<Appointment>
  }

  async getAppointmentById (_id: string): Promise<Appointment> {
    const appointment: Appointment = await MongoDBInstance.collection.appointment.findOne({ _id: new ObjectId(_id) })
    return appointment
  }

  getTypeAppointmentFields (appointment: Appointment):any {
      return {}
  }
}

export const mongoAppointment = new MongoAppointment()