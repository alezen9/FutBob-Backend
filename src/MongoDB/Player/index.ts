import moment from 'moment'
import { MongoDBInstance } from '..'
import { ObjectId } from 'mongodb'
import { mongoUser } from '../User'
import { Player, PhysicalState, PlayerType, PlayerScore, Pace, Shooting, Passing, Dribbling, Defense, Physical } from './Entities'
import { playerToUserLookupStage, unsetUserDataLookup } from './helpers'
import { facetCount } from '../helpers'
import { get } from 'lodash'
import { List } from '../Entities'

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
    player.score = this.assignScoreValues(data)

    await MongoDBInstance.collection.player.insertOne(player)
    await mongoUser.assignPlayer({
        idUser: data.idUser,
        ...player.type === PlayerType.Football && { footballPlayer: (player._id).toHexString() },
        ...player.type === PlayerType.Futsal && { futsalPlayer: (player._id).toHexString() }
    })
    return player._id.toHexString()
  }

  async getPlayers (filters: any): Promise<List<Player>> {
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
    pace.acceleration = data.score.pace.acceleration
    pace.sprintSpeed = data.score.pace.sprintSpeed
    const shooting = new Shooting()
    shooting.finishing = data.score.shooting.finishing
    shooting.longShots = data.score.shooting.longShots
    shooting.penalties = data.score.shooting.penalties
    shooting.positioning = data.score.shooting.positioning
    shooting.shotPower = data.score.shooting.shotPower
    shooting.volleys = data.score.shooting.volleys
    const passing = new Passing()
    passing.crossing = data.score.passing.crossing
    passing.curve = data.score.passing.curve
    passing.freeKick = data.score.passing.freeKick
    passing.longPassing = data.score.passing.longPassing
    passing.shortPassing = data.score.passing.shortPassing
    passing.vision = data.score.passing.vision
    const dribbling = new Dribbling()
    dribbling.agility = data.score.dribbling.agility
    dribbling.balance = data.score.dribbling.balance
    dribbling.ballControl = data.score.dribbling.ballControl
    dribbling.composure = data.score.dribbling.composure
    dribbling.dribbling = data.score.dribbling.dribbling
    dribbling.reactions = data.score.dribbling.reactions
    const defense = new Defense()
    defense.defensiveAwareness = data.score.defense.defensiveAwareness
    defense.heading = data.score.defense.heading
    defense.interceptions = data.score.defense.interceptions
    defense.slidingTackle = data.score.defense.slidingTackle
    defense.standingTackle = data.score.defense.standingTackle
    const physical = new Physical()
    physical.aggression = data.score.physical.aggression
    physical.jumping = data.score.physical.jumping
    physical.stamina = data.score.physical.stamina
    physical.strength = data.score.physical.strength

    score.pace = pace
    score.shooting = shooting
    score.passing = passing
    score.dribbling = dribbling
    score.defense = defense
    score.physical = physical

    return score
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