import DataLoader from 'dataloader'
import { mongoAppointment } from '../../MongoDB/Appointment'
import { Appointment } from '../../MongoDB/Appointment/Entities'

const batchAppointments = async (ids: string[]) => {
  const appointments = await mongoAppointment.getAppointmentsByIds(ids)
  const appointmentsMap = appointments.reduce<{ [_id: string]: Appointment }>((acc, appointment) => {
    return {
      ...acc,
      [String(appointment._id)]: appointment
    }
  }, {})
  return ids.map(_id => appointmentsMap[_id])
}

export const appointmentLoader = new DataLoader(batchAppointments)