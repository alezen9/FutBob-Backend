import { mongoPlayer } from '../../../MongoDB/Player'
import { List, Privilege } from '../../../MongoDB/Entities'
import ErrorMessages from '../../../Utils/ErrorMessages'
import { MongoDBInstance } from '../../../MongoDB'
import { ObjectId } from 'mongodb'
import { isEmpty } from 'lodash'
import cleanDeep from 'clean-deep'
import { mongoUser } from '../../../MongoDB/User'
import { checkPrivileges } from '../../../Middleware/isAuth'
import { Player } from '../../../MongoDB/Player/Entities'
import dayjs from 'dayjs'
import { gql_Player, playerLoader } from './transform'
import { normalizeUpdateObject } from '../../../Utils/helpers'

const playerResolver = {
  Query: {
    getPlayers: async (_, { playerFilters }, { req }) => {
      if (!req.isAuth) throw new Error(ErrorMessages.user_unauthenticated)
      const { result, ...rest }: List<Player> = await mongoPlayer.getPlayers(playerFilters, req.idUser)
      return {
        ...rest,
        result: result.map(gql_Player)
      }
    }
  },
  Mutation: {
    createPlayer: async (_, { createPlayerInput }, { req }) => {
      try {
        if (!req.isAuth) throw new Error(ErrorMessages.user_unauthenticated)
        checkPrivileges(req)
        const { userId, userData, playerData } = createPlayerInput
        if (!userId && (!userData || isEmpty(userData))) throw new Error(ErrorMessages.player_user_not_specified)
        let idUser = userId
        if (!idUser) {
          idUser = await mongoUser.createUser({ ...userData, privilege: Privilege.User }, req.idUser)
        }
        const idPlayer = await mongoPlayer.createPlayer({ ...playerData, idUser }, req.idUser)
        return idPlayer
      } catch (error) {
        throw error
      }
    },
    updatePlayer: async (_, { updatePlayerInput }, { req }) => {
      if (!req.isAuth) throw new Error(ErrorMessages.user_unauthenticated)
      checkPrivileges(req)
      const { _id, positions = [], state, score } = updatePlayerInput

      if (isEmpty(cleanDeep(updatePlayerInput))) return true

      const updatedPlayer = new Player()
      if (positions.length) updatedPlayer.positions = positions
      if (state !== undefined) updatedPlayer.state = state
      if(score) updatedPlayer.score = mongoPlayer.assignScoreValues({ score })
      updatedPlayer.updatedAt = dayjs().toDate()

      const { result } = await MongoDBInstance.collection.player.updateOne(
        { _id: new ObjectId(_id), createdBy: new ObjectId(req.idUser) },
        { $set: normalizeUpdateObject(updatedPlayer) }
      )
      
      if (!result.ok) throw new Error(ErrorMessages.player_update_failed)
      playerLoader.clear(_id)
      return true
    },
    deletePlayer: async (_, { deletePlayerInput }, { req }) => {
      if (!req.isAuth) throw new Error(ErrorMessages.user_unauthenticated)
      checkPrivileges(req)
      const { _id, idUser } = deletePlayerInput
      const promises = []

      // delete player from player collection
      promises.push(MongoDBInstance.collection.player.deleteOne({ _id: new ObjectId(_id), user: new ObjectId(idUser), createdBy: new ObjectId(req.idUser) }))
      // delete player from user collection
      promises.push(MongoDBInstance.collection.user.updateOne(
        { _id: new ObjectId(idUser), createdBy: new ObjectId(req.idUser) },
        { $set: { player: null } }
      ))

      await Promise.all(promises)
      playerLoader.clear(_id)

      return true
    }
  }
}

export default playerResolver
