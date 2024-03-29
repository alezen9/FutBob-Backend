import { MongoDBInstance } from '../../MongoDB'
import { ZenServer } from '../../SDK'
import ErrorMessages from '../../Utils/ErrorMessages'
import { fields } from './MockData/fields'
import { freeAgents } from './MockData/freeAgents'
import { manager1 } from './MockData/managers'
import { players } from './MockData/players'

const ResetColor = '\x1b[0m'
const FgGreen = '\x1b[32m'
const FgRed = '\x1b[31m'

export const ShouldSucceed = `${FgGreen}Should succeed ⇩${ResetColor}`
export const ShouldFail = `${FgRed}Should fail ⇩${ResetColor}`

export const validationErrorRegEx = /^Field.*required.*was\snot\sprovided\.$/



export enum TestsuiteSetupOperation {
    Manager = 'Manager',
    Players = 'Players',
    FreeAgents = 'FreeAgents',
    Fields = 'Fields',
    // Appointments = 'Appointments'
}

type SetupConfig = Partial<Record<TestsuiteSetupOperation, boolean>>

export const setupTestsuite = async (config: SetupConfig, apiInstance: ZenServer): Promise<any> => {
	if(!config) return {}

	if(config.Manager){
		// send email
		const { password, ...body } = manager1
		const emailSent = await apiInstance.auth.requestRegistration(body)
		if(!emailSent) throw new Error(ErrorMessages.system_confirmation_email_not_sent)
		// get confirmation code from db
		const user = await MongoDBInstance.collection.user.findOne({ "credentials.email": manager1.email })
		if(!user) throw new Error(ErrorMessages.user_user_not_exists)
		const { token } = await apiInstance.auth.finalizeRegistration({
			unverifiedCode: user.credentials.verifyAccount.code.value,
			password,
			confirmPassword: password
		}, '{ token }')
		apiInstance.auth.setToken(token)
	}

	if(config.Players){
		const promises = players.map(({ _id, user, ...body }, i) => {
			return apiInstance.user.create(user.registry)
				.then(_idUser => {
					if(_idUser) return apiInstance.player.create({ ...body, user: _idUser })
						.then(_idPlayer => {
							players[i]._id = _idPlayer
							players[i].user._id = _idUser
						})
				})
		})
		await Promise.all(promises)
	}

	if(config.FreeAgents){
		const promises = freeAgents.map(({ _id, ...body }, i) => {
			return apiInstance.freeAgent.create(body)
				.then(_id => {
					freeAgents[i]._id = _id
				})
		})
		await Promise.all(promises)
	}

	if(config.Fields){
		const promises = fields.map(({ _id, ...body }, i) => {
			return apiInstance.field.create(body)
				.then(_id => {
					fields[i]._id = _id
				})
		})
		await Promise.all(promises)
	}
}
