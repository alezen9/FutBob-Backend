import dayjs from 'dayjs'
import { MongoDBInstance } from '..'
import { ObjectId } from 'mongodb'
import { facetCount } from '../helpers'
import { get } from 'lodash'
import { List, Pagination } from '../Entities'
import { Appointment, AppointmentInviteLists, AppointmentInvites, AppointmentInvitesState, AppointmentMatch, AppointmentMatchTeam, AppointmentPlayer, AppointmentPlayerMatchStats, AppointmentPlayerType, AppointmentState, AppointmentStats, AppointmentTypePlayer, AppointmentDate, AppointmentInvitesInvitedPlayer } from './Entities'
import { CreateAppointmentInput, FiltersAppointment, SetMpvManuallyInput, SortAppointment, UpdateAppointmentInvitesInput, UpdateAppointmentMainInput, UpdateAppointmentMatchesInput, UpdateAppointmentStateInput, UpdateAppointmentStatsInput } from '../../Graph/Appointment/inputs'
import { createMongoUpdateObject } from '../../Utils/helpers'
import ErrorMessages from '../../Utils/ErrorMessages'
import { Field } from '../Field/Entities'
import { mongoField } from '../Field'
import { Player, PlayerPosition } from '../Player/Entities'

class MongoAppointment {

   // DOOOOOOONEEEEEE, don't touch (23.05.2021 at 02:26)
   private checkDates(start: Date|string, end: Date|string) {
      const _1DayFromNow = dayjs().add(1, 'days')
      const startDate = dayjs(start).toISOString()
      const endDate = dayjs(end).toISOString()
      // 1. start date must be at least 1 day from now and not after end
      const startDateOk = dayjs(startDate).isAfter(_1DayFromNow) && ((endDate && !dayjs(startDate).isAfter(endDate)) || !endDate)
      // 2. end date must be after start
      const endDateOk = !endDate ? true : dayjs(endDate).isAfter(startDate)

      if(!(startDateOk && endDateOk)) throw new Error(ErrorMessages.appointment_error_validation_dates)
   }


   // DOOOOOOONEEEEEE, don't touch (23.05.2021 at 02:26)
   async create (data: CreateAppointmentInput, createdBy: string): Promise<string> {
         const { confirmed = [], invited = [] } = data.invites || {}
         // check dates
         this.checkDates(data.start, data.end)
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
         appointment.date = new AppointmentDate()
         appointment.date.start = dayjs(data.start).toISOString()
         if(data.end) appointment.date.end = dayjs(data.end).toISOString()
         // basic
         if(data.notes) appointment.notes = data.notes
         appointment.state = AppointmentState.Scheduled
         // invites
         appointment.invites = new AppointmentInvites()
         // appointment.invites.state = AppointmentInvitesState.Open
         // these params to be ignored for now
         // appointment.invites.checkpointQuorum = data.invites.checkpointQuorum
         // appointment.invites.minQuorum = data.invites.minQuorum
         // appointment.invites.maxQuorum = data.invites.maxQuorum
         //
         appointment.invites.lists = new AppointmentInviteLists()
         appointment.invites.lists.blacklisted = []
         appointment.invites.lists.ignored = []
         appointment.invites.lists.waiting = []
         appointment.invites.lists.declined = []
         if(confirmed.length) appointment.invites.lists.confirmed = confirmed.map(({ _id, type }) => ({ type, player: new ObjectId(_id) }))
         if(invited.length) appointment.invites.lists.invited = invited.map(id => ({ player: new ObjectId(id), totalResponses: 0 }))
         appointment.pricePerPlayer = data.pricePerPlayer
         if([null, undefined].includes(appointment.pricePerPlayer)){
            const field: Field = await mongoField.getFieldById(data.field, createdBy)
            appointment.pricePerPlayer = field.price === 0
               ? 0
               : 150 // 1.50€
         }
         /**
          * check if another appointment that matches the following exists:
          * start => start of existing appointment date
          * end => end of existing appointment date
          * _start => start of current appointment date
          * _end => end of current appointment date
          * 
          * 1. current starts before the existing start and ends after its end
          * => _start < start & _end > end
          * 2. current starts after the existing start and ends before its end
          * => _start > start & _end < end
          * 3. current starts after existing start and ends after existing
          * 
          * Let the user manage this thing, if he/she fucks up its their problem
          * 
          */
         await MongoDBInstance.collection.appointment.insertOne(appointment)
         return _id.toHexString()
   }

  
   // DOOOOOOONEEEEEE, don't touch (23.05.2021 at 02:15)
   async updateMainInfo (data: UpdateAppointmentMainInput, createdBy: string): Promise<boolean> {
      const currentAppointment: Appointment = await MongoDBInstance.collection.appointment.findOne({ _id: new ObjectId(data._id), createdBy: new ObjectId(createdBy) })
      // Update is allowed only in Scheduled and Confirmed state
      if([AppointmentState.Canceled, AppointmentState.Completed, AppointmentState.Interrupted].includes(currentAppointment.state)){
         throw new Error(ErrorMessages.appointment_update_failed_due_to_state)
      }
      // check dates
      this.checkDates(data.start, data.end)
      const now = dayjs().toISOString()
      const appointment = new Appointment()
      appointment.updatedAt = now
      if(data.field) appointment.field = new ObjectId(data.field)
      if(data.start) appointment.date.start = dayjs(data.start).toISOString()
      if(data.end) appointment.date.end = dayjs(data.end).toISOString()
      if(data.notes) appointment.notes = data.notes

      // dates and field can be modified only while Scheduled
      if((data.start || data.end || data.field) && currentAppointment.state !== AppointmentState.Scheduled) {
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


   // DOOOOOOONEEEEEE, don't touch (23.05.2021 at 02:09)
   async updateMatches (data: UpdateAppointmentMatchesInput, createdBy: string): Promise<boolean> {
      const currentAppointment: Appointment = await MongoDBInstance.collection.appointment.findOne({ _id: new ObjectId(data._id), createdBy: new ObjectId(createdBy) })
      if([AppointmentState.Canceled, AppointmentState.Completed, AppointmentState.Interrupted].includes(currentAppointment.state)){
         throw new Error(ErrorMessages.appointment_update_failed_due_to_state)
      }
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
            players: matchInput.teamA.players.map(({ _id, type }) => ({ type, player: new ObjectId(_id) }))
         }
         const teamB: AppointmentMatchTeam = {
            name: matchInput.teamB.name || 'Team B',
            score: matchInput.teamB.score,
            players: matchInput.teamB.players.map(({ _id, type }) => ({ type, player: new ObjectId(_id) }))
         }
         return {
            teamA,
            teamB,
            winner,
            ...matchInput.notes && { notes: matchInput.notes }
         }
      })
      await MongoDBInstance.collection.appointment.updateOne(
         { _id: new ObjectId(data._id), createdBy: new ObjectId(createdBy) },
         { $set: createMongoUpdateObject(appointment) }
      )
      return true
   }


   // DOOOOOOONEEEEEE, don't touch (23.05.2021 at 02:02)
   async updateStats (data: UpdateAppointmentStatsInput, createdBy: string): Promise<boolean> {
      const currentAppointment: Appointment = await MongoDBInstance.collection.appointment.findOne({ _id: new ObjectId(data._id), createdBy: new ObjectId(createdBy) })
      if([AppointmentState.Canceled, AppointmentState.Completed, AppointmentState.Interrupted].includes(currentAppointment.state)){
         throw new Error(ErrorMessages.appointment_update_failed_due_to_state)
      }
      const now = dayjs().toISOString()
      const appointment = new Appointment()
      appointment.updatedAt = now
      let topScorer = {} as AppointmentPlayer, topAssistman = {} as AppointmentPlayer
      // setting individual stats and rest of stats aside of mvp
      appointment.stats = data.stats.individualStats.reduce((acc, val) => {
         const currentPlayer: AppointmentPlayer = {
            player: { ...val.player, player: new ObjectId(val.player._id) },
            assists: val.assists || 0,
            goals: val.goals || 0,
            rating: val.rating || 0,
            paidAmount: val.paidAmount || 0
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

      // update matchStats for each player
      let playerMatchStatsMap: { [_id: string]: AppointmentPlayerMatchStats } = {}
      if(currentAppointment.matches) {
         playerMatchStatsMap = currentAppointment.matches.reduce<{ [_id: string]: AppointmentPlayerMatchStats }>((acc, match) => {
            // this assumes that a player is part of only one team: A or B not both
            // if player is part of both teams it's user's fault xD
            match.teamA.players.forEach(({ player }) => {
               const key = player.toHexString()
               const current = acc[key] || {} as AppointmentPlayerMatchStats
               acc[key] = {
                  ...current,
                  total: (current.total || 0) + 1,
                  ...match.winner === 'draw' && { draw: (current.draw || 0)+ 1 },
                  ...match.winner === 'teamA' && { won: (current.won || 0) + 1 },
                  ...match.winner === 'teamB' && { lost: (current.lost || 0) + 1 }
               }
            })
            match.teamB.players.forEach(({ player }) => {
               const key = player.toHexString()
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
      const { individualStats, playerIds, freeAgentIds } = appointment.stats.individualStats.reduce<{ individualStats: AppointmentPlayer[], playerIds: ObjectId[], freeAgentIds: ObjectId[] }>((acc, el) => {
         const _id = el.player.player.toHexString()
         const individual = {
            ...el,
            ...playerMatchStatsMap[_id] && { matchStats: playerMatchStatsMap[_id] }
         }
         acc.individualStats.push(individual)
         if(el.player.type === AppointmentPlayerType.Registered) acc.playerIds.push(el.player.player) // elegible for mvp
         else acc.freeAgentIds.push(el.player.player)
         return acc
      }, {
         individualStats: [],
         playerIds: [],
         freeAgentIds: []
      })
      appointment.stats.individualStats = individualStats
      // calculate mvp
      const players: Player[] = await MongoDBInstance.collection.player.find({ _id: { $in: playerIds }, createdBy: new ObjectId(createdBy) }).toArray()
      const mvps = this.calculateMVP(players, freeAgentIds, appointment.stats)
      appointment.stats.mvp = mvps.length === 1
         ? { player: mvps[0] }
         : null // to be set later
      appointment.stats.mvpElegible = mvps
      // finally update
      await MongoDBInstance.collection.appointment.updateOne(
         { _id: new ObjectId(data._id), createdBy: new ObjectId(createdBy) },
         { $set: createMongoUpdateObject(appointment) }
      )
      return true
   }

   
   // DOOOOOOONEEEEEE, don't touch (29.05.2021 at 17:14)
   async setMvpManually (data: SetMpvManuallyInput, createdBy: string) {
      const { appointmentId, playerId, notes } = data
      const currentAppointment: Appointment = await MongoDBInstance.collection.appointment.findOne({ _id: new ObjectId(appointmentId), createdBy: new ObjectId(createdBy) })
      if([AppointmentState.Canceled, AppointmentState.Completed, AppointmentState.Interrupted].includes(currentAppointment.state)){
         throw new Error(ErrorMessages.appointment_update_failed_due_to_state)
      }
      const elegiblePlayers = currentAppointment?.stats?.mvpElegible || []
      const playerFoundInElegible = elegiblePlayers.find(({ player }) => playerId === player.toHexString())
      if(!playerFoundInElegible) throw new Error(ErrorMessages.appointment_player_not_elegible_as_mvp)
      const appointment = new Appointment()
      const now = dayjs().toISOString()
      appointment.updatedAt = now
      appointment.stats.mvp = {
          player: playerFoundInElegible,
         ...notes && { notes }
      }
      await MongoDBInstance.collection.appointment.updateOne(
         { _id: new ObjectId(appointmentId), createdBy: new ObjectId(createdBy) },
         { $set: createMongoUpdateObject(appointment) }
      )
      return true
   }


   // DOOOOOOONEEEEEE, don't touch (23.05.2021 at 02:02)
   private calculateMVP (players: Player[], freeAgentIds: ObjectId[], stats: AppointmentStats): AppointmentTypePlayer[] {
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
            [player.player.toHexString()]: rating
         }
      }, {})
      const mvpRegistered = players.reduce<{ elegible: AppointmentTypePlayer[], mvpRating: number }>((acc, { _id, positions }) => {
         const CP = coeffMap[positions[0]] // main position is taken in consideration
         const CG = _id.toHexString() === stats.topScorer.player.toHexString() ? 0.5 : 0
         const CA = _id.toHexString() === stats.topAssistman.player.toHexString() ? 0.5 : 0
         const RATING = ratingMap[_id.toHexString()]
         // MVP formula => RATING + CP + CG + CA
         const res = RATING + CP + CG + CA
         const current: AppointmentTypePlayer = {
            player: _id,
            type: AppointmentPlayerType.Registered
         }
         if(res > acc.mvpRating) {
            return {
               elegible: [current],
               mvpRating: res
            }
         }
         if(res === acc.mvpRating){
            return {
               elegible: [...acc.elegible, current],
               mvpRating: res
            }
         }
         return acc
      }, {
         mvpRating: 0,
         elegible: []
      })
      const mvpFreeAgents = freeAgentIds.reduce<{ elegible: AppointmentTypePlayer[], mvpRating: number }>((acc, _id) => {
         const RATING = ratingMap[_id.toHexString()]
         const CG = _id.toHexString() === stats.topScorer.player.toHexString() ? 0.5 : 0
         const CA = _id.toHexString() === stats.topAssistman.player.toHexString() ? 0.5 : 0
         // MVP formula => RATING + CG + CA (no CP here)
         const res = RATING + CG + CA
         const current: AppointmentTypePlayer = {
            player: _id,
            type: AppointmentPlayerType.FreeAgent
         }
         if(res > acc.mvpRating) {
            return {
               elegible: [current],
               mvpRating: res
            }
         }
         if(res === acc.mvpRating){
            return {
               elegible: [...acc.elegible, current],
               mvpRating: res
            }
         }
         return acc
      }, {
         mvpRating: 0,
         elegible: []
      })

      const mvps = mvpRegistered.mvpRating > mvpFreeAgents.mvpRating
         ? mvpRegistered.elegible
         : mvpRegistered.mvpRating < mvpFreeAgents.mvpRating
            ? mvpFreeAgents.elegible
            : [...mvpRegistered.elegible, ...mvpFreeAgents.elegible]
      return mvps
   }


   // DOOOOOOONEEEEEE, don't touch (02.06.2021 at 16:53)
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
            let invitedMap: { [_id: string]: AppointmentInvitesInvitedPlayer } = {}
            // check if user is trying to remove invited players that already responded
            const removedWithResponses = currentAppointment.invites.lists.invited.reduce((acc, val) => {
               const { player, totalResponses } = val
               if(invited.includes(player.toHexString()) && totalResponses > 0) acc.push(val)
               invitedMap[player.toHexString()] = val
               return acc
            }, [])
            if(removedWithResponses.length) throw new Error(ErrorMessages.appointment_forbidden_removal_invited_players_already_responded)
            appointment.invites.lists.invited = invited.map(id=> {
               if(invitedMap[id]) return invitedMap[id]
               return {
                  player: new ObjectId(id),
                  totalResponses: 0
               }
            })
         }
      }
      // confirmed players can be modified only if the appointment hasn't been completed yet
      if([AppointmentState.Confirmed, AppointmentState.Scheduled].includes(currentAppointment.state)) {
         if(confirmed.length) {
            const unauthorizedRemoval = !!currentAppointment.invites.lists.confirmed.find(({ player }) => !confirmed.find(newConfirmedPlayer => player.toHexString() === newConfirmedPlayer._id) && !blacklisted.find(newBlacklistedPlayer => player.toHexString() === newBlacklistedPlayer._id))
            if(unauthorizedRemoval && currentAppointment.state === AppointmentState.Confirmed) throw new Error(ErrorMessages.appointment_forbidden_removal_confirmed_players_without_blacklisting)
            appointment.invites.lists.confirmed = confirmed.map(confirmedPlayer => ({ ...confirmedPlayer, player: new ObjectId(confirmedPlayer._id) }))
         }

         if(blacklisted.length) {
            appointment.invites.lists.blacklisted = blacklisted.map(blacklistedPlayer => ({ ...blacklistedPlayer, player: new ObjectId(blacklistedPlayer._id) }))
         }
      }
      
      await MongoDBInstance.collection.appointment.updateOne(
         { _id: new ObjectId(data._id), createdBy: new ObjectId(createdBy) },
         { $set: createMongoUpdateObject(appointment) }
      )
      return true
   }
   
   
   // DOOOOOOONEEEEEE, don't touch (29.05.2021 at 17:14)
   async updateState (data: UpdateAppointmentStateInput, createdBy: string): Promise<boolean> {
      const currentAppointment: Appointment = await MongoDBInstance.collection.appointment.findOne({ _id: data._id, createdBy: new ObjectId(createdBy) })
      if(data.state === currentAppointment.state) return true
      if([AppointmentState.Canceled, AppointmentState.Completed, AppointmentState.Interrupted].includes(currentAppointment.state)) {
         throw new Error(ErrorMessages.appointment_already_closed)
      }
      const now = dayjs().toISOString()
      const appointment = new Appointment()
      appointment.updatedAt = now

      // scheduled => confirmed|canceled
      // confirmed => completed|canceled| interrupted
      if(
         (currentAppointment.state === AppointmentState.Scheduled && ![AppointmentState.Confirmed, AppointmentState.Canceled].includes(data.state))
         ||
         currentAppointment.state === AppointmentState.Confirmed && ![AppointmentState.Completed, AppointmentState.Canceled, AppointmentState.Interrupted].includes(data.state)
      ) {
         throw new Error(ErrorMessages.appointment_update_failed_due_to_state)
      }

      appointment.state = data.state

      await MongoDBInstance.collection.appointment.updateOne(
         { _id: new ObjectId(data._id), createdBy: new ObjectId(createdBy) },
         { $set: createMongoUpdateObject(appointment) }
      )
      return true
   }


   // DOOOOOOONEEEEEE, don't touch (23.05.2021 at 02:15)
   async getList (filters: FiltersAppointment, pagination: Pagination, createdBy: string): Promise<List<Appointment>> {
      const {
         ids = [],
         states
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
      // filter by state
      if(states.length) query.push({ $match: { state: { $in: states } } })
         // sort
         // const sortStage = getSortStage(sort)
         // query.push(sortStage)
      // paginate
      query.push(facetCount({ skip, limit: _limit }))

      const res: Appointment[] = await MongoDBInstance.collection.appointment.aggregate(query).toArray()
      const result = {
         totalCount: get(res, '[0].totalCount[0].count', 0) as number,
         result: get(res, '[0].result', []) as Appointment[]
      }
      return result
   }


   // DOOOOOOONEEEEEE, don't touch (23.05.2021 at 02:26)
   async getAppointmentById (_id: string, createdBy: string): Promise<Appointment> {
      const appoitment: Appointment = await MongoDBInstance.collection.appointment.findOne({ _id: new ObjectId(_id), createdBy: new ObjectId(createdBy) })
      return appoitment
   }
   

   // DOOOOOOONEEEEEE, don't touch (23.05.2021 at 02:26)
   async getAppointmentsByIds (ids: string[], createdBy?: string|ObjectId): Promise<Appointment[]> {
      const appoitments: Appointment[] = await MongoDBInstance.collection.appointment.find({ _id: { $in: ids.map(id => new ObjectId(id)) }, ...createdBy && { createdBy: new ObjectId(createdBy) } }).toArray()
      return appoitments
   }
}

export const mongoAppointment = new MongoAppointment()
