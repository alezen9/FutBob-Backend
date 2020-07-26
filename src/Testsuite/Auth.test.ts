import assert from 'assert'
import { get, isEmpty } from 'lodash'
import { MongoDBInstance } from '../MongoDB'
import { FutBobServer } from '../SDK'
import { describe, it } from 'mocha'
import { ShouldSucceed, ShouldFail, validationErrorRegEx } from './helpers'
import { Sex } from '../MongoDB/User/entities'
import ErrorMessages from '../Utils/ErrorMessages'
require('dotenv').config()

const apiInstance = new FutBobServer()
const apiInstance2 = new FutBobServer()

const manager = {
  name: 'Aleksandar',
  surname: 'Gjroeski',
  dateOfBirth: '1993-07-02T22:00:00.000Z',
  phone: '+39 1234567890',
  sex: Sex.Male,
  username: 'alezen9',
  password: 'alezen9'
}

describe('Authentication', () => {
  describe('Clear database', () => {
    it('Should clear database', async () => {
      await MongoDBInstance.clearDb()
    })
  })

  describe('Signup', () => {
    describe(ShouldSucceed, () => {
      it('Registro un nuovo manager', async () => {
        try {
          const { token, expiresIn } = await apiInstance.user_signUp(manager)
          assert.strictEqual(typeof token, 'string')
          assert.strictEqual(typeof expiresIn, 'string')
          apiInstance.setToken(token)
        } catch (error) {
          console.log(error)
        }
      })
    })

    describe(ShouldFail, () => {
      it('Tento di registrare un manager con uno username già occupato', async () => {
        try {
          await apiInstance2.user_signUp(manager)
        } catch (error) {
          assert.strictEqual(error, ErrorMessages.username_already_exists)
        }
      })

      it('Tento di eseguire una registrazione con campi mancanti', async () => {
        try {
          const { name, ...rest } = manager
          await apiInstance2.user_signUp(rest)
        } catch (error) {
          assert.strictEqual(typeof error, 'string')
          assert.strictEqual(validationErrorRegEx.test(error), true)
        }
      })
    })
  })

  // TODO
  // describe('Login', () => {
  //   describe(ShouldSucceed, () => {
  //     it('Login manager', async () => {
  //       try {
  //         const { token, expiresIn } = await apiInstance.user_signUp(manager)
  //         assert.strictEqual(typeof token, 'string')
  //         assert.strictEqual(typeof expiresIn, 'string')
  //         apiInstance.setToken(token)
  //       } catch (error) {
  //         console.log(error)
  //       }
  //     })
  //   })

  //   describe(ShouldFail, () => {
  //     it('Tento di registrare un manager con uno username già occupato', async () => {
  //       try {
  //         await apiInstance2.user_signUp(manager)
  //       } catch (error) {
  //         assert.strictEqual(error, ErrorMessages.username_already_exists)
  //       }
  //     })

  //     it('Tento di eseguire una registrazione con campi mancanti', async () => {
  //       try {
  //         const { name, ...rest } = manager
  //         await apiInstance2.user_signUp(rest)
  //       } catch (error) {
  //         assert.strictEqual(typeof error, 'string')
  //         assert.strictEqual(validationErrorRegEx.test(error), true)
  //       }
  //     })
  //   })
  // })
})
