import assert from 'assert'
import { MongoDBInstance, MongoState } from '../MongoDB'
import { FutBobServer } from '../SDK'
import { describe, it } from 'mocha'
import { validationErrorRegEx, setupTestsuite, TestsuiteSetupStep } from './helpers'
import { Sex, User } from '../MongoDB/User/entities'
import ErrorMessages from '../Utils/ErrorMessages'
import moment from 'moment'
import { PlayerPosition, PlayerType } from '../MongoDB/Player/Entities'
import { isEqual }from 'lodash'
import { asyncTimeout } from '../Utils/helpers'

const apiInstance = new FutBobServer()
const noTokenApiInstance = new FutBobServer()

const player1 = {
  _id: undefined,
  idUser: undefined,
  userData: {
    name: 'Naumche',
    surname: 'Gjroeski',
    dateOfBirth: '1985-01-03T23:00:00.000Z',
    phone: '+39 234234342',
    sex: Sex.Male
  },
  playerData: {
    positions: [
      PlayerPosition.CenterForward,
      PlayerPosition.CentreBack,
      PlayerPosition.DefensiveMidfielder
    ],
    type: PlayerType.Football
  }
}

const player2 = {
  _id: undefined,
  idUser: undefined,
  userData: {
    name: 'Boban',
    surname: 'Cvetanoski',
    dateOfBirth: '1997-08-17T22:00:00.000Z',
    phone: '+39 7686787874',
    sex: Sex.Male
  },
  playerData: {
    positions: [
      PlayerPosition.FutsalForward,
      PlayerPosition.FutsalForward,
      PlayerPosition.FutsalGoalKeeper
    ],
    type: PlayerType.Futsal
  }
}

// const players = [
//   {
//     _id: undefined,
//     userData: {
//       name: 'Naumche',
//       surname: 'Gjroeski',
//       dateOfBirth: '1985-01-03T23:00:00.000Z',
//       phone: '+39 234234342',
//       sex: Sex.Male
//     },
//     playerData: {
//       positions: [
//         PlayerPosition.CenterForward,
//         PlayerPosition.CentreBack,
//         PlayerPosition.DefensiveMidfielder
//       ],
//       type: PlayerType.Football
//     }
//   },
//   {
//     _id: undefined,
//     userData: {
//       name: 'Cristian Camilo',
//       surname: 'Quintero Villa',
//       dateOfBirth: '1994-01-04T23:00:00.000Z',
//       phone: '+39 234234342',
//       sex: Sex.Male
//     },
//     playerData: {
//       positions: [
//         PlayerPosition.FutsalForward,
//         PlayerPosition.FutsalForward
//       ],
//       type: PlayerType.Futsal
//     }
//   },
//   {
//     _id: undefined,
//     userData: {
//       name: 'Boban',
//       surname: 'Cvetanoski',
//       dateOfBirth: '1997-08-17T22:00:00.000Z',
//       phone: '+39 7686787874',
//       sex: Sex.Male
//     },
//     playerData: {
//       positions: [
//         PlayerPosition.FutsalForward,
//         PlayerPosition.FutsalForward,
//         PlayerPosition.FutsalGoalKeeper
//       ],
//       type: PlayerType.Futsal
//     }
//   }
// ]

describe('Player', () => {
  describe('Clear database', () => {
    it('Should clear database', async () => {
      if (MongoDBInstance.state === MongoState.Disconnected) {
        await MongoDBInstance.startConnection()
      }
      await MongoDBInstance.clearDb()
    })
  })

  describe('Setup', () => {
    it('Register a new manager', async () => {
      await setupTestsuite(TestsuiteSetupStep.WithManager, apiInstance)
    })
  })

  describe('Create', () => {
    it('Create a new player', async () => {
      const { _id, idUser, ...body } = player1
      const playerId: string = await apiInstance.player_createPlayer(body)
      player1._id = playerId
      const players: Array<{ _id: string, user: User, type: PlayerType }> = await apiInstance.player_getPlayers({}, `{ _id, user { _id }, type }`)
      assert.strictEqual(players.length, 1)
      assert.strictEqual(players[0]._id, playerId)
      assert.strictEqual(players[0].type, player1.playerData.type)
      player1.idUser = players[0].user._id
    })

    it('Try to create a new player without token', async () => {
      try {
        const { _id, idUser, ...body } = player1
        await noTokenApiInstance.player_createPlayer(body)
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.user_unauthenticated)
      }
    })

    it('Try to create a new player without specified user', async () => {
      try {
        const { _id, idUser, userData, ...body } = player1
        // @ts-expect-error => userData is required
        await apiInstance.player_createPlayer(body)
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.player_user_not_specified)
      }
    })

    it('Try to create a new player with missing required fields', async () => {
      try {
        const { _id, idUser, playerData, ...body } = player1
        // @ts-expect-error => playerData is required
        await apiInstance.player_createPlayer(body)
      } catch (error) {
        assert.strictEqual(typeof error, 'string')
        assert.strictEqual(validationErrorRegEx.test(error), true)
      }
    })
  })
  
  describe('Delete', () => {
    it('Try to delete an existing player without token', async () => {
      try {
      const { _id, idUser, playerData: { type } } = player1
      const done: boolean = await noTokenApiInstance.player_deletePlayer({
        _id,
        idUser,
        type
      })
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.user_unauthenticated)
      }
    })

     it('Delete an existing player', async () => {
      const { _id, idUser, playerData: { type } } = player1
      const done: boolean = await apiInstance.player_deletePlayer({
        _id,
        idUser,
        type
      })

      assert.strictEqual(done, true)
      const players: Array<{_id: string}> = await apiInstance.player_getPlayers({}, `{ _id }`)
      assert.strictEqual(players.length, 0)
      player1._id = undefined
      player1.idUser = undefined
    })
  })

  describe('Update', () => {
     it('Create 2 new player', async () => {
      const { _id, idUser, ...body } = player1
      const playerId: string = await apiInstance.player_createPlayer(body)
      const { _id: _id2, idUser: idUser2, ...body2 } = player2
      const playerId2: string = await apiInstance.player_createPlayer(body2)

      const players: Array<{ _id: string, user: User, type: PlayerType }> = await apiInstance.player_getPlayers({}, `{ _id, user { _id }, type }`)
      assert.strictEqual(players.length, 2)
      assert.strictEqual(players[0]._id, playerId)
      assert.strictEqual(players[0].type, player1.playerData.type)
      assert.strictEqual(players[1]._id, playerId2)
      assert.strictEqual(players[1].type, player2.playerData.type)
      player1._id = playerId
      player2._id = playerId2
      player1.idUser = players[0].user._id
      player2.idUser = players[1].user._id
    })

    it('Update a player position', async () => {
      const { _id } = player1
      const done: boolean = await apiInstance.player_updatePlayer({
        _id,
        positions: [PlayerPosition.Striker]
      })

      const players: Array<{ _id: string, type: PlayerType, positions: PlayerPosition[] }> = await apiInstance.player_getPlayers({ ids: [_id]}, `{ _id, positions }`)
      assert.strictEqual(players.length, 1)
      assert.strictEqual(isEqual(players[0].positions, [PlayerPosition.Striker]), true)
    })

    it('Update a player info', async () => {
      const { _id, idUser } = player1
      const newName = 'Ace'
      await apiInstance.user_updateUser({
        _id: idUser,
        name: newName
      })

      const players: Array<{ _id: string, user: User, type: PlayerType, positions: PlayerPosition[] }> = await apiInstance.player_getPlayers({ ids: [_id]}, `{ _id, user { _id, name } }`)
      assert.strictEqual(players.length, 1)
      assert.strictEqual(players[0].user._id, idUser)
      assert.strictEqual(players[0].user.name, newName)
    })

    it('Try to update a deleted player position', async () => {
      const { _id, idUser, playerData: { type } } = player1
      await apiInstance.player_deletePlayer({
        _id,
        idUser,
        type
      })
      const players = await apiInstance.player_getPlayers({ ids: [_id]}, `{ _id }`)
      assert.strictEqual(players.length, 0)
      try {
        await apiInstance.player_updatePlayer({
          _id,
          positions: [PlayerPosition.LeftWingBack]
        })
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.player_update_not_possible)
      }
    })
  })
})
