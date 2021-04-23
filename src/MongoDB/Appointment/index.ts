import dayjs from 'dayjs'
import { MongoDBInstance } from '..'
import { ObjectId } from 'mongodb'
import { facetCount } from '../helpers'
import { get } from 'lodash'
import { List } from '../Entities'
import { Appointment, AppointmentInvites, AppointmentInvitesState, AppointmentMatch, AppointmentMatchTeam, AppointmentPlayer, AppointmentPlayerMatchStats, AppointmentPlayerType, AppointmentState, AppointmentStats, AppointmentTypePlayer, InvitedPlayer } from './Entities'
import { CreateAppointmentInput, UpdateAppointmentInvitesInput, UpdateAppointmentMainInput, UpdateAppointmentMatchesInput, UpdateAppointmentStatsInput } from '../../Graph/Appointment/inputs'
import { createMongoUpdateObject } from '../../Utils/helpers'
import ErrorMessages from '../../Utils/ErrorMessages'
import { Field } from '../Field/Entities'
import { mongoField } from '../Field'
import { Player, PlayerPosition } from '../Player/Entities'

class MongoAppointment {
  async create (data: CreateAppointmentInput, createdBy: string): Promise<string> {
     const { confirmed = [], invited = [] } = data.invites || {}
     if((!confirmed.length) && !invited.length){
        throw new Error(ErrorMessages.appointment_must_specify_confirmed_or_invited)
     }
      const now = dayjs().toISOString()
      const _id = new ObjectId()
      const appointment = new Appointment()
      // init
      appointment._id = _id
      appointment.createdBy = new ObjectId(createdBy)
      appointment.createdAt = now
      appointment.updatedAt = now
      // where and when
      appointment.field = new ObjectId(data.field)
      appointment.timeAndDate = dayjs(data.timeAndDate).toISOString()
      // basic
      if(data.notes) appointment.notes = data.notes
      appointment.state = AppointmentState.Scheduled
      // invites
      appointment.invites = new AppointmentInvites()
      appointment.invites.state = AppointmentInvitesState.Open
      //   appointment.invites.checkpointQuorum = data.checkpointQuorum || 1000
      //   appointment.invites.minQuorum = data.minQuorum || 2
      //   appointment.invites.maxQuorum = data.maxQuorum || 1000
      // these params to be ignored for now
      appointment.invites.checkpointQuorum = 10000
      appointment.invites.minQuorum = 2
      appointment.invites.maxQuorum = 10000
      //
      appointment.invites.lists.blacklisted = []
      appointment.invites.lists.ignored = []
      appointment.invites.lists.waiting = []
      appointment.invites.lists.declined = []
      if(confirmed.length) appointment.invites.lists.confirmed = confirmed.map(({ _id, type }) => ({ type, _id: new ObjectId(_id) }))
      if(invited.length) appointment.invites.lists.invited = invited.map(id => ({
         player: new ObjectId(id),
         responses: []
      }))
      appointment.pricePerPlayer = data.pricePerPlayer
      if([null, undefined].includes(appointment.pricePerPlayer)){
         const field: Field = await mongoField.getFieldById(data.field, createdBy)
         appointment.pricePerPlayer = field.price === 0
            ? 0
            : 150 // 1.50€
      }
      await MongoDBInstance.collection.appointment.insertOne(appointment)
      return _id.toHexString()
  }

   async updateMainInfo (data: UpdateAppointmentMainInput, createdBy: string): Promise<boolean> {
      const now = dayjs().toISOString()
      const appointment = new Appointment()
      appointment.updatedAt = now
      if(data.field) appointment.field = new ObjectId(data.field)
      if(data.timeAndDate) appointment.timeAndDate = dayjs(data.timeAndDate).toISOString()
      if(data.notes) appointment.notes = data.notes
      const currentAppointment: Appointment = await MongoDBInstance.collection.appointment.findOne({ _id: new ObjectId(data._id), createdBy: new ObjectId(createdBy) })
      // Update is allowed only in Scheduled and Confirmed state
      if([AppointmentState.Canceled, AppointmentState.Completed, AppointmentState.Interrupted].includes(currentAppointment.state)){
         throw new Error(ErrorMessages.appointment_update_failed_due_to_state)
      }
      // date/time and field can be modified only while Scheduled
      if((data.timeAndDate || data.field) && currentAppointment.state !== AppointmentState.Scheduled) {
         throw new Error(ErrorMessages.appointment_update_failed_due_to_state)
      }
      if(data.field){
      const field: Field = await mongoField.getFieldById(data.field, createdBy)
      appointment.pricePerPlayer = field.price === 0
         ? 0
         : 150 // 1.50€
      }
      if(![null, undefined].includes(data.pricePerPlayer)) appointment.pricePerPlayer = data.pricePerPlayer
      await MongoDBInstance.collection.appointment.updateOne(
         { _id: new ObjectId(data._id), createdBy: new ObjectId(createdBy) },
         { $set: createMongoUpdateObject(appointment) }
      )
      return true
   }

   async updateMatches (data: UpdateAppointmentMatchesInput, createdBy: string): Promise<boolean> {
      const now = dayjs().toISOString()
      const appointment = new Appointment()
      appointment.updatedAt = now
      appointment.matches = data.matches.map(matchInput => {
         const winner: AppointmentMatch['winner'] = matchInput.teamA.score > matchInput.teamB.score
            ? 'teamA'
            : matchInput.teamA.score < matchInput.teamB.score
               ? 'teamB'
               : 'draw'
         const teamA: AppointmentMatchTeam = {
            name: matchInput.teamA.name || 'Team A',
            score: matchInput.teamA.score,
            players: matchInput.teamA.players.map(({ _id, type }) => ({ type, _id: new ObjectId(_id) }))
         }
         const teamB: AppointmentMatchTeam = {
            name: matchInput.teamB.name || 'Team B',
            score: matchInput.teamB.score,
            players: matchInput.teamB.players.map(({ _id, type }) => ({ type, _id: new ObjectId(_id) }))
         }
         return {
            teamA,
            teamB,
            winner
         }
      })
      const currentAppointment: Appointment = await MongoDBInstance.collection.appointment.findOne({ _id: new ObjectId(data._id), createdBy: new ObjectId(createdBy) })
      if([AppointmentState.Canceled, AppointmentState.Completed, AppointmentState.Interrupted].includes(currentAppointment.state)){
         throw new Error(ErrorMessages.appointment_update_failed_due_to_state)
      }
      await MongoDBInstance.collection.appointment.updateOne(
         { _id: new ObjectId(data._id), createdBy: new ObjectId(createdBy) },
         { $set: createMongoUpdateObject(appointment) }
      )
      return true
   }

   async updateStats (data: UpdateAppointmentStatsInput, createdBy: string): Promise<boolean> {
      const now = dayjs().toISOString()
      const appointment = new Appointment()
      appointment.updatedAt = now
      let topScorer = {} as AppointmentPlayer, topAssistman = {} as AppointmentPlayer
      // setting individual stats and rest of stats aside of mvp
      appointment.stats = data.stats.individualStats.reduce((acc, val) => {
         const currentPlayer: AppointmentPlayer = {
            player: { ...val.player, _id: new ObjectId(val.player._id) },
            assists: val.assists || 0,
            goals: val.goals || 0,
            rating: val.rating || 0,
            amountPaid: 0
         }
         if(topScorer.goals < currentPlayer.goals) topScorer = currentPlayer
         if(topAssistman.assists < currentPlayer.assists) topAssistman = currentPlayer
         acc.individualStats.push(currentPlayer)
         acc.totalAssists += currentPlayer.assists
         acc.totalGoals += currentPlayer.goals
         return acc
      }, {
         individualStats: [],
         mvp: null,
         topAssistman: null,
         topScorer: null,
         totalAssists: 0,
         totalGoals: 0
      } as AppointmentStats)
      appointment.stats.topScorer = topScorer.player
      appointment.stats.topAssistman = topAssistman.player

      const currentAppointment: Appointment = await MongoDBInstance.collection.appointment.findOne({ _id: new ObjectId(data._id), createdBy: new ObjectId(createdBy) })
      if([AppointmentState.Canceled, AppointmentState.Completed, AppointmentState.Interrupted].includes(currentAppointment.state)){
         throw new Error(ErrorMessages.appointment_update_failed_due_to_state)
      }
      // update matchStats for each player
      let playerMatchStatsMap: { [_id: string]: AppointmentPlayerMatchStats } = {}
      if(currentAppointment.matches) {
         playerMatchStatsMap = currentAppointment.matches.reduce<{ [_id: string]: AppointmentPlayerMatchStats }>((acc, match) => {
            // this assumes that a player is part of only one team: A or B not both
            // if player is part of both teams it's user's fault xD
            match.teamA.players.forEach(({ _id }) => {
               const key = _id.toHexString()
               const current = acc[key] || {} as AppointmentPlayerMatchStats
               acc[key] = {
                  ...current,
                  total: (current.total || 0) + 1,
                  ...match.winner === 'draw' && { draw: (current.draw || 0)+ 1 },
                  ...match.winner === 'teamA' && { won: (current.won || 0) + 1 },
                  ...match.winner === 'teamB' && { lost: (current.lost || 0) + 1 }
               }
            })
            match.teamB.players.forEach(({ _id }) => {
               const key = _id.toHexString()
               const current = acc[key] || {} as AppointmentPlayerMatchStats
               acc[key] = {
                  ...current,
                  total: (current.total || 0) + 1,
                  ...match.winner === 'draw' && { draw: (current.draw || 0)+ 1 },
                  ...match.winner === 'teamB' && { won: (current.won || 0) + 1 },
                  ...match.winner === 'teamA' && { lost: (current.lost || 0) + 1 }
               }
            })
            return acc
         }, {})
      }
      const { individualStats, playerIds } = appointment.stats.individualStats.reduce<{ individualStats: AppointmentPlayer[], playerIds: ObjectId[] }>((acc, el) => {
         const _id = el.player._id.toHexString()
         const individual = {
            ...el,
            ...playerMatchStatsMap[_id] && { matchStats: playerMatchStatsMap[_id] }
         }
         acc.individualStats.push(individual)
         if(el.player.type === AppointmentPlayerType.Registered) acc.playerIds.push(el.player._id) // elegible for mvp
         return acc
      }, {
         individualStats: [],
         playerIds: []
      })
      appointment.stats.individualStats = individualStats
      // calculate mvp
      const players: Player[] = await MongoDBInstance.collection.player.find({ _id: { $in: playerIds }, createdBy: new ObjectId(createdBy) }).toArray()
      const mvp = this.calculateMVP(players, appointment.stats)
      appointment.stats.mvp = mvp
      // finally update
      await MongoDBInstance.collection.appointment.updateOne(
         { _id: new ObjectId(data._id), createdBy: new ObjectId(createdBy) },
         { $set: createMongoUpdateObject(appointment) }
      )
      return true
   }

   calculateMVP (players: Player[], stats: AppointmentStats): AppointmentTypePlayer {
      const coeffMap = {
         [PlayerPosition.Back]: 0.5,
         [PlayerPosition.Back]: 0.5,
         [PlayerPosition.LeftWing]: 0.3,
         [PlayerPosition.RightWing]: 0.3,
         [PlayerPosition.Forward]: 0.3
      }
      const ratingMap = stats.individualStats.reduce<{ [_id: string]: number }>((acc, { player, rating }) => {
         return {
            ...acc,
            [player._id.toHexString()]: rating
         }
      }, {})
      const mvp = players.reduce<{ player: AppointmentTypePlayer, mvpRating: number }>((acc, { _id, positions }) => {
         const CP = coeffMap[positions[0]] // main position is taken in consideration
         const CG = _id.toHexString() === stats.topScorer._id.toHexString() ? 0.5 : 0
         const CA = _id.toHexString() === stats.topAssistman._id.toHexString() ? 0.5 : 0
         const RATING = ratingMap[_id.toHexString()]
         // MVP formula => RATING + CP + CG + CA
         const res = RATING + CP + CG + CA
         const current: AppointmentTypePlayer = {
            _id,
            type: AppointmentPlayerType.Registered
         }
         if(res > acc.mvpRating) {
            return {
               player: current,
               mvpRating: res
            }
         }
         return acc
      }, {
         player: null,
         mvpRating: 0
      })
      return mvp.player
   }

   async updateInvites (data: UpdateAppointmentInvitesInput, createdBy: string): Promise<boolean> {
      const now = dayjs().toISOString()
      const appointment = new Appointment()
      appointment.updatedAt = now
      const { confirmed = [], invited = [], blacklisted = [] } = data.invites || {}
      const currentAppointment: Appointment = await MongoDBInstance.collection.appointment.findOne({ _id: appointment._id, createdBy: new ObjectId(createdBy) })
      if([AppointmentState.Canceled, AppointmentState.Completed, AppointmentState.Interrupted].includes(currentAppointment.state)){
            throw new Error(ErrorMessages.appointment_update_failed_due_to_state)
      }
      // invited players can be modified only if the state is still scheduled
      // invited players that have already responded to the invite cannot be removed
      if(currentAppointment.state === AppointmentState.Scheduled) {
         if(invited.length) {
            let invitedMap: { [_id: string]: InvitedPlayer } = {}
            // check if user is trying to remove invited players that already responded
            const removedWithResponses = currentAppointment.invites.lists.invited.reduce((acc, val) => {
               const { player, responses } = val
               if(invited.includes(player.toHexString()) && responses.length) acc.push(val)
               invitedMap[player.toHexString()] = val
               return acc
            }, [])
            if(removedWithResponses.length) throw new Error(ErrorMessages.appointment_forbidden_removal_invited_players_already_responded)
            appointment.invites.lists.invited = invited.map(id => {
               if(invitedMap[id]) return invitedMap[id]
               return {
                  player: new ObjectId(id),
                  responses: []
               }
            })
         }
      }
      // confirmed players can be modified only if the appointment hasn't been completed yet
      if([AppointmentState.Confirmed, AppointmentState.Scheduled].includes(currentAppointment.state)) {
         if(confirmed.length) {
            const unauthorizedRemoval = !!currentAppointment.invites.lists.confirmed.find(({ _id }) => !confirmed.find(newConfirmedPlayer => _id.toHexString() === newConfirmedPlayer._id) && !blacklisted.find(newBlacklistedPlayer => _id.toHexString() === newBlacklistedPlayer._id))
            if(unauthorizedRemoval && currentAppointment.state === AppointmentState.Confirmed) throw new Error(ErrorMessages.appointment_forbidden_removal_confirmed_players_without_blacklisting)
            appointment.invites.lists.confirmed = confirmed.map(confirmedPlayer => ({ ...confirmedPlayer, _id: new ObjectId(confirmedPlayer._id) }))
         }

         if(blacklisted.length) {
            appointment.invites.lists.blacklisted = blacklisted.map(blacklistedPlayer => ({ ...blacklistedPlayer, _id: new ObjectId(blacklistedPlayer._id) }))
         }
      }
      
      await MongoDBInstance.collection.appointment.updateOne(
         { _id: new ObjectId(data._id), createdBy: new ObjectId(createdBy) },
         { $set: createMongoUpdateObject(appointment) }
      )
      return true
   }

   // TODO
   //
   // - updateState => when closing appointment update everything related

   async delete (_id: string, createdBy: string): Promise<boolean> {
         const appointment: Appointment = await MongoDBInstance.collection.appointment.findOne({ _id: new ObjectId(_id), createdBy: new ObjectId(createdBy) })
         // Decide when to delete an appointment
         // if([AppointmentState.Completed, AppointmentState.Canceled, AppointmentState.].includes(appointment.state))
         // await MongoDBInstance.collection.field.deleteOne({ _id: new ObjectId(_id), createdBy: new ObjectId(createdBy) })
      return true
   }

  // async getList (filters: FiltersField, pagination: Pagination, createdBy: string): Promise<List<Field>> {
  //    const {
  //       ids = [],
  //       type,
  //       states = [],
  //       searchText
  //    } = filters

  //    const { skip = 0, limit } = pagination
  //    // set limit to max 100
  //    const _limit = !limit || limit < 0 || limit > 100
  //       ? 100
  //       : limit

  //    const query = []

  //    // make sure that i can access it
  //    query.push({ $match: { createdBy: new ObjectId(createdBy) } })
  //    // filter by id
  //    if(ids.length) query.push({ $match: { _id: { $in: ids.map(id => new ObjectId(id)) } } })
  //    // filter by state
  //    if(states.length) query.push({ $match: { state: { $in: states } } })
  //    // filter by type
  //    if(type) query.push({ $match: { type }})
  //    // filter by searchText
  //    if(searchText) {
  //       const searchInName = { $match: { name: new RegExp(escapeStringForRegExp(searchText), 'i') } }
  //       query.push(searchInName)
  //    }
  //    // paginate
  //    query.push(facetCount({ skip, limit: _limit }))

  //    const res: Field[] = await MongoDBInstance.collection.field.aggregate(query).toArray()
  //    const result = {
  //       totalCount: get(res, '[0].totalCount[0].count', 0) as number,
  //       result: get(res, '[0].result', []) as Field[]
  //    }
  //    return result
  // }

   async getAppointmentById (_id: string, createdBy: string): Promise<Appointment> {
      const appoitment: Appointment = await MongoDBInstance.collection.appointment.findOne({ _id: new ObjectId(_id), createdBy: new ObjectId(createdBy) })
      return appoitment
   }

   async getAppointmentsByIds (ids: string[], createdBy?: string|ObjectId): Promise<Appointment[]> {
      const appoitments: Appointment[] = await MongoDBInstance.collection.appointment.find({ _id: { $in: ids.map(id => new ObjectId(id)) }, ...createdBy && { createdBy: new ObjectId(createdBy) } }).toArray()
      return appoitments
   }
}

export const mongoAppointment = new MongoAppointment()
