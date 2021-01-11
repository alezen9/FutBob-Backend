import { List } from '../../../MongoDB/Entities'
import ErrorMessages from '../../../Utils/ErrorMessages'
import { MongoDBInstance } from '../../../MongoDB'
import { ObjectId } from 'mongodb'
import { isEmpty } from 'lodash'
import cleanDeep from 'clean-deep'
import { checkPrivileges } from '../../../Middleware/isAuth'
import dayjs from 'dayjs'
import { mongoFreeAgent } from '../../../MongoDB/FreeAgent'
import { FreeAgent } from '../../../MongoDB/FreeAgent/Entities'

const FreeAgentResolver = {
  Query: {
    getFreeAgents: async (_, { freeAgentFilters }, { req }) => {
      if (!req.isAuth) throw new Error(ErrorMessages.user_unauthenticated)
      const result: List<FreeAgent> = await mongoFreeAgent.getFreeAgents(freeAgentFilters, req.idUser)
      return result
    }
  },
  Mutation: {
    createFreeAgent: async (_, { createFreeAgentInput }, { req }) => {
      try {
        if (!req.isAuth) throw new Error(ErrorMessages.user_unauthenticated)
        checkPrivileges(req)
        const { name, surname } = createFreeAgentInput
        if (!name || !surname) throw new Error(ErrorMessages.freeAgent_missing_information)
        const FreeAgentId = await mongoFreeAgent.createFreeAgent(createFreeAgentInput, req.idUser)
        return FreeAgentId
      } catch (error) {
        throw error
      }
    },
    updateFreeAgent: async (_, { updateFreeAgentInput }, { req }) => {
      if (!req.isAuth) throw new Error(ErrorMessages.user_unauthenticated)
      checkPrivileges(req)
      const { _id, name, surname } = updateFreeAgentInput

      if (isEmpty(cleanDeep(updateFreeAgentInput))) return true

      const updatedFreeAgent = new FreeAgent()
      if (name !== undefined) updatedFreeAgent.name = name
      if (surname !== undefined) updatedFreeAgent.surname = surname
      updatedFreeAgent.updatedAt = dayjs().toDate()

      const { modifiedCount } = await MongoDBInstance.collection.freeAgent.updateOne(
        { _id: new ObjectId(_id), createdBy: new ObjectId(req.idUser) },
        { $set: updatedFreeAgent }
      )
      
      if (modifiedCount === 0) throw new Error(ErrorMessages.freeAgent_update_failed)
      return true
    },
    deleteFreeAgent: async (_, { _id }, { req }) => {
      if (!req.isAuth) throw new Error(ErrorMessages.user_unauthenticated)
      checkPrivileges(req)
      MongoDBInstance.collection.freeAgent.deleteOne({ _id: new ObjectId(_id) })
      return true
    }
  }
}

export default FreeAgentResolver
