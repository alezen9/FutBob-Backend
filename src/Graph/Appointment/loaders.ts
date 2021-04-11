import DataLoader from 'dataloader'
import { mongoAppointment } from '../../MongoDB/Appointment'

/** Loaders */

export const appointmentLoader = new DataLoader((appointmentIds: string[]) => {
  const promises = appointmentIds.map(_id => mongoAppointment.getAppointmentById(_id))
  return Promise.all(promises)
})