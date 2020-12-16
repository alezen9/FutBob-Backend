import assert from 'assert'
import { MongoDBInstance, MongoState } from '../MongoDB'
import { FutBobServer } from '../SDK'
import { describe, it } from 'mocha'
import { validationErrorRegEx, setupTestsuite, TestsuiteSetupStep } from './helpers'
import ErrorMessages from '../Utils/ErrorMessages'
import { freeAgent1, freeAgent2 } from './helpers/MockData/freeAgents'

const apiInstance = new FutBobServer()
const noTokenApiInstance = new FutBobServer()

describe('Free Agent', () => {
  describe('Clear database', () => {
    it('Should clear database', async () => {
      if (MongoDBInstance.state === MongoState.Disconnected) {
        await MongoDBInstance.startConnection()
      }
      await MongoDBInstance.clearDb()
    })
  })

  describe('Setup', () => {
    it('Register a new manager', async () => {
      await setupTestsuite(TestsuiteSetupStep.WithManager, apiInstance)
    })
  })

  describe('Create', () => {
    it('Create a new free agent', async () => {
      const { _id, ...body } = freeAgent1
      const freeAgentId1: string = await apiInstance.freeAgent_createFreeAgent(body)
      freeAgent1._id = freeAgentId1
      const res = await apiInstance.freeAgent_getFreeAgents({}, `{ result { _id, name, surname } }`)
      const freeAgents: Array<{ _id: string, name: string, surname: string }> = res.result
      assert.strictEqual(freeAgents.length, 1)
      assert.strictEqual(freeAgents[0]._id, freeAgentId1)
      assert.strictEqual(freeAgents[0].name, freeAgent1.name)
      assert.strictEqual(freeAgents[0].surname, freeAgent1.surname)
    })

    it('Try to create a new free agent without token', async () => {
      try {
        const { _id, ...body } = freeAgent1
        await noTokenApiInstance.freeAgent_createFreeAgent(body)
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.user_unauthenticated)
      }
    })

    it('Try to create a new free agent with missing required fields', async () => {
      try {
        const { _id, name, ...body } = freeAgent1
        // @ts-expect-error => name is required
        await apiInstance.freeAgent_createFreeAgent(body)
      } catch (error) {
        assert.strictEqual(typeof error, 'string')
        assert.strictEqual(validationErrorRegEx.test(error), true)
      }
    })
  })
  
  describe('Delete', () => {
    it('Try to delete an existing free agent without token', async () => {
      try {
      const { _id } = freeAgent1
      const done: boolean = await noTokenApiInstance.freeAgent_deleteFreeAgent(_id)
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.user_unauthenticated)
      }
    })

     it('Delete an existing free agent', async () => {
      const { _id } = freeAgent1
      const done: boolean = await apiInstance.freeAgent_deleteFreeAgent(_id)

      assert.strictEqual(done, true)
      const res = await apiInstance.freeAgent_getFreeAgents({}, `{ result { _id } }`)
      const freeAgents: Array<{_id: string}> = res.result
      assert.strictEqual(freeAgents.length, 0)
      freeAgent1._id = undefined
    })
  })

  describe('Update', () => {
     it('Create 2 new free agents', async () => {
      const { _id, ...body } = freeAgent1
      const freeAgentId1: string = await apiInstance.freeAgent_createFreeAgent(body)
      const { _id: _id2, ...body2 } = freeAgent2
      const freeAgentId2: string = await apiInstance.freeAgent_createFreeAgent(body2)

      const res = await apiInstance.freeAgent_getFreeAgents({}, `{ result { _id } }`)
      const freeAgents: Array<{ _id: string }> = res.result
      assert.strictEqual(freeAgents.length, 2)
      assert.strictEqual(freeAgents[0]._id, freeAgentId1)
      assert.strictEqual(freeAgents[1]._id, freeAgentId2)
      freeAgent1._id = freeAgentId1
      freeAgent2._id = freeAgentId2
    })
  })
})
