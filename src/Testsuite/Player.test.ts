import assert from 'assert'
import { MongoDBInstance, MongoState } from '../MongoDB'
import { ZenServer } from '../SDK'
import { describe, it } from 'mocha'
import { validationErrorRegEx, setupTestsuite, TestsuiteSetupStep } from './helpers'
import { User } from '../MongoDB/User/Entities'
import ErrorMessages from '../Utils/ErrorMessages'
import { PlayerPosition, PlayerScore } from '../MongoDB/Player/Entities'
import { isEqual }from 'lodash'
import { player1, player2, players } from './helpers/MockData/players'

const apiInstance = new ZenServer()
const noTokenApiInstance = new ZenServer()

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
      const playerId: string = await apiInstance.player.create(body)
      player1._id = playerId
      const res = await apiInstance.player.getList({}, `{ result { _id, user { _id } } }`)
      const players: Array<{ _id: string, user: User }> = res.result
      assert.strictEqual(players.length, 1)
      assert.strictEqual(players[0]._id, playerId)
      player1.idUser = players[0].user._id
    })

    it('Try to create a new player without token', async () => {
      try {
        const { _id, idUser, ...body } = player1
        await noTokenApiInstance.player.create(body)
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.user_unauthenticated)
      }
    })

    it('Try to create a new player without specified user', async () => {
      try {
        const { _id, idUser, userData, ...body } = player1
        //@ts-expect-error
        await apiInstance.player.create(body)
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.player_user_not_specified)
      }
    })

    it('Try to create a new player with missing required fields', async () => {
      try {
        const { _id, idUser, playerData, ...body } = player1
        //@ts-expect-error
        await apiInstance.player.create(body)
      } catch (error) {
        assert.strictEqual(typeof error, 'string')
        assert.strictEqual(validationErrorRegEx.test(error), true)
      }
    })
  })
  
  describe('Delete', () => {
    it('Try to delete an existing player without token', async () => {
      try {
      const { _id, idUser } = player1
      const done: boolean = await noTokenApiInstance.player.delete({ _id, idUser })
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.user_unauthenticated)
      }
    })

     it('Delete an existing player', async () => {
      const { _id, idUser } = player1
      const done: boolean = await apiInstance.player.delete({ _id, idUser })

      assert.strictEqual(done, true)
      const res = await apiInstance.player.getList({}, `{ result { _id } }`)
      const players: Array<{_id: string}> = res.result
      assert.strictEqual(players.length, 0)
      player1._id = undefined
      player1.idUser = undefined
    })
  })

  describe('Update', () => {
     it('Create 2 new player', async () => {
      const { _id, idUser, ...body } = player1
      const playerId: string = await apiInstance.player.create(body)
      const { _id: _id2, idUser: idUser2, ...body2 } = player2
      const playerId2: string = await apiInstance.player.create(body2)

      const res = await apiInstance.player.getList({}, `{ result { _id, user { _id } } }`)
      const players: Array<{ _id: string, user: User }> = res.result
      assert.strictEqual(players.length, 2)
      assert.strictEqual(players[0]._id, playerId)
      assert.strictEqual(players[1]._id, playerId2)
      player1._id = playerId
      player2._id = playerId2
      player1.idUser = players[0].user._id
      player2.idUser = players[1].user._id
    })

    it('Update a player position', async () => {
      const { _id } = player1
      const done: boolean = await apiInstance.player.update({
        _id,
        positions: [PlayerPosition.FutsalGoalKeeper]
      })

      const res = await apiInstance.player.getList({ ids: [_id]}, `{ result { _id, positions } }`)
      const players: Array<{ _id: string, positions: PlayerPosition[] }> = res.result
      assert.strictEqual(players.length, 1)
      assert.strictEqual(isEqual(players[0].positions, [PlayerPosition.FutsalGoalKeeper]), true)
    })

    it('Update a player score values', async () => {
      const { _id, playerData: { score } } = player1
      const newScoreValues = {
        ...score,
        pace: {
          speed: 100,
          stamina: 100
        }
      }
      const done: boolean = await apiInstance.player.update({
        _id,
        score: newScoreValues
      })

      const res = await apiInstance.player.getList({ ids: [_id]}, `{ result { _id, score { pace { speed, stamina } } } }`)
      const players: Array<{ _id: string, score: PlayerScore }> = res.result
      assert.strictEqual(players.length, 1)
      assert.strictEqual(players[0].score.pace.speed, newScoreValues.pace.speed)
      assert.strictEqual(players[0].score.pace.stamina, newScoreValues.pace.stamina)
    })

    it('Update a player info', async () => {
      const { _id, idUser } = player1
      const newName = 'Ace'
      await apiInstance.user.update({
        _id: idUser,
        name: newName
      })

      const res = await apiInstance.player.getList({ ids: [_id]}, `{ result { _id, user { _id, registry { name } } } }`)
      const players: Array<{ _id: string, user: User, positions: PlayerPosition[] }> = res.result
      assert.strictEqual(players.length, 1)
      assert.strictEqual(players[0].user._id, idUser)
      assert.strictEqual(players[0].user.registry.name, newName)
    })

    it('Try to update a deleted player position', async () => {
      const { _id, idUser } = player1
      await apiInstance.player.delete({ _id, idUser })
      const res = await apiInstance.player.getList({ ids: [_id]}, `{ result { _id } }`)
      const players: Array<{ _id: string }> = res.result
      assert.strictEqual(players.length, 0)
      try {
        await apiInstance.player.update({
          _id,
          positions: [PlayerPosition.FutsalLeftWing]
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
      const promises = lotOfPlayers.map(body => apiInstance.player.create(body))
      await Promise.all(promises)
    })

    // only for testing
    it.skip('Get players pagination', async () => {
      const res = await apiInstance.player.getList({ pagination: { skip: 0, limit: 18 } }, `{ result { _id, user { _id } } }`)
      const players: any[] = res.result
      assert.strictEqual(players.length, 18)
    })
  })
})
