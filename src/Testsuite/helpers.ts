import { FutBobServer } from "../SDK"
import { Sex } from "../MongoDB/User/entities"
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
  ...managerCredentials
}

const authDataFields = `{
  token,
  expiresIn
}`

const players = [
    {
        _id: undefined,
        userData: {
            name: 'Naumche',
            surname: 'Gjroeski',
            dateOfBirth: '1985-01-03T23:00:00.000Z',
            phone: '+39 234234342',
            sex: Sex.Male
        },
        playerData: {
            positions: [
                PlayerPosition.CenterForward,
                PlayerPosition.CentreBack,
                PlayerPosition.DefensiveMidfielder
            ],
            type: PlayerType.Football
        }
    },
    {
        _id: undefined,
        userData: {
            name: 'Cristian Camilo',
            surname: 'Quintero Villa',
            dateOfBirth: '1994-01-04T23:00:00.000Z',
            phone: '+39 234234342',
            sex: Sex.Male
        },
        playerData: {
            positions: [
                PlayerPosition.FutsalForward,
                PlayerPosition.FutsalForward
            ],
            type: PlayerType.Futsal
        }
    },
    {
        _id: undefined,
        userData: {
            name: 'Boban',
            surname: 'Cvetanoski',
            dateOfBirth: '1997-08-17T22:00:00.000Z',
            phone: '+39 7686787874',
            sex: Sex.Male
        },
        playerData: {
            positions: [
                PlayerPosition.FutsalForward,
                PlayerPosition.FutsalForward,
                PlayerPosition.FutsalGoalKeeper
            ],
            type: PlayerType.Futsal
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
