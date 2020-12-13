import assert from 'assert'
import { MongoDBInstance, MongoState } from '../MongoDB'
import { FutBobServer } from '../SDK'
import { describe, it } from 'mocha'
import { validationErrorRegEx, setupTestsuite, TestsuiteSetupStep } from './helpers'
import ErrorMessages from '../Utils/ErrorMessages'
import { isEqual }from 'lodash'
import { FieldType } from '../MongoDB/Fields/Entities'
import { field1, field2 } from './helpers/MockData/fields'

const apiInstance = new FutBobServer()
const noTokenApiInstance = new FutBobServer()

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
      await setupTestsuite(TestsuiteSetupStep.WithPlayers, apiInstance)
    })
  })

  describe('Create', () => {
    it('Create a new field', async () => {
      const { _id, ...body } = field1
      const fieldId: string = await apiInstance.field_createField(body)
      field1._id = fieldId
      const res = await apiInstance.field_getFields({}, `{ result { _id, type } }`)
      const fields: Array<{ _id: string, type: FieldType }> = res.result
      assert.strictEqual(fields.length, 1)
      assert.strictEqual(fields[0]._id, fieldId)
      assert.strictEqual(fields[0].type, field1.type)
    })

    it('Try to create a new field without token', async () => {
      try {
        const { _id, ...body } = field1
        await noTokenApiInstance.field_createField(body)
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.user_unauthenticated)
      }
    })

    it('Try to create a new field with missing required fields', async () => {
      try {
        const { _id, price, ...body } = field1
        // @ts-expect-error => playerData is required
        await apiInstance.field_createField(body)
      } catch (error) {
        assert.strictEqual(typeof error, 'string')
        assert.strictEqual(validationErrorRegEx.test(error), true)
      }
    })
  })
  
  describe('Delete', () => {
    it('Try to delete an existing field without token', async () => {
      try {
      const { _id } = field1
      const done: boolean = await noTokenApiInstance.field_deleteField({ _id })
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.user_unauthenticated)
      }
    })

     it('Delete an existing field', async () => {
      const { _id } = field1
      const done: boolean = await apiInstance.field_deleteField({ _id })

      assert.strictEqual(done, true)
      const res = await apiInstance.field_getFields({}, `{ result { _id } }`)
      const fields: Array<{_id: string}> = res.result
      assert.strictEqual(fields.length, 0)
      field1._id = undefined
    })
  })

  describe('Update', () => {
     it('Create 2 new fields', async () => {
      const { _id, ...body } = field1
      const fieldId1: string = await apiInstance.field_createField(body)
      const { _id: _id2, ...body2 } = field2
      const fieldId2: string = await apiInstance.field_createField(body2)

      const res = await apiInstance.field_getFields({}, `{ result { _id, type } }`)
      const fields: Array<{ _id: string, type: FieldType }> = res.result
      assert.strictEqual(fields.length, 2)
      assert.strictEqual(fields[0]._id, fieldId1)
      assert.strictEqual(fields[0].type, field1.type)
      assert.strictEqual(fields[1]._id, fieldId2)
      assert.strictEqual(fields[1].type, field2.type)
      field1._id = fieldId1
      field2._id = fieldId2
    })

    it('Update a field price', async () => {
      const { _id } = field1
      const done: boolean = await apiInstance.field_updateField({
        _id,
        price: 15000
      })

      const res = await apiInstance.field_getFields({ ids: [_id]}, `{ result { _id, price } }`)
      const fields: Array<{ _id: string, type: FieldType, price: number }> = res.result
      assert.strictEqual(fields.length, 1)
      assert.strictEqual(isEqual(fields[0].price, 15000), true)
    })

    it('Update a field\'s name', async () => {
      const { _id } = field1
      const newName = 'Bolbeno arena new name'
      const done: boolean = await apiInstance.field_updateField({
        _id,
        name: newName
      })

      const res = await apiInstance.field_getFields({ ids: [_id]}, `{ result { _id, name } }`)
      const fields: Array<{ _id: string, type: FieldType, name: string }> = res.result
      assert.strictEqual(fields.length, 1)
      assert.strictEqual(isEqual(fields[0].name, newName), true)
    })

    it('Try to update a deleted field\'s name', async () => {
      const { _id } = field1
      await apiInstance.field_deleteField({ _id })
      const res = await apiInstance.field_getFields({ ids: [_id]}, `{ result { _id } }`)
      const fields: Array<{ _id: string }> = res.result
      assert.strictEqual(fields.length, 0)
      try {
        await apiInstance.field_updateField({ _id, name: 'Some dumb name' })
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.field_update_not_possible)
      }
    })

  })
})
