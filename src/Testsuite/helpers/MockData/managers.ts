import dayjs from 'dayjs'
import { Sex } from '../../../MongoDB/User/Entities'

export const manager1Credentials = {
  email: 'fakeemailtesting@live.com',
  password: 'alezen9'
}

export const manager1 = {
  name: 'Aleksandar',
  surname: 'Gjroeski',
  dateOfBirth: dayjs('1993-07-02T22:00:00.000Z').toISOString(),
  phone: '+39 3333333333',
  sex: Sex.Male,
  country: 'MK',
  ...manager1Credentials
}

export const manager2Credentials = {
  email: 'sometestemail@gmail.com',
  password: 'alezen7'
}

export const manager2 = {
  name: 'Naumche',
  surname: 'Gjroeski',
  dateOfBirth: dayjs('1985-07-02T22:00:00.000Z').toISOString(),
  phone: '+39 3414125674',
  sex: Sex.Male,
  country: 'MK',
  ...manager2Credentials
}
