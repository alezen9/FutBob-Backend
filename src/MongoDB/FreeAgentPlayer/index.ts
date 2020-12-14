import moment from 'moment'
import { MongoDBInstance } from '..'
import { ObjectId } from 'mongodb'
import { get } from 'lodash'
import { List } from '../Entities'
import { FreeAgentPlayer } from './Entities'
import { facetCount } from '../helpers'

class MongoFreeAgentPlayer {
  
  async createFreeAgentPlayer (data: any, createdBy: string): Promise<string> {
    const now = moment().toDate()
    const freeAgentPlayer = new FreeAgentPlayer()
    freeAgentPlayer._id = new ObjectId()
    freeAgentPlayer.createdBy = new ObjectId(createdBy)
    freeAgentPlayer.createdAt = now
    freeAgentPlayer.updatedAt = now
    freeAgentPlayer.name = data.name
    freeAgentPlayer.surname = data.surname

    await MongoDBInstance.collection.freeAgentPlayer.insertOne(freeAgentPlayer)
    return freeAgentPlayer._id.toHexString()
  }

  async getFreeAgentPlayers (filters: any, createdBy: string): Promise<List<FreeAgentPlayer>> {
    const { 
      ids = [],
      appointmentIds = [],
      searchText,
      pagination = {}
    } = filters
    const { skip = 0, limit } = pagination
    const _limit = !limit || limit < 0 || limit > 100
      ? 100
      : limit
    let query = []
    let lookupAdded = false
    query.push({ $match: { createdBy: new ObjectId(createdBy) } })
    if(ids.length) query.push({ $match: { _id: { $in: ids.map(ObjectId) } } })
    if(searchText) {
      query = [
        ...query,
        {
          $addFields: {
              "fullName": { $concat: [ "$surname", ' ', "$name" ] }
          }
        },
        { $match: { fullName: new RegExp(searchText, 'i') } },
        { $unset: "fullName" }
      ]
      lookupAdded = true
    }
    query.push(facetCount({ skip, limit: _limit }))
    const res: FreeAgentPlayer[] = await MongoDBInstance.collection.freeAgentPlayer.aggregate(query).toArray()
    const result = {
      totalCount: get(res, '[0].totalCount[0].count', 0) as number,
      result: get(res, '[0].result', []) as FreeAgentPlayer[]
    }
    return result
  }

  async getFreeAgentPlayerById (_id: string): Promise<FreeAgentPlayer> {
    const freeAgentPlayer: FreeAgentPlayer = await MongoDBInstance.collection.freeAgentPlayer.findOne({ _id: new ObjectId(_id) })
    return freeAgentPlayer
  }

  getTypePlayerFields (player: FreeAgentPlayer):any {
    const { _id, createdBy, ...rest } = player
    return {
      ...rest,
      _id: _id.toHexString(),
      createdBy: createdBy.toHexString(),
    }
  }
}

export const mongoFreeAgentPlayer = new MongoFreeAgentPlayer()