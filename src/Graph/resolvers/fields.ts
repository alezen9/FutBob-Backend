import { List, Privilege } from '../../MongoDB/Entities'
import ErrorMessages from '../../Utils/ErrorMessages'
import { MongoDBInstance } from '../../MongoDB'
import { ObjectId } from 'mongodb'
import { isEmpty, get } from 'lodash'
import cleanDeep from 'clean-deep'
import { checkPrivileges } from '../../Middleware/isAuth'
import moment from 'moment'
import { mongoFields } from '../../MongoDB/Fields'
import { Field } from '../../MongoDB/Fields/Entities'

const fieldsResolver = {
  Query: {
    getFields: async (_, { fieldsFilters }, { req }) => {
      if (!req.isAuth) throw new Error(ErrorMessages.user_unauthenticated)
      const res: List<Field> = await mongoFields.getFields(fieldsFilters)
      return res
    }
  },
  Mutation: {
    createField: async (_, { createFieldInput }, { req }) => {
      try {
        if (!req.isAuth) throw new Error(ErrorMessages.user_unauthenticated)
        checkPrivileges(req)
        const idField = await mongoFields.createField(createFieldInput)
        return idField
      } catch (error) {
        throw error
      }
    },
    updateField: async (_, { updateFieldInput }, { req }) => {
      if (!req.isAuth) throw new Error(ErrorMessages.user_unauthenticated)
      const { _id, type, name, measurements, state, cost, location } = updateFieldInput

      if (isEmpty(cleanDeep(updateFieldInput))) return true

      const updatedField = new Field()
      if (state !== undefined) updatedField.state = state
      if (type !== undefined) updatedField.type = type
      if (cost !== undefined && !isNaN(cost) && cost >= 0) updatedField.cost = cost
      if (name !== undefined) updatedField.name = name
      if (measurements !== undefined && get(measurements, 'width', null)) updatedField.measurements.width = measurements.width
      if (measurements !== undefined && get(measurements, 'height', null)) updatedField.measurements.height = measurements.height
      if (location !== undefined && get(location, 'coordinates', []).length) updatedField.location.coordinates = location.coordinates
      updatedField.updatedAt = moment().toDate()

      const { modifiedCount } = await MongoDBInstance.collection.fields.updateOne(
        { _id: new ObjectId(_id) },
        { $set: updatedField }
      )
      
      if (modifiedCount === 0) throw new Error(ErrorMessages.field_update_not_possible)
      return true
    },
    deleteField: async (_, { deleteFieldInput }, { req }) => {
      if (!req.isAuth) throw new Error(ErrorMessages.user_unauthenticated)
      const { _id } = deleteFieldInput
      // to add check if there is at least a match done on this field then NO delete
      await MongoDBInstance.collection.fields.deleteOne({ _id: new ObjectId(_id) })

      return true
    }
  }
}

export default fieldsResolver
