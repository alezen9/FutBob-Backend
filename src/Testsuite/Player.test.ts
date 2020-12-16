import assert from 'assert'
import { MongoDBInstance, MongoState } from '../MongoDB'
import { FutBobServer } from '../SDK'
import { describe, it } from 'mocha'
import { validationErrorRegEx, setupTestsuite, TestsuiteSetupStep } from './helpers'
import { User } from '../MongoDB/User/Entities'
import ErrorMessages from '../Utils/ErrorMessages'
import { PlayerPosition, PlayerType, PlayerScore } from '../MongoDB/Player/Entities'
import { isEqual }from 'lodash'
import { player1, player2, players } from './helpers/MockData/players'

const apiInstance = new FutBobServer()
const noTokenApiInstance = new FutBobServer()

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
      const res = await apiInstance.player_getPlayers({}, `{ result { _id, user { _id }, type } }`)
      const players: Array<{ _id: string, user: User, type: PlayerType }> = res.result
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
      const res = await apiInstance.player_getPlayers({}, `{ result { _id } }`)
      const players: Array<{_id: string}> = res.result
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

      const res = await apiInstance.player_getPlayers({}, `{ result { _id, user { _id }, type } }`)
      const players: Array<{ _id: string, user: User, type: PlayerType }> = res.result
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

      const res = await apiInstance.player_getPlayers({ ids: [_id]}, `{ result { _id, positions } }`)
      const players: Array<{ _id: string, type: PlayerType, positions: PlayerPosition[] }> = res.result
      assert.strictEqual(players.length, 1)
      assert.strictEqual(isEqual(players[0].positions, [PlayerPosition.Striker]), true)
    })

    it('Update a player score values', async () => {
      const { _id, playerData: { score } } = player1
      const newScoreValues = {
        ...score,
        pace: {
          acceleration: 100,
          sprintSpeed: 100
        }
      }
      const done: boolean = await apiInstance.player_updatePlayer({
        _id,
        score: newScoreValues
      })

      const res = await apiInstance.player_getPlayers({ ids: [_id]}, `{ result { _id, score { pace { acceleration, sprintSpeed } } } }`)
      const players: Array<{ _id: string, type: PlayerType, score: PlayerScore }> = res.result
      assert.strictEqual(players.length, 1)
      assert.strictEqual(players[0].score.pace.acceleration, newScoreValues.pace.acceleration)
      assert.strictEqual(players[0].score.pace.sprintSpeed, newScoreValues.pace.sprintSpeed)
    })

    it('Update a player info', async () => {
      const { _id, idUser } = player1
      const newName = 'Ace'
      await apiInstance.user_updateUser({
        _id: idUser,
        name: newName
      })

      const res = await apiInstance.player_getPlayers({ ids: [_id]}, `{ result { _id, user { _id, name } } }`)
      const players: Array<{ _id: string, user: User, type: PlayerType, positions: PlayerPosition[] }> = res.result
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
      const res = await apiInstance.player_getPlayers({ ids: [_id]}, `{ result { _id } }`)
      const players: Array<{ _id: string }> = res.result
      assert.strictEqual(players.length, 0)
      try {
        await apiInstance.player_updatePlayer({
          _id,
          positions: [PlayerPosition.LeftWingBack]
        })
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.player_update_failed)
      }
    })

    // only for testing
    it.skip('Populate players', async () => {
      let lotOfPlayers = players
      for(let i = 0; i < 100; i++) {
        lotOfPlayers = [...lotOfPlayers, ...players]
      }
      const promises = lotOfPlayers.map(body => apiInstance.player_createPlayer(body))
      await Promise.all(promises)
    })

    // only for testing
    it.skip('Get players pagination', async () => {
      const res = await apiInstance.player_getPlayers({ pagination: { skip: 0, limit: 18 } }, `{ result { _id, user { _id }, type } }`)
      const players: any[] = res.result
      assert.strictEqual(players.length, 18)
    })
  })
})
