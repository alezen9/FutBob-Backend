import dayjs from 'dayjs'
import { MongoDBInstance } from '..'
import { ObjectId } from 'mongodb'
import { mongoUser } from '../User'
import { Player } from './Entities'
import { StageLookupUserForPlayer, StageUnsetLookupUserForPlayer } from './helpers'
import { facetCount } from '../helpers'
import { get } from 'lodash'
import { List, Pagination } from '../Entities'
import { CreatePlayerInput, FiltersPlayer, UpdatePlayerInput } from '../../Graph/Player/inputs'
import ErrorMessages from '../../Utils/ErrorMessages'
import { escapeStringForRegExp, normalizeUpdateObject } from '../../Utils/helpers'

class MongoPlayer {

  async create (data: CreatePlayerInput, _createdBy: string): Promise<string> {
    const now = dayjs().toDate()
    const _id = new ObjectId()
    const createdBy = new ObjectId(_createdBy)
    const player = new Player({ 
      ...data, 
      user: new ObjectId(data.user),
      _id,
      createdBy,
      createdAt: now,
      updatedAt: now
    })
    await MongoDBInstance.collection.player.insertOne(player)
    await mongoUser.setPlayer(data.user, _id.toHexString())
    return _id.toHexString()
  }

  async update (data: UpdatePlayerInput, createdBy: string): Promise<boolean> {
    const { _id, ...rest } = data
    const player = new Player({ 
      ...rest,
      updatedAt: dayjs().toDate()
    })
    await MongoDBInstance.collection.player.updateOne(
      { _id: new ObjectId(_id), createdBy: new ObjectId(createdBy) },
      { $set: normalizeUpdateObject(player) }
    )
    return true
  }

  async delete (_id: string, createdBy: string): Promise<boolean> {
    const player = await MongoDBInstance.collection.player.findOne({ _id: new ObjectId(_id), createdBy: new ObjectId(createdBy) })
    if(!player) throw new Error(ErrorMessages.system_permission_denied)
    await MongoDBInstance.collection.player.deleteOne({ _id: new ObjectId(_id) })
    await MongoDBInstance.collection.user.updateOne(
      { _id: new ObjectId(player.user), createdBy: new ObjectId(createdBy) },
      { $set: { player: null } }
    )
    return true
  }

  async getList (filters: FiltersPlayer, pagination: Pagination, createdBy: string): Promise<List<Player>> {
    const { 
      ids = [],
      positions = [],
      states = [],
      countries = [],
      searchText
    } = filters

    const { skip = 0, limit } = pagination
    // set limit to max 100
    const _limit = !limit || limit < 0 || limit > 100
      ? 100
      : limit
      
    const query = []
    let lookupAdded = false

    // make sure that i can access it
    query.push({ $match: { createdBy: new ObjectId(createdBy) } })
    // filter by id
    if(ids.length) query.push({ $match: { _id: { $in: ids.map(id => new ObjectId(id)) } } })
    // filter by state
    if(states.length) query.push({ $match: { state: { $in: states } } })
    // filter by position
    if(positions.length) query.push({ $match: { positions: { $in: positions } }})
    /**  USER DATA IS LOCATED IN THE "userData" FIELD IF LOOKUP HAS BEEN ADDED */
    // filter by country
    if(countries.length) {
      query.push(StageLookupUserForPlayer)
      query.push({ $match: { 'userData.country': { $in: countries } }})
      lookupAdded = true
    }
    // filter by searchText
    if(searchText) {
      if(!lookupAdded) query.push(StageLookupUserForPlayer)
      const createFullNameField = { $addFields: { "fullName": { $concat: [ "$userData.surname", ' ', "$userData.name" ] } } }
      const searchInFullName = { $match: { fullName: new RegExp(escapeStringForRegExp(searchText), 'i') } }
      const deleteFullNameField = { $unset: "fullName" }
      query.push(createFullNameField)
      query.push(searchInFullName)
      query.push(deleteFullNameField)
      lookupAdded = true
    }
    // remove lookup stuff if it was added
    if(lookupAdded) query.push(StageUnsetLookupUserForPlayer)
    // paginate
    query.push(facetCount({ skip, limit: _limit }))

    const res: Player[] = await MongoDBInstance.collection.player.aggregate(query).toArray()
    const result = {
      totalCount: get(res, '[0].totalCount[0].count', 0) as number,
      result: get(res, '[0].result', []) as Player[]
    }
    return result
  }

  async getPlayerById (_id: string): Promise<Player> {
    const player: Player = await MongoDBInstance.collection.player.findOne({ _id: new ObjectId(_id) })
    return player
  }
}

export const mongoPlayer = new MongoPlayer()