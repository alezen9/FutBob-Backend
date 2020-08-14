import { mongoPlayer } from '../../MongoDB/Player'
import { Privilege } from '../../MongoDB/Entities'
import ErrorMessages from '../../Utils/ErrorMessages'
import { MongoDBInstance } from '../../MongoDB'
import { ObjectId } from 'mongodb'
import { isEmpty } from 'lodash'
import cleanDeep from 'clean-deep'
import { mongoUser } from '../../MongoDB/User'
import { checkPrivileges } from '../../Middleware/isAuth'
import { Player, PlayerType, RadarData } from '../../MongoDB/Player/Entities'
import moment from 'moment'
import { gql_User, gql_Player, playerLoader } from './transform'

const playerResolver = {
  Query: {
    getPlayers: async (_, { playerFilters }, { req }) => {
      if (!req.isAuth) throw new Error(ErrorMessages.user_unauthenticated)
      const players: Player[] = await mongoPlayer.getPlayers(playerFilters)
      return players.map(gql_Player)
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
          idUser = await mongoUser.createUser({ ...userData, privilege: Privilege.User })
        }
        const idPlayer = await mongoPlayer.createPlayer({ ...playerData, idUser })
        return idPlayer
      } catch (error) {
        throw error
      }
    },
    updatePlayer: async (_, { updatePlayerInput }, { req }) => {
      if (!req.isAuth) throw new Error(ErrorMessages.user_unauthenticated)
      const { _id, positions, state, radarData } = updatePlayerInput

      if (isEmpty(cleanDeep(updatePlayerInput))) return true

      const updatedPlayer = new Player()
      if (positions && positions instanceof Array) updatedPlayer.positions = positions
      if (state !== undefined) updatedPlayer.state = state
      if(radarData) {
        const _radarData = new RadarData()
        _radarData.speed = radarData.speed
        _radarData.stamina = radarData.stamina
        _radarData.defence = radarData.defence
        _radarData.balance = radarData.balance
        _radarData.ballControl = radarData.ballControl
        _radarData.passing = radarData.passing
        _radarData.finishing = radarData.finishing
        updatedPlayer.radar = _radarData
      }
      updatedPlayer.updatedAt = moment().toDate()

      const { modifiedCount } = await MongoDBInstance.collection.player.updateOne(
        { _id: new ObjectId(_id) },
        { $set: updatedPlayer }
      )
      
      if (modifiedCount === 0) throw new Error(ErrorMessages.player_update_not_possible)
      playerLoader.clear(_id)
      return true
    },
    deletePlayer: async (_, { deletePlayerInput }, { req }) => {
      if (!req.isAuth) throw new Error(ErrorMessages.user_unauthenticated)
      const { _id, idUser, type } = deletePlayerInput
      const promises = []

      // delete player from player collection
      promises.push(MongoDBInstance.collection.player.deleteOne({ _id: new ObjectId(_id), user: new ObjectId(idUser) }))
      // delete player from user collection
      promises.push(MongoDBInstance.collection.user.updateOne(
        { _id: new ObjectId(idUser) },
        { $set: { ...type === PlayerType.Football
          ? { footballPlayer: null }
          : { futsalPlayer: null }
        } }
      ))

      await Promise.all(promises)
      playerLoader.clear(_id)

      return true
    }
  }
}

export default playerResolver
