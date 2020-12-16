import dayjs from 'dayjs'
import { MongoDBInstance } from '..'
import { ObjectId } from 'mongodb'
import { get } from 'lodash'
import { List } from '../Entities'
import { FreeAgent } from './Entities'
import { facetCount } from '../helpers'

class MongoFreeAgent {
  
  async createFreeAgent (data: any, createdBy: string): Promise<string> {
    const now = dayjs().toDate()
    const freeAgent = new FreeAgent()
    freeAgent._id = new ObjectId()
    freeAgent.createdBy = new ObjectId(createdBy)
    freeAgent.createdAt = now
    freeAgent.updatedAt = now
    freeAgent.name = data.name
    freeAgent.surname = data.surname

    await MongoDBInstance.collection.freeAgent.insertOne(freeAgent)
    return freeAgent._id.toHexString()
  }

  async getFreeAgents (filters: any, createdBy: string): Promise<List<FreeAgent>> {
    const { 
      ids = [],
      searchText,
      pagination = {}
    } = filters
    const { skip = 0, limit } = pagination
    const _limit = !limit || limit < 0 || limit > 100
      ? 100
      : limit
    let query = []
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
    }
    query.push(facetCount({ skip, limit: _limit }))
    const res: FreeAgent[] = await MongoDBInstance.collection.freeAgent.aggregate(query).toArray()
    const result = {
      totalCount: get(res, '[0].totalCount[0].count', 0) as number,
      result: get(res, '[0].result', []) as FreeAgent[]
    }
    return result
  }

  async getFreeAgentById (_id: string): Promise<FreeAgent> {
    const freeAgent: FreeAgent = await MongoDBInstance.collection.freeAgent.findOne({ _id: new ObjectId(_id) })
    return freeAgent
  }

  getTypePlayerFields (freeAgent: FreeAgent):any {
    const { _id, createdBy, ...rest } = freeAgent
    return {
      ...rest,
      _id: _id.toHexString(),
      createdBy: createdBy.toHexString(),
      // appointments: appointments.map(id => id.toHexString())
    }
  }
}

export const mongoFreeAgent = new MongoFreeAgent()