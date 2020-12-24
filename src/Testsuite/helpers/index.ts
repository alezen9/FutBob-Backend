import { ZenServer } from '../../SDK'
import { fields } from './MockData/fields'
import { manager1, manager2 } from './MockData/managers'
import { players } from './MockData/players'

const ResetColor = '\x1b[0m'
const FgGreen = '\x1b[32m'
const FgRed = '\x1b[31m'

export const ShouldSucceed = `${FgGreen}Should succeed ⇩${ResetColor}`
export const ShouldFail = `${FgRed}Should fail ⇩${ResetColor}`

export const validationErrorRegEx = /^Field.*required.*was\snot\sprovided\.$/

const authDataFields = `{
  token,
  expiresIn
}`



export enum TestsuiteSetupStep {
    WithManager,
    WithPlayers,
    WithFields
}

export const setupTestsuite = async (step: TestsuiteSetupStep, apiInstance: ZenServer): Promise<any> => {
    // register manager
    const { token } = await apiInstance.auth.signUp(manager1, authDataFields)
    await apiInstance.auth.signUp(manager2, authDataFields)
    apiInstance.auth.setToken(token)
    if(step === TestsuiteSetupStep.WithManager) {
        return {
            token,
            manager1
        }
    }

    // create some players
    const createPlayerPromises = players.map(({_id, idUser, ...body}, i) => 
        apiInstance.player.create(body)
            .then(_id => {
                players[i]._id = _id
            })
    )
    
    await Promise.all(createPlayerPromises)
    if(step === TestsuiteSetupStep.WithPlayers) {
        return {
            token,
            manager1,
            players
        }
    }

    // create some fields
    const createFieldsPromises = fields.map(({_id, ...body}, i) => 
        apiInstance.field.create(body)
            .then(_id => {
                fields[i]._id = _id
            })
    )
    
    await Promise.all(createFieldsPromises)
    if(step === TestsuiteSetupStep.WithFields) {
        return {
            token,
            manager1,
            players,
            fields
        }
    }
}
