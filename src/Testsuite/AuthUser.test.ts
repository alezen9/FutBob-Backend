import assert from 'assert'
import { MongoDBInstance, MongoState } from '../MongoDB'
import { describe, it } from 'mocha'
import { validationErrorRegEx } from './helpers'
import ErrorMessages from '../Utils/ErrorMessages'
import dayjs from 'dayjs'
import { manager1, manager1Credentials } from './helpers/MockData/managers'
import { ZenServer } from '../SDK'

const apiInstance = new ZenServer()
const noTokenApiInstance = new ZenServer()

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
      const { token, expiresIn } = await apiInstance.auth.signUp(manager1, authDataFields)
      assert.strictEqual(typeof token, 'string')
      assert.strictEqual(typeof expiresIn, 'string')
    })

    it('Try to register a manager with another user\'s username', async () => {
      try {
        await noTokenApiInstance.auth.signUp(manager1, authDataFields)
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.user_username_already_exists)
      }
    })

    it('Try to register a manager with missing required fields', async () => {
      try {
        const { name, ...rest } = manager1
        // @ts-ignore
        await noTokenApiInstance.auth.signUp(rest, authDataFields)
      } catch (error) {
        assert.strictEqual(typeof error, 'string')
        assert.strictEqual(validationErrorRegEx.test(error), true)
      }
    })
  })

  describe('Login', () => {
    it('Login manager', async () => {
      const { token, expiresIn } = await apiInstance.auth.login(manager1Credentials, authDataFields)
      assert.strictEqual(typeof token, 'string')
      assert.strictEqual(typeof expiresIn, 'string')
      apiInstance.auth.setToken(token)
    })

    it('Try to login with wrong password', async () => {
      try {
        const { username } = manager1Credentials
        await noTokenApiInstance.auth.login({ username, password: 'wrongPassword' }, authDataFields)
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.user_password_not_correct)
      }
    })

    it('Try to login with non existing username', async () => {
      try {
        const { password } = manager1Credentials
        await noTokenApiInstance.auth.login({ username: 'eminem72', password }, authDataFields)
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.user_user_not_exists)
      }
    })
  })

  describe('Get user data', () => {
    it('Get user connected data', async () => {
      const { name, surname, dateOfBirth, phone, sex } = await apiInstance.user.getMe(`{
        name,
        surname,
        dateOfBirth,
        phone,
        sex
      }`)
      assert.strictEqual(name, manager1.name)
      assert.strictEqual(surname, manager1.surname)
      assert.strictEqual(dayjs(dateOfBirth).isSame(manager1.dateOfBirth), true)
      assert.strictEqual(phone, manager1.phone)
      assert.strictEqual(sex, manager1.sex)
    })

    it('Try to get user data without token', async () => {
      try {
        await noTokenApiInstance.user.getMe(`{
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
      const ok = await apiInstance.user.changeMyUsername(newUsername)
      assert.strictEqual(ok, true)
      manager1Credentials.username = newUsername
    })

    it('Change password', async () => {
      const newPassword = 'alezen7'
      const ok = await apiInstance.user.changeMyPassword(manager1Credentials.password, newPassword)
      assert.strictEqual(ok, true)
      manager1Credentials.password = newPassword
    })

    it('Update some user info', async () => {
      const newUserData = {
        name: 'Boban',
        surname: 'Cvetanoski'
      }
      const ok = await apiInstance.user.updateMe(newUserData)
      assert.strictEqual(ok, true)
      const { name, surname } = await apiInstance.user.getMe(`{
        name,
        surname
      }`)
      assert.strictEqual(name, newUserData.name)
      assert.strictEqual(surname, newUserData.surname)
    })

    it('Try to change username without token', async () => {
      try {
        await noTokenApiInstance.user.changeMyUsername('test')
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.user_unauthenticated)
      }
    })

    it('Try to change password without token', async () => {
      try {
        await noTokenApiInstance.user.changeMyPassword(manager1Credentials.password, 'test')
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.user_unauthenticated)
      }
    })

    it('Try to change password with wrong old password', async () => {
      try {
        await apiInstance.user.changeMyPassword('wrongOldPassword', 'test')
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.user_password_not_correct)
      }
    })

    it('Try to set new password equal to new password', async () => {
      try {
        await apiInstance.user.changeMyPassword(manager1Credentials.password, manager1Credentials.password)
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
        await noTokenApiInstance.user.updateMe(newUserData)
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.user_unauthenticated)
      }
    })
  })
})
