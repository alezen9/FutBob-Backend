import moment from 'moment'
import { MongoDBInstance } from '..'
import { ObjectId } from 'mongodb'
import { mongoUser } from '../User'
import { Player, PhysicalState, PlayerType, RadarData } from './Entities'

class MongoPlayer {
  
  async createPlayer (data: any): Promise<string> {
    const now = moment().toDate()
    const player = new Player()
    player._id = new ObjectId()
    player.user = new ObjectId(data.idUser)
    player.positions = data.positions
    player.state = data.state || PhysicalState.Top
    player.type = data.type
    player.createdAt = now
    player.updatedAt = now
    const radarData = new RadarData()
    radarData.speed = data.radarData.speed
    radarData.stamina = data.radarData.stamina
    radarData.defence = data.radarData.defence
    radarData.balance = data.radarData.balance
    radarData.ballControl = data.radarData.ballControl
    radarData.passing = data.radarData.passing
    radarData.finishing = data.radarData.finishing
    player.radar = radarData
    await MongoDBInstance.collection.player.insertOne(player)
    await mongoUser.assignPlayer({
        idUser: data.idUser,
        ...player.type === PlayerType.Football && { footballPlayer: (player._id).toHexString() },
        ...player.type === PlayerType.Futsal && { futsalPlayer: (player._id).toHexString() }
    })
    return player._id.toHexString()
  }

  async getPlayers (filters: any): Promise<Player[]> {
    const { ids, position, type, matchId, state } = filters
    const query = []
    if(ids && ids.length) query.push({ $match: { _id: { $in: ids.map(ObjectId) } } } )
    if(type !== undefined) query.push({ type })
    if(state !== undefined) query.push({ state })
    if(position !== undefined) query.push({ positions: { $elemMatch: position } })
    if(matchId !== undefined) query.push({ matches: { $elemMatch: matchId } })
    const players: Player[] = query.length
    ? await MongoDBInstance.collection.player.aggregate(query).toArray()
    : await MongoDBInstance.collection.player.find({}).toArray()
    return players
  }

  async getPlayerById (_id: string): Promise<Player> {
    const player: Player = await MongoDBInstance.collection.player.findOne({ _id: new ObjectId(_id) })
    return player
  }

  getTypePlayerFields (player: Player):any {
    const { _id, matches = [], user, ...rest } = player
    return {
      ...rest,
      _id: _id.toHexString(),
      user: user.toHexString(),
      matches: matches.map((_id: ObjectId) => _id.toHexString())
    }
  }
}

export const mongoPlayer = new MongoPlayer()