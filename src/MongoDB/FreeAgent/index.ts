import dayjs from 'dayjs'
import { MongoDBInstance } from '..'
import { ObjectId } from 'mongodb'
import { get } from 'lodash'
import { List, Pagination } from '../Entities'
import { FreeAgent } from './Entities'
import { facetCount } from '../helpers'
import { CreateFreeAgentInput, FiltersFreeAgent, UpdateFreeAgentInput } from '../../Graph/FreeAgent/inputs'
import { escapeStringForRegExp, normalizeUpdateObject } from '../../Utils/helpers'
import { CreatePlayerInput } from '../../Graph/Player/inputs'
import { mongoPlayer } from '../Player'
import ErrorMessages from '../../Utils/ErrorMessages'

class MongoFreeAgent {

  async create (data: CreateFreeAgentInput, createdBy: string): Promise<string> {
    const now = dayjs().toISOString()
    const _id = new ObjectId()
    const freeAgent = new FreeAgent({
      _id,
      createdAt: now,
      updatedAt: now,
      createdBy,
      ...data
    })
    await MongoDBInstance.collection.freeAgent.insertOne(freeAgent)
    return _id.toHexString()
  }

  async update (data: UpdateFreeAgentInput, createdBy: string): Promise<boolean> {
    const { _id, ...rest } = data
    const freeAgent = new FreeAgent({
      updatedAt: dayjs().toISOString(),
      ...rest
    })
    await MongoDBInstance.collection.freeAgent.updateOne(
      { _id: new ObjectId(_id), createdBy: new ObjectId(createdBy) },
      { $set: normalizeUpdateObject(freeAgent) }
    )
    return true
  }

  async delete (_id: string, createdBy: string): Promise<boolean> {
    await MongoDBInstance.collection.freeAgent.deleteOne({ _id: new ObjectId(_id), createdBy: new ObjectId(createdBy) })
    return true
  }

  async registerAsPlaye (_id: string, createPlayerBody: CreatePlayerInput, createdBy: string): Promise<string> {
    const freeAgent = await this.getFreeAgentById(_id)
    if(!freeAgent) throw new Error(ErrorMessages.freeAgent_does_not_exist)
    const _idPlayer = await mongoPlayer.create(createPlayerBody, createdBy)
    // update free agent in appointments
    await this.delete(_id, createdBy)
    return _idPlayer
  }

  async getList (filters: FiltersFreeAgent, pagination: Pagination, createdBy: string): Promise<List<FreeAgent>> {
    const { 
      ids = [],
      searchText
    } = filters

    const { skip = 0, limit } = pagination
    // set limit to max 100
    const _limit = !limit || limit < 0 || limit > 100
      ? 100
      : limit
      
    const query = []

    // make sure that i can access it
    query.push({ $match: { createdBy: new ObjectId(createdBy) } })
    // filter by id
    if(ids.length) query.push({ $match: { _id: { $in: ids.map(id => new ObjectId(id)) } } })
    // filter by searchText
    if(searchText) {
      const createFullNameField = { $addFields: { "fullName": { $concat: [ "$surname", ' ', "$name" ] } } }
      const searchInFullName = { $match: { fullName: new RegExp(escapeStringForRegExp(searchText), 'i') } }
      const deleteFullNameField = { $unset: "fullName" }
      query.push(createFullNameField)
      query.push(searchInFullName)
      query.push(deleteFullNameField)
    }
    // paginate
    query.push(facetCount({ skip, limit: _limit }))

    const res = await MongoDBInstance.collection.freeAgent.aggregate(query).toArray()
    const result = {
      totalCount: get(res, '[0].totalCount[0].count', 0) as number,
      result: get(res, '[0].result', []) as FreeAgent[]
    }
    return result
  }

  async getFreeAgentById (_id: string): Promise<FreeAgent> {
    const freeAgent = await MongoDBInstance.collection.freeAgent.findOne({ _id: new ObjectId(_id) })
    return freeAgent as FreeAgent
  }
}

export const mongoFreeAgent = new MongoFreeAgent()