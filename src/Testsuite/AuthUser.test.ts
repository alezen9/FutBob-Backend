import 'reflect-metadata'
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

describe('Authentication', () => {
  let ID
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
      // send email
      const { password, ...body } = manager1
      const emailSent = await apiInstance.auth.requestRegistration(body)
      if (!emailSent) throw new Error(ErrorMessages.system_confirmation_email_not_sent)
      // get confirmation code from db
      const user = await MongoDBInstance.collection.user.findOne({ 'credentials.email': manager1.email })
      if (!user) throw new Error(ErrorMessages.user_user_not_exists)
      const { token } = await apiInstance.auth.finalizeRegistration({
        unverifiedCode: user.credentials.verifyAccount.code.value,
        password,
        confirmPassword: password
      }, '{ token }')
      apiInstance.auth.setToken(token)
      assert.strictEqual(typeof token, 'string')
    })

    it('Try to register a manager with another user\'s email', async () => {
      try {
        const { password, ...body } = manager1
        await noTokenApiInstance.auth.requestRegistration(body)
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.user_email_already_exists)
      }
    })

    it('Try to register a manager with missing required fields', async () => {
      try {
        const { name, ...rest } = manager1
        // @ts-ignore
        await noTokenApiInstance.auth.requestRegistration(rest)
      } catch (error) {
        assert.strictEqual(typeof error, 'string')
        assert.strictEqual(validationErrorRegEx.test(error), true)
      }
    })
  })

  describe('Login', () => {
    it('Login manager', async () => {
      const { token } = await apiInstance.auth.login(manager1Credentials, '{ token }')
      assert.strictEqual(typeof token, 'string')
      apiInstance.auth.setToken(token)
    })

    it('Try to login with wrong password', async () => {
      try {
        const { email } = manager1Credentials
        await noTokenApiInstance.auth.login({ email, password: 'wrongPassword' }, '{ token }')
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.user_password_not_correct)
      }
    })

    it('Try to login with non existing email', async () => {
      try {
        const { password } = manager1Credentials
        await noTokenApiInstance.auth.login({ email: 'test@email.com', password }, '{ token }')
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.user_user_not_exists)
      }
    })
  })

  describe('Get user data', () => {
    it('Get user connected data', async () => {
      const { _id, registry: { name, surname, dateOfBirth, phone, sex } } = await apiInstance.user.getMe(`{
        _id,
        registry {
          name,
          surname,
          dateOfBirth,
          phone,
          sex
        }
      }`)
      ID = _id
      assert.strictEqual(name, manager1.name)
      assert.strictEqual(surname, manager1.surname)
      assert.strictEqual(dayjs(dateOfBirth).isSame(manager1.dateOfBirth), true)
      assert.strictEqual(phone, manager1.phone)
      assert.strictEqual(sex, manager1.sex)
    })

    it('Try to get user data without token', async () => {
      try {
        await noTokenApiInstance.user.getMe(`{
        registry {
          name,
          surname,
          dateOfBirth,
          phone,
          sex
        }
      }`)
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.user_unauthenticated)
      }
    })
  })

  describe('Update user data', () => {
    it('Change password', async () => {
      const newPassword = 'alezen7'
      const body = {
        oldPassword: manager1Credentials.password,
        newPassword
      }
      const ok = await apiInstance.user.changeMyPassword(body)
      assert.strictEqual(ok, true)
      manager1Credentials.password = newPassword
    })

    it('Reset password', async () => {
      // send email
      const { email } = manager1
      const newPassword = 'alezen99'
      const emailSent = await apiInstance.auth.requestResetPassword(email)
      if (!emailSent) throw new Error(ErrorMessages.system_confirmation_email_not_sent)
      // get reset code from db
      const user = await MongoDBInstance.collection.user.findOne({ 'credentials.email': email })
      if (!user) throw new Error(ErrorMessages.user_user_not_exists)
      const { token } = await apiInstance.auth.finalizeResetPassword({
        unverifiedCode: user.credentials.resetPassword.code.value,
        password: newPassword,
        confirmPassword: newPassword
      }, '{ token }')
      manager1Credentials.password = newPassword
      apiInstance.auth.setToken(token)
      assert.strictEqual(typeof token, 'string')
    })

    it('Update some user info', async () => {
      const newUserData = {
        _id: ID,
        name: 'Boban',
        surname: 'Cvetanoski'
      }
      const ok = await apiInstance.user.update(newUserData)
      assert.strictEqual(ok, true)
      const { registry: { name, surname } } = await apiInstance.user.getMe(`{
        registry {
          name,
          surname
        }
      }`)
      assert.strictEqual(name, newUserData.name)
      assert.strictEqual(surname, newUserData.surname)
    })

    it('Try to change password without token', async () => {
      try {
        await noTokenApiInstance.user.changeMyPassword({
          oldPassword: manager1Credentials.password,
          newPassword: 'test'
        })
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.user_unauthenticated)
      }
    })

    it('Try to change password with wrong old password', async () => {
      try {
        await apiInstance.user.changeMyPassword({
          oldPassword: 'wrongOldPassword',
          newPassword: 'test'
        })
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.user_password_not_correct)
      }
    })

    it('Try to set new password equal to new password', async () => {
      try {
        await apiInstance.user.changeMyPassword({
          oldPassword: manager1Credentials.password,
          newPassword: manager1Credentials.password
        })
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.user_new_old_password_equal)
      }
    })

    it('Try to update some user info without token', async () => {
      try {
        const newUserData = {
          _id: ID,
          name: 'Boban',
          surname: 'Cvetanoski'
        }
        await noTokenApiInstance.user.update(newUserData)
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.user_unauthenticated)
      }
    })
  })
})
