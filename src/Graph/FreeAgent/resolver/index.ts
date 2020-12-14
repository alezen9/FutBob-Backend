import { List } from '../../../MongoDB/Entities'
import ErrorMessages from '../../../Utils/ErrorMessages'
import { MongoDBInstance } from '../../../MongoDB'
import { ObjectId } from 'mongodb'
import { isEmpty } from 'lodash'
import cleanDeep from 'clean-deep'
import { checkPrivileges } from '../../../Middleware/isAuth'
import moment from 'moment'
import { mongoFreeAgentPlayer } from '../../../MongoDB/FreeAgentPlayer'
import { FreeAgentPlayer } from '../../../MongoDB/FreeAgentPlayer/Entities'

const freeAgentPlayerResolver = {
  Query: {
    getFreeAgentPlayers: async (_, { freeAgentPlayerFilters }, { req }) => {
      if (!req.isAuth) throw new Error(ErrorMessages.user_unauthenticated)
      const result: List<FreeAgentPlayer> = await mongoFreeAgentPlayer.getFreeAgentPlayers(freeAgentPlayerFilters, req.idUser)
      return result
    }
  },
  Mutation: {
    createFreeAgentPlayer: async (_, { createFreeAgentPlayerInput }, { req }) => {
      try {
        if (!req.isAuth) throw new Error(ErrorMessages.user_unauthenticated)
        checkPrivileges(req)
        const { name, surname } = createFreeAgentPlayerInput
        if (!name || !surname) throw new Error(ErrorMessages.freeAgentPlayer_missing_information)
        const freeAgentPlayerId = await mongoFreeAgentPlayer.createFreeAgentPlayer(createFreeAgentPlayerInput, req.idUser)
        return freeAgentPlayerId
      } catch (error) {
        throw error
      }
    },
    updatePlayer: async (_, { updateFreeAgentPlayerInput }, { req }) => {
      if (!req.isAuth) throw new Error(ErrorMessages.user_unauthenticated)
      checkPrivileges(req)
      const { _id, name, surname } = updateFreeAgentPlayerInput

      if (isEmpty(cleanDeep(updateFreeAgentPlayerInput))) return true

      const updatedFreeAgentPlayerInput = new FreeAgentPlayer()
      if (name !== undefined) updatedFreeAgentPlayerInput.name = name
      if (surname !== undefined) updatedFreeAgentPlayerInput.surname = surname
      updatedFreeAgentPlayerInput.updatedAt = moment().toDate()

      const { modifiedCount } = await MongoDBInstance.collection.freeAgentPlayer.updateOne(
        { _id: new ObjectId(_id), createdBy: new ObjectId(req.idUser) },
        { $set: updatedFreeAgentPlayerInput }
      )
      
      if (modifiedCount === 0) throw new Error(ErrorMessages.freeAgentPlayer_update_not_possible)
      return true
    },
   //  deletePlayer: async (_, { deletePlayerInput }, { req }) => {
   //    if (!req.isAuth) throw new Error(ErrorMessages.user_unauthenticated)
   //    checkPrivileges(req)
   //    const { _id, idUser, type } = deletePlayerInput
   //    const promises = []

   //    // delete player from player collection
   //    promises.push(MongoDBInstance.collection.player.deleteOne({ _id: new ObjectId(_id), user: new ObjectId(idUser), createdBy: new ObjectId(req.idUser) }))
   //    // delete player from user collection
   //    promises.push(MongoDBInstance.collection.user.updateOne(
   //      { _id: new ObjectId(idUser), createdBy: new ObjectId(req.idUser) },
   //      { $set: { ...type === PlayerType.Football
   //        ? { footballPlayer: null }
   //        : { futsalPlayer: null }
   //      } }
   //    ))

   //    await Promise.all(promises)
   //    playerLoader.clear(_id)

   //    return true
   //  }
  }
}

export default freeAgentPlayerResolver
