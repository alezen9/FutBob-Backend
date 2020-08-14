import assert from 'assert'
import { MongoDBInstance, MongoState } from '../MongoDB'
import { FutBobServer } from '../SDK'
import { describe, it } from 'mocha'
import { validationErrorRegEx } from './helpers'
import { Sex } from '../MongoDB/User/entities'
import ErrorMessages from '../Utils/ErrorMessages'
import moment from 'moment'

const apiInstance = new FutBobServer()
const noTokenApiInstance = new FutBobServer()

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

describe('Authentication', () => {
  describe('Clear database', () => {
    it('Should clear database', async () => {
      if (MongoDBInstance.state === MongoState.Disconnected) {
        await MongoDBInstance.startConnection()
      }
      await MongoDBInstance.clearDb()
    })
  })

  describe('Signup', () => {
    it('Register a new manager', async () => {
      const { token, expiresIn } = await apiInstance.user_signUp(manager, authDataFields)
      assert.strictEqual(typeof token, 'string')
      assert.strictEqual(typeof expiresIn, 'string')
    })

    it('Try to register a manager with another user\'s username', async () => {
      try {
        await noTokenApiInstance.user_signUp(manager, authDataFields)
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.user_username_already_exists)
      }
    })

    it('Try to register a manager with missing required fields', async () => {
      try {
        const { name, ...rest } = manager
        // @ts-expect-error => name is required
        await noTokenApiInstance.user_signUp(rest, authDataFields)
      } catch (error) {
        assert.strictEqual(typeof error, 'string')
        assert.strictEqual(validationErrorRegEx.test(error), true)
      }
    })
  })

  describe('Login', () => {
    it('Login manager', async () => {
      const { token, expiresIn } = await apiInstance.user_login(managerCredentials, authDataFields)
      assert.strictEqual(typeof token, 'string')
      assert.strictEqual(typeof expiresIn, 'string')
      apiInstance.setToken(token)
    })

    it('Try to login with wrong password', async () => {
      try {
        const { username } = managerCredentials
        await noTokenApiInstance.user_login({ username, password: 'wrongPassword' }, authDataFields)
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.user_password_not_correct)
      }
    })

    it('Try to login with non existing username', async () => {
      try {
        const { password } = managerCredentials
        await noTokenApiInstance.user_login({ username: 'eminem72', password }, authDataFields)
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.user_user_not_exists)
      }
    })
  })

  describe('Get user data', () => {
    it('Get user connected data', async () => {
      const { name, surname, dateOfBirth, phone, sex } = await apiInstance.user_getUserConnected(`{
        name,
        surname,
        dateOfBirth,
        phone,
        sex
      }`)
      assert.strictEqual(name, manager.name)
      assert.strictEqual(surname, manager.surname)
      assert.strictEqual(moment(dateOfBirth).isSame(manager.dateOfBirth), true)
      assert.strictEqual(phone, manager.phone)
      assert.strictEqual(sex, manager.sex)
    })

    it('Try to get user data without token', async () => {
      try {
        await noTokenApiInstance.user_getUserConnected(`{
        name,
        surname,
        dateOfBirth,
        phone,
        sex
      }`)
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.user_unauthenticated)
      }
    })
  })

  describe('Update user data', () => {
    it('Change username ', async () => {
      const newUsername = 'alezen7'
      const ok = await apiInstance.user_changeUsername(newUsername)
      assert.strictEqual(ok, true)
      managerCredentials.username = newUsername
    })

    it('Change password', async () => {
      const newPassword = 'alezen7'
      const ok = await apiInstance.user_changePassword(managerCredentials.password, newPassword)
      assert.strictEqual(ok, true)
      managerCredentials.password = newPassword
    })

    it('Update some user info', async () => {
      const newUserData = {
        name: 'Boban',
        surname: 'Cvetanoski'
      }
      const ok = await apiInstance.user_updateUserConnected(newUserData)
      assert.strictEqual(ok, true)
      const { name, surname } = await apiInstance.user_getUserConnected(`{
        name,
        surname
      }`)
      assert.strictEqual(name, newUserData.name)
      assert.strictEqual(surname, newUserData.surname)
    })

    it('Try to change username without token', async () => {
      try {
        await noTokenApiInstance.user_changeUsername('test')
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.user_unauthenticated)
      }
    })

    it('Try to change password without token', async () => {
      try {
        await noTokenApiInstance.user_changePassword(managerCredentials.password, 'test')
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.user_unauthenticated)
      }
    })

    it('Try to change password with wrong old password', async () => {
      try {
        await apiInstance.user_changePassword('wrongOldPassword', 'test')
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.user_password_not_correct)
      }
    })

    it('Try to set new password equal to new password', async () => {
      try {
        await apiInstance.user_changePassword(managerCredentials.password, managerCredentials.password)
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.user_new_old_password_equal)
      }
    })

    it('Try to update some user info without token', async () => {
      try {
        const newUserData = {
          name: 'Boban',
          surname: 'Cvetanoski'
        }
        await noTokenApiInstance.user_updateUserConnected(newUserData)
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.user_unauthenticated)
      }
    })
  })
})