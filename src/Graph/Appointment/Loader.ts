import DataLoader from 'dataloader'
import { ObjectId } from 'mongodb'
import { mongoAppointment } from '../../MongoDB/Appointment'
import { Appointment } from '../../MongoDB/Appointment/Entities'


/** Helpers */

const getAppointmentById = async (id: string|ObjectId) => {
  const _id = id instanceof ObjectId
      ? id.toHexString()
      : id
  try {
    return await mongoAppointment.getAppointmentById(_id)
  } catch (err) {
    throw err
  }
}


/** Loaders */

export const appointmentLoader = new DataLoader<string|ObjectId, Appointment>(appointmentIds => {
  const promises = appointmentIds.map(getAppointmentById)
  return Promise.all(promises)
})