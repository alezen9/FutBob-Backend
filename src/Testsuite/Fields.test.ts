import assert from 'assert'
import { MongoDBInstance, MongoState } from '../MongoDB'
import { FutBobServer } from '../SDK'
import { describe, it } from 'mocha'
import { validationErrorRegEx, setupTestsuite, TestsuiteSetupStep } from './helpers'
import ErrorMessages from '../Utils/ErrorMessages'
import { isEqual }from 'lodash'
import { FieldState, FieldType } from '../MongoDB/Fields/Entities'

const apiInstance = new FutBobServer()
const noTokenApiInstance = new FutBobServer()

const fieldBolbeno = {
   _id: undefined,
   type: FieldType.Outdoor,
   name: 'Bolbeno arena',
   measurements: {
      width: 15,
      height: 25
   },
   cost: 1200,
   state: FieldState.NotGreatNotTerrible,
   location: {
      type: 'Point',
      coordinates: [46.03369715,10.7372789]
   }
}

const fieldTione = {
   _id: undefined,
   type: FieldType.Outdoor,
   name: 'Tione arena',
   measurements: {
      width: 17,
      height: 28
   },
   cost: 1000,
   state: FieldState.Terrible,
   location: {
      type: 'Point',
      coordinates: [46.03362,10.728869]
   }
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
      await setupTestsuite(TestsuiteSetupStep.WithManager, apiInstance)
    })
  })

  describe('Create', () => {
    it('Create a new field', async () => {
      const { _id, ...body } = fieldBolbeno
      const fieldId: string = await apiInstance.field_createField(body)
      fieldBolbeno._id = fieldId
      const res = await apiInstance.field_getFields({}, `{ result { _id, type } }`)
      const fields: Array<{ _id: string, type: FieldType }> = res.result
      assert.strictEqual(fields.length, 1)
      assert.strictEqual(fields[0]._id, fieldId)
      assert.strictEqual(fields[0].type, fieldBolbeno.type)
    })

    it('Try to create a new field without token', async () => {
      try {
        const { _id, ...body } = fieldBolbeno
        await noTokenApiInstance.field_createField(body)
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.user_unauthenticated)
      }
    })

    it('Try to create a new field with missing required fields', async () => {
      try {
        const { _id, cost, ...body } = fieldBolbeno
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
      const { _id } = fieldBolbeno
      const done: boolean = await noTokenApiInstance.field_deleteField({ _id })
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.user_unauthenticated)
      }
    })

     it('Delete an existing field', async () => {
      const { _id } = fieldBolbeno
      const done: boolean = await apiInstance.field_deleteField({ _id })

      assert.strictEqual(done, true)
      const res = await apiInstance.field_getFields({}, `{ result { _id } }`)
      const fields: Array<{_id: string}> = res.result
      assert.strictEqual(fields.length, 0)
      fieldBolbeno._id = undefined
    })
  })

  describe('Update', () => {
     it('Create 2 new fields', async () => {
      const { _id, ...body } = fieldBolbeno
      const fieldId1: string = await apiInstance.field_createField(body)
      const { _id: _id2, ...body2 } = fieldTione
      const fieldId2: string = await apiInstance.field_createField(body2)

      const res = await apiInstance.field_getFields({}, `{ result { _id, type } }`)
      const fields: Array<{ _id: string, type: FieldType }> = res.result
      assert.strictEqual(fields.length, 2)
      assert.strictEqual(fields[0]._id, fieldId1)
      assert.strictEqual(fields[0].type, fieldBolbeno.type)
      assert.strictEqual(fields[1]._id, fieldId2)
      assert.strictEqual(fields[1].type, fieldTione.type)
      fieldBolbeno._id = fieldId1
      fieldTione._id = fieldId2
    })

    it('Update a field cost', async () => {
      const { _id } = fieldBolbeno
      const done: boolean = await apiInstance.field_updateField({
        _id,
        cost: 15000
      })

      const res = await apiInstance.field_getFields({ ids: [_id]}, `{ result { _id, cost } }`)
      const fields: Array<{ _id: string, type: FieldType, cost: number }> = res.result
      assert.strictEqual(fields.length, 1)
      assert.strictEqual(isEqual(fields[0].cost, 15000), true)
    })

    it('Update a field\'s name', async () => {
      const { _id } = fieldBolbeno
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
      const { _id } = fieldBolbeno
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
