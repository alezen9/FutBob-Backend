import { FutBobServer } from "../SDK"
import { Sex } from "../MongoDB/User/Entities"
import { PlayerPosition, PlayerType } from "../MongoDB/Player/Entities"

const ResetColor = '\x1b[0m'
const FgGreen = '\x1b[32m'
const FgRed = '\x1b[31m'

export const ShouldSucceed = `${FgGreen}Should succeed ⇩${ResetColor}`
export const ShouldFail = `${FgRed}Should fail ⇩${ResetColor}`

export const validationErrorRegEx = /^Field.*required.*was\snot\sprovided\.$/

// type SetupParams = {
//     createRandomUsers: boolean
// }

const managerCredentials = {
  username: 'alezen9',
  password: 'alezen9'
}

const manager = {
  name: 'Aleksandar',
  surname: 'Gjroeski',
  dateOfBirth: '1993-07-02T22:00:00.000Z',
  phone: '+39 1234567890',
  sex: Sex.Male,
  country: 'MK',
  ...managerCredentials
}

const manager2Credentials = {
  username: 'alezen7',
  password: 'alezen7'
}

const manager2 = {
  name: 'Naumche',
  surname: 'Gjroeski',
  dateOfBirth: '1985-07-02T22:00:00.000Z',
  phone: '+39 1234567890',
  sex: Sex.Male,
  country: 'MK',
  ...manager2Credentials
}

const authDataFields = `{
  token,
  expiresIn
}`

const players = [
{
    _id: undefined,
    userData: {
      name: 'Boban',
      surname: 'Cvetanoski',
      dateOfBirth: '1997-08-17T22:00:00.000Z',
      phone: '+39 7686787874',
      sex: Sex.Male,
      country: 'MK'
    },
    playerData: {
      positions: [
        PlayerPosition.FutsalLeftWing,
        PlayerPosition.FutsalRightWing,
        PlayerPosition.FutsalBack,
        PlayerPosition.FutsalGoalKeeper
      ],
      type: PlayerType.Futsal,
      score: {
        pace: {
          acceleration: 35,
          sprintSpeed: 40
        },
        shooting: {
          positioning: 65,
          finishing: 65,
          shotPower: 60,
          longShots: 50,
          volleys: 68,
          penalties: 78
        },
        passing: {
          vision: 73,
          crossing: 68,
          freeKick: 60,
          shortPassing: 80,
          longPassing: 64,
          curve: 58
        },
        dribbling: {
          agility: 45,
          balance: 45,
          reactions: 67,
          ballControl: 60,
          dribbling: 55,
          composure: 68
        },
        defense: {
          interceptions: 68,
          heading: 50,
          defensiveAwareness: 65,
          standingTackle: 68,
          slidingTackle: 61
        },
        physical: {
          jumping: 50,
          stamina: 45,
          strength: 55,
          aggression: 78
        }
      }
    }
  },
  {
    _id: undefined,
    userData: {
      name: 'Aleksandar',
      surname: 'Gjoreski',
      dateOfBirth: '1993-03-06T23:00:00.000Z',
      phone: '+39 3408947641',
      sex: Sex.Male,
      country: 'MK'
    },
    playerData: {
      positions: [
        PlayerPosition.FutsalLeftWing,
        PlayerPosition.FutsalRightWing,
        PlayerPosition.FutsalBack,
        PlayerPosition.FutsalGoalKeeper
      ],
      type: PlayerType.Futsal,
      score: {
        pace: {
          acceleration: 78,
          sprintSpeed: 84
        },
        shooting: {
          positioning: 82,
          finishing: 87,
          shotPower: 91,
          longShots: 86,
          volleys: 75,
          penalties: 85
        },
        passing: {
          vision: 87,
          crossing: 73,
          freeKick: 77,
          shortPassing: 93,
          longPassing: 89,
          curve: 87
        },
        dribbling: {
          agility: 85,
          balance: 83,
          reactions: 84,
          ballControl: 85,
          dribbling: 84,
          composure: 80
        },
        defense: {
          interceptions: 70,
          heading: 55,
          defensiveAwareness: 45,
          standingTackle: 55,
          slidingTackle: 40
        },
        physical: {
          jumping: 70,
          stamina: 78,
          strength: 73,
          aggression: 45
        }
      }
    }
  }
]

export enum TestsuiteSetupStep {
    WithManager,
    WithPlayers
}

export const setupTestsuite = async (step: TestsuiteSetupStep, apiInstance: FutBobServer): Promise<any> => {
    // register manager
    const { token } = await apiInstance.user_signUp(manager, authDataFields)
    await apiInstance.user_signUp(manager2, authDataFields)
    apiInstance.setToken(token)
    if(step === TestsuiteSetupStep.WithManager) {
        return {
            token,
            manager
        }
    }

    // create some players
    const createPlayerPromises = players.map(({_id, ...body}, i) => 
        apiInstance.player_createPlayer(body)
            .then(_id => {
                players[i]._id = _id
            })
    )
    
    await Promise.all(createPlayerPromises)
    if(step === TestsuiteSetupStep.WithPlayers) {
        return {
            token,
            manager,
            players
        }
    }}
