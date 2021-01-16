import assert from 'assert'
import { MongoDBInstance, MongoState } from '../MongoDB'
import { ZenServer } from '../SDK'
import { describe, it } from 'mocha'
import { validationErrorRegEx, setupTestsuite, TestsuiteSetupOperation } from './helpers'
import ErrorMessages from '../Utils/ErrorMessages'
import { isEqual } from 'lodash'
import { field1, field2 } from './helpers/MockData/fields'

const apiInstance = new ZenServer()
const noTokenApiInstance = new ZenServer()

const setupConf = {
  [TestsuiteSetupOperation.Manager]: true
}

describe('Fields', () => {
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
      await setupTestsuite(setupConf, apiInstance)
    })
  })

  describe('Create', () => {
    it('Create a new field', async () => {
      const { _id, ...body } = field1
      const fieldId = await apiInstance.field.create(body)
      field1._id = fieldId
      const { result } = await apiInstance.field.getList({}, { skip: 0 }, `{ result { _id, type } }`)
      assert.strictEqual(result.length, 1)
      assert.strictEqual(result[0]._id, fieldId)
      assert.strictEqual(result[0].type, field1.type)
    })

    it('Try to create a new field without token', async () => {
      try {
        const { _id, ...body } = field1
        await noTokenApiInstance.field.create(body)
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.user_unauthenticated)
      }
    })

    it('Try to create a new field with missing required fields', async () => {
      try {
        const { _id, price, ...body } = field1
        // @ts-ignore
        await apiInstance.field.create(body)
      } catch (error) {
        assert.strictEqual(typeof error, 'string')
        assert.strictEqual(validationErrorRegEx.test(error), true)
      }
    })
  })

  describe('Delete', () => {
    it('Try to delete an existing field without token', async () => {
      try {
        await noTokenApiInstance.field.delete(field1._id)
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.user_unauthenticated)
      }
    })

    it('Delete an existing field', async () => {
      const done = await apiInstance.field.delete(field1._id)

      assert.strictEqual(done, true)
      const { result } = await apiInstance.field.getList({}, { skip: 0 }, `{ result { _id } }`)
      assert.strictEqual(result.length, 0)
      field1._id = undefined
    })
  })

  describe('Update', () => {
    it('Create 2 new fields', async () => {
      const { _id, ...body } = field1
      const fieldId1 = await apiInstance.field.create(body)
      const { _id: _id2, ...body2 } = field2
      const fieldId2 = await apiInstance.field.create(body2)

      const { result } = await apiInstance.field.getList({}, { skip: 0 }, `{ result { _id, type } }`)
      assert.strictEqual(result.length, 2)
      assert.strictEqual(result[0]._id, fieldId1)
      assert.strictEqual(result[0].type, field1.type)
      assert.strictEqual(result[1]._id, fieldId2)
      assert.strictEqual(result[1].type, field2.type)
      field1._id = fieldId1
      field2._id = fieldId2
    })

    it('Update a field price', async () => {
      const { _id } = field1
      await apiInstance.field.update({
        _id,
        price: 15000
      })

      const { result } = await apiInstance.field.getList({ ids: [_id] }, { skip: 0 }, `{ result { _id, price } }`)
      assert.strictEqual(result.length, 1)
      assert.strictEqual(isEqual(result[0].price, 15000), true)
    })

    it('Update a field\'s name', async () => {
      const { _id } = field1
      const newName = 'Bolbeno arena new name'
      await apiInstance.field.update({
        _id,
        name: newName
      })

      const { result } = await apiInstance.field.getList({ ids: [_id] }, { skip: 0 }, `{ result { _id, name } }`)
      assert.strictEqual(result.length, 1)
      assert.strictEqual(isEqual(result[0].name, newName), true)
    })

    it('Try to update a deleted field\'s name', async () => {
      const { _id } = field1
      await apiInstance.field.delete(_id)
      const { result } = await apiInstance.field.getList({ ids: [_id] }, { skip: 0 }, `{ result { _id } }`)
      assert.strictEqual(result.length, 0)
      try {
        await apiInstance.field.update({ _id, name: 'Some dumb name' })
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.field_update_failed)
      }
    })
  })
})
