import 'reflect-metadata'
import assert from 'assert'
import { MongoDBInstance, MongoState } from '../MongoDB'
import { describe, it } from 'mocha'
import { validationErrorRegEx, setupTestsuite, TestsuiteSetupOperation } from './helpers'
import ErrorMessages from '../Utils/ErrorMessages'
import { ZenServer } from '../SDK'
import { field1, field2 } from './helpers/MockData/fields'
import dayjs from 'dayjs'
require('dotenv').config()

const apiInstance = new ZenServer()
const noTokenApiInstance = new ZenServer()

const setupConf = {
  [TestsuiteSetupOperation.Manager]: true
}

describe('Appointment', () => {
  describe('Clear database', () => {
    it.skip('Should clear database', async () => {
      if (MongoDBInstance.state === MongoState.Disconnected) {
        await MongoDBInstance.startConnection()
      }
      if (process.env.NODE_ENV === 'development') await MongoDBInstance.clearDb()
    })
  })

  describe('Setup', () => {
    it.skip('Register a new manager', async () => {
      await setupTestsuite(setupConf, apiInstance)
    })
  })

  describe('Create', () => {
    it('Create an appointment', async () => {
      const { _id, ...body } = field1
      const fieldId = await apiInstance.field.create(body)
      field1._id = fieldId
      try {
        const start = dayjs().add(7, 'days').toISOString()
        const end = dayjs(start).add(2, 'hours').toISOString()
        const appointment = await apiInstance.appointment.create({
          field: fieldId,
          start,
          end,
          pricePerPlayer: 300,
          notes: 'prova aleks first appointment!'
        })
      } catch (error) {
        console.log(error)
      }

      const { result } = await apiInstance.appointment.getList({}, { skip: 0 }, `{ result { _id } }`)
      assert.strictEqual(result.length, 1)
      // assert.strictEqual(result[0]._id, freeAgentId1)
      // assert.strictEqual(result[0].name, freeAgent1.name)
      // assert.strictEqual(result[0].surname, freeAgent1.surname)
    })

    // it('Try to create a new free agent without token', async () => {
    //   try {
    //     const { _id, ...body } = freeAgent1
    //     await noTokenApiInstance.freeAgent.create(body)
    //   } catch (error) {
    //     assert.strictEqual(error, ErrorMessages.user_unauthenticated)
    //   }
    // })

    // it('Try to create a new free agent with missing required fields', async () => {
    //   try {
    //     const { _id, name, ...body } = freeAgent1
    //     // @ts-ignore
    //     await apiInstance.freeAgent.create(body)
    //   } catch (error) {
    //     assert.strictEqual(typeof error, 'string')
    //     assert.strictEqual(validationErrorRegEx.test(error), true)
    //   }
    // })
  })
})
