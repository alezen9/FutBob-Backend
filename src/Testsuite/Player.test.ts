import 'reflect-metadata'
import assert from 'assert'
import { MongoDBInstance, MongoState } from '../MongoDB'
import { ZenServer } from '../SDK'
import { describe, it } from 'mocha'
import { validationErrorRegEx, setupTestsuite, TestsuiteSetupOperation } from './helpers'
import ErrorMessages from '../Utils/ErrorMessages'
import { PlayerPosition } from '../MongoDB/Player/Entities'
import { isEqual } from 'lodash'
import { player1, player2 } from './helpers/MockData/players'

const apiInstance = new ZenServer()
const noTokenApiInstance = new ZenServer()

const setupConf = {
  [TestsuiteSetupOperation.Manager]: true
}

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
      await setupTestsuite(setupConf, apiInstance)
    })
  })

  describe('Create', () => {
    it('Create a new player', async () => {
      const { _id: _idPlr, user: { registry }, ...body } = player1
      const userId = await apiInstance.user.create(registry)
      player1.user._id = userId
      const playerId = await apiInstance.player.create({ ...body, user: userId })
      player1._id = playerId
      const { result } = await apiInstance.player.getList({}, { skip: 0 }, {}, `{ result { _id, user { _id } } }`)
      assert.strictEqual(result.length, 1)
      assert.strictEqual(result[0]._id, playerId)
      assert.strictEqual(result[0].user._id, userId)
    })

    it('Try to create a new player without token', async () => {
      try {
        const { user: { registry } } = player1
        await noTokenApiInstance.user.create(registry)
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.user_unauthenticated)
      }
    })

    it('Try to create a new player without specified user', async () => {
      try {
        const { _id, user, ...body } = player1
        // @ts-expect-error
        await apiInstance.player.create(body)
      } catch (error) {
        assert.strictEqual(!!error, true)
      }
    })

    it('Try to create a new player with missing required fields', async () => {
      try {
        const { _id, user, positions, ...body } = player1
        // @ts-expect-error
        await apiInstance.player.create({ ...body, user: user._id })
      } catch (error) {
        assert.strictEqual(typeof error, 'string')
        assert.strictEqual(validationErrorRegEx.test(error), true)
      }
    })
  })

  describe('Delete', () => {
    it('Try to delete an existing player without token', async () => {
      try {
        await noTokenApiInstance.user.delete(player1.user._id)
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.user_unauthenticated)
      }
    })

    it('Delete an existing player', async () => {
      const done = await apiInstance.user.delete(player1.user._id)
      assert.strictEqual(done, true)
      const { result } = await apiInstance.player.getList({}, { skip: 0 }, {}, `{ result { _id } }`)
      assert.strictEqual(result.length, 0)
      player1._id = undefined
      player1.user._id = undefined
    })
  })

  describe('Update', () => {
    it('Create 2 new player', async () => {
      const { _id: plrId, user: { registry }, ...body } = player1
      const userId = await apiInstance.user.create(registry)
      player1.user._id = userId
      const playerId = await apiInstance.player.create({ ...body, user: userId })
      player1._id = playerId

      const { _id: plrId2, user: { registry: registry2 }, ...body2 } = player2
      const userId2 = await apiInstance.user.create(registry2)
      player2.user._id = userId2
      const playerId2 = await apiInstance.player.create({ ...body2, user: userId2 })
      player2._id = playerId2

      const { result } = await apiInstance.player.getList({}, { skip: 0 }, {}, `{ result { _id, user { _id } } }`)
      assert.strictEqual(result.length, 2)
      assert.strictEqual(result[0]._id, playerId)
      assert.strictEqual(result[0].user._id, userId)
      assert.strictEqual(result[0]._id, playerId)
      assert.strictEqual(result[1].user._id, userId2)
    })

    it('Update a player position', async () => {
      const { _id } = player1
      await apiInstance.player.update({
        _id,
        positions: [PlayerPosition.GoalKeeper]
      })

      const { result } = await apiInstance.player.getList({ ids: [_id] }, { skip: 0 }, {}, `{ result { _id, positions } }`)
      assert.strictEqual(result.length, 1)
      assert.strictEqual(isEqual(result[0].positions, [PlayerPosition.GoalKeeper]), true)
    })

    it('Update a player score values', async () => {
      const { _id, score } = player1
      const newScoreValues = {
        ...score,
        pace: {
          speed: 100,
          stamina: 100
        }
      }
      await apiInstance.player.update({
        _id,
        score: newScoreValues
      })

      const { result } = await apiInstance.player.getList({ ids: [_id] }, { skip: 0 }, {}, `{ result { _id, score { pace { speed, stamina } } } }`)
      assert.strictEqual(result.length, 1)
      assert.strictEqual(result[0].score.pace.speed, newScoreValues.pace.speed)
      assert.strictEqual(result[0].score.pace.stamina, newScoreValues.pace.stamina)
    })

    it('Update a player info', async () => {
      const { _id, user } = player1
      const newName = 'Thor'
      await apiInstance.user.update({
        _id: user._id,
        name: newName
      })

      const { result } = await apiInstance.player.getList({ ids: [_id] }, { skip: 0 }, {}, `{ result { _id, user { _id, registry { name } } } }`)
      assert.strictEqual(result.length, 1)
      assert.strictEqual(result[0]._id, _id)
      assert.strictEqual(result[0].user._id, user._id)
      assert.strictEqual(result[0].user.registry.name, newName)
    })

    it('Try to update a deleted player position', async () => {
      const { user: { _id } } = player1
      await apiInstance.user.delete(_id)
      const { result } = await apiInstance.player.getList({ ids: [_id] }, { skip: 0 }, {}, `{ result { _id } }`)
      assert.strictEqual(result.length, 0)
      try {
        await apiInstance.player.update({
          _id,
          positions: [PlayerPosition.LeftWing]
        })
      } catch (error) {
        assert.strictEqual(error, ErrorMessages.player_update_failed)
      }
    })
  })
})
