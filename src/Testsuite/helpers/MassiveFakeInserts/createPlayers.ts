import dayjs from 'dayjs'
import faker from 'faker'
import { sample, sampleSize } from 'lodash'
import { CreatePlayerInput } from '../../../Graph/Player/inputs'
import { CreateUserInput } from '../../../Graph/User/inputs'
import { PhysicalState, PlayerPosition, PlayerScore } from '../../../MongoDB/Player/Entities'
import { Sex } from '../../../MongoDB/User/Entities'
import { ZenServer } from '../../../SDK'

const fromDate = dayjs().set('year', 1975).toDate()
const toDate = dayjs().subtract(15, 'years').toDate()

export const createPlayers = async (n: number, apiInstance: ZenServer) => {
   for (let i = 0; i < n; i++) {
      faker.seed(i)
      const userInput: CreateUserInput = {
         country: 'MK',
         dateOfBirth: dayjs(faker.date.between(fromDate, toDate)).toISOString(),
         name: faker.name.firstName(),
         surname: faker.name.lastName(),
         phone: faker.phone.phoneNumber('+39 3## ### ####'),
         sex: sample([Sex.Male, Sex.Female]),
         additionalInfo: {
            email: faker.internet.email()
         }
      }
      const idUser = await apiInstance.user.create(userInput)
      const playerInput: CreatePlayerInput = {
         positions: sampleSize([PlayerPosition.GoalKeeper, PlayerPosition.Back,PlayerPosition.RightWing, PlayerPosition.LeftWing, PlayerPosition.Forward], 2),
         user: idUser,
         score: mockScore(),
         state: PhysicalState.Top
      }
      const idPlayer = await apiInstance.player.create(playerInput)
   }
}



const mockScore = (): PlayerScore => {
   return {
      defense: {
         defensiveAwareness: faker.datatype.number({ min: 40, max: 95 }),
         interception: faker.datatype.number({ min: 40, max: 95 }),
         versus: faker.datatype.number({ min: 40, max: 95 })
      },
      pace: {
         speed: faker.datatype.number({ min: 40, max: 95 }),
         stamina: faker.datatype.number({ min: 40, max: 95 })
      },
      passing: {
         longPassing: faker.datatype.number({ min: 40, max: 95 }),
         shortPassing: faker.datatype.number({ min: 40, max: 95 }),
         vision: faker.datatype.number({ min: 40, max: 95 })
      },
      physical: {
         strength: faker.datatype.number({ min: 40, max: 95 })
      },
      shooting: {
         finishing: faker.datatype.number({ min: 40, max: 95 }),
         longShots: faker.datatype.number({ min: 40, max: 95 }),
         shotPower: faker.datatype.number({ min: 40, max: 95 })
      },
      technique: {
         agility: faker.datatype.number({ min: 40, max: 95 }),
         ballControl: faker.datatype.number({ min: 40, max: 95 }),
         dribbling: faker.datatype.number({ min: 40, max: 95 })
      }
   }
}