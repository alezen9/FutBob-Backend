import dayjs from 'dayjs'
import { MongoDBInstance } from '..'
import { ObjectId } from 'mongodb'
import { mongoUser } from '../User'
import { Player, PhysicalState, PlayerScore, Pace, Shooting, Passing, Defense, Physical, Technique } from './Entities'
import { playerToUserLookupStage, unsetUserDataLookup } from './helpers'
import { facetCount } from '../helpers'
import { get } from 'lodash'
import { List } from '../Entities'

class MongoPlayer {
  
  async createPlayer (data: any, createdBy: string): Promise<string> {
    const now = dayjs().toDate()
    const player = new Player()
    player._id = new ObjectId()
    player.createdBy = new ObjectId(createdBy)
    player.user = new ObjectId(data.idUser)
    player.positions = data.positions
    player.state = data.state || PhysicalState.Top
    player.createdAt = now
    player.updatedAt = now
    player.score = this.assignScoreValues(data)

    await MongoDBInstance.collection.player.insertOne(player)
    await mongoUser.linkPlayerToUser(data.idUser, player._id.toHexString())
    return player._id.toHexString()
  }

  async getPlayers (filters: any, createdBy: string): Promise<List<Player>> {
    const { 
      ids = [],
      positions = [],
      type,
      matchIds = [],
      states = [],
      countries = [],
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
    if(type !== undefined) query.push({ type })
    if(states.length) query.push({ $match: { state: { $in: states } } })
    if(positions.length) query.push({ $match: { positions: { $in: positions } }})
    if(matchIds.length) query.push({ $match: { positions: { $in: matchIds } }})
    if(countries.length) {
      query = [
        ...query,
        ...playerToUserLookupStage,
        { $match: { 'userData.country': { $in: countries } }}
      ]
      lookupAdded = true
    }
    if(searchText) {
      query = [
        ...query,
        ...!lookupAdded ? playerToUserLookupStage : [],
        {
          $addFields: {
              "fullName": { $concat: [ "$userData.surname", ' ', "$userData.name" ] }
          }
        },
        { $match: { fullName: new RegExp(searchText, 'i') } },
        { $unset: "fullName" }
      ]
      lookupAdded = true
    }
    if(lookupAdded) query.push(unsetUserDataLookup)
    query.push(facetCount({ skip, limit: _limit }))
    const res: Player[] = await MongoDBInstance.collection.player.aggregate(query).toArray()
    const result = {
      totalCount: get(res, '[0].totalCount[0].count', 0) as number,
      result: get(res, '[0].result', []) as Player[]
    }
    return result
  }

  assignScoreValues (data):PlayerScore {
    const score = new PlayerScore()
    
    const pace = new Pace()
    pace.speed = data.score.pace.speed
    pace.stamina = data.score.pace.stamina
    const shooting = new Shooting()
    shooting.finishing = data.score.shooting.finishing
    shooting.longShots = data.score.shooting.longShots
    shooting.shotPower = data.score.shooting.shotPower
    const passing = new Passing()
    passing.longPassing = data.score.passing.longPassing
    passing.shortPassing = data.score.passing.shortPassing
    passing.vision = data.score.passing.vision
    const technique = new Technique()
    technique.agility = data.score.technique.agility
    technique.ballControl = data.score.technique.ballControl
    technique.dribbling = data.score.technique.dribbling
    const defense = new Defense()
    defense.defensiveAwareness = data.score.defense.defensiveAwareness
    defense.interception = data.score.defense.interception
    defense.versus = data.score.defense.versus
    const physical = new Physical()
    physical.strength = data.score.physical.strength

    score.pace = pace
    score.shooting = shooting
    score.passing = passing
    score.technique = technique
    score.defense = defense
    score.physical = physical

    return score
  }

  async getPlayerById (_id: string): Promise<Player> {
    const player: Player = await MongoDBInstance.collection.player.findOne({ _id: new ObjectId(_id) })
    return player
  }

  getTypePlayerFields (player: Player):any {
    const { _id, user, createdBy, ...rest } = player
    return {
      ...rest,
      _id: _id.toHexString(),
      createdBy: createdBy.toHexString(),
      user: user.toHexString()
    }
  }
}

export const mongoPlayer = new MongoPlayer()