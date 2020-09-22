import assert from 'assert'
import { MongoDBInstance, MongoState } from '../MongoDB'
import { FutBobServer } from '../SDK'
import { describe, it } from 'mocha'
import { validationErrorRegEx, setupTestsuite, TestsuiteSetupStep } from './helpers'
import { Sex, User } from '../MongoDB/User/Entities'
import ErrorMessages from '../Utils/ErrorMessages'
import moment from 'moment'
import { PlayerPosition, PlayerType, PlayerScore } from '../MongoDB/Player/Entities'
import { isEqual }from 'lodash'

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
    sex: Sex.Male,
    country: 'MK'
  },
  playerData: {
    positions: [
      PlayerPosition.CenterForward,
      PlayerPosition.CentreBack,
      PlayerPosition.DefensiveMidfielder
    ],
    type: PlayerType.Football,
    score: {
      pace: {
        acceleration: 78,
        sprintSpeed: 84
      },
      shooting: {
        positioning: 82,
        finishing: 87,
        shotPower: 91,
        longShots: 86,
        volleys: 75,
        penalties: 85
      },
      passing: {
        vision: 87,
        crossing: 73,
        freeKick: 77,
        shortPassing: 93,
        longPassing: 89,
        curve: 87
      },
      dribbling: {
        agility: 85,
        balance: 83,
        reactions: 84,
        ballControl: 85,
        dribbling: 84,
        composure: 80
      },
      defense: {
        interceptions: 70,
        heading: 55,
        defensiveAwareness: 45,
        standingTackle: 55,
        slidingTackle: 40
      },
      physical: {
        jumping: 70,
        stamina: 78,
        strength: 73,
        aggression: 45
      }
    }
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
    sex: Sex.Male,
    country: 'MK'
  },
  playerData: {
    positions: [
      PlayerPosition.FutsalLeftWing,
      PlayerPosition.FutsalRightWing,
      PlayerPosition.FutsalBack,
      PlayerPosition.FutsalGoalKeeper
    ],
    type: PlayerType.Futsal,
    score: {
      pace: {
        acceleration: 35,
        sprintSpeed: 40
      },
      shooting: {
        positioning: 65,
        finishing: 65,
        shotPower: 60,
        longShots: 50,
        volleys: 68,
        penalties: 78
      },
      passing: {
        vision: 73,
        crossing: 68,
        freeKick: 60,
        shortPassing: 80,
        longPassing: 64,
        curve: 58
      },
      dribbling: {
        agility: 45,
        balance: 45,
        reactions: 67,
        ballControl: 60,
        dribbling: 55,
        composure: 68
      },
      defense: {
        interceptions: 68,
        heading: 50,
        defensiveAwareness: 65,
        standingTackle: 68,
        slidingTackle: 61
      },
      physical: {
        jumping: 50,
        stamina: 45,
        strength: 55,
        aggression: 78
      }
    }
  }
}

const _players = [
    {
    userData: {
      name: 'Boban',
      surname: 'Cvetanoski',
      dateOfBirth: '1997-08-17T22:00:00.000Z',
      phone: '+39 7686787874',
      sex: Sex.Male,
      country: 'MK'
    },
    playerData: {
      positions: [
        PlayerPosition.FutsalLeftWing,
        PlayerPosition.FutsalRightWing,
        PlayerPosition.FutsalBack,
        PlayerPosition.FutsalGoalKeeper
      ],
      type: PlayerType.Futsal,
      score: {
        pace: {
          acceleration: 35,
          sprintSpeed: 40
        },
        shooting: {
          positioning: 65,
          finishing: 65,
          shotPower: 60,
          longShots: 50,
          volleys: 68,
          penalties: 78
        },
        passing: {
          vision: 73,
          crossing: 68,
          freeKick: 60,
          shortPassing: 80,
          longPassing: 64,
          curve: 58
        },
        dribbling: {
          agility: 45,
          balance: 45,
          reactions: 67,
          ballControl: 60,
          dribbling: 55,
          composure: 68
        },
        defense: {
          interceptions: 68,
          heading: 50,
          defensiveAwareness: 65,
          standingTackle: 68,
          slidingTackle: 61
        },
        physical: {
          jumping: 50,
          stamina: 45,
          strength: 55,
          aggression: 78
        }
      }
    }
  },
  {
    userData: {
      name: 'Aleksandar',
      surname: 'Gjoreski',
      dateOfBirth: '1993-03-06T23:00:00.000Z',
      phone: '+39 3408947641',
      sex: Sex.Male,
      country: 'MK'
    },
    playerData: {
      positions: [
        PlayerPosition.FutsalLeftWing,
        PlayerPosition.FutsalRightWing,
        PlayerPosition.FutsalBack,
        PlayerPosition.FutsalGoalKeeper
      ],
      type: PlayerType.Futsal,
      score: {
        pace: {
          acceleration: 78,
          sprintSpeed: 84
        },
        shooting: {
          positioning: 82,
          finishing: 87,
          shotPower: 91,
          longShots: 86,
          volleys: 75,
          penalties: 85
        },
        passing: {
          vision: 87,
          crossing: 73,
          freeKick: 77,
          shortPassing: 93,
          longPassing: 89,
          curve: 87
        },
        dribbling: {
          agility: 85,
          balance: 83,
          reactions: 84,
          ballControl: 85,
          dribbling: 84,
          composure: 80
        },
        defense: {
          interceptions: 70,
          heading: 55,
          defensiveAwareness: 45,
          standingTackle: 55,
          slidingTackle: 40
        },
        physical: {
          jumping: 70,
          stamina: 78,
          strength: 73,
          aggression: 45
        }
      }
    }
  }
]

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

      const players: Array<{ _id: string, type: PlayerType, score: PlayerScore }> = await apiInstance.player_getPlayers({ ids: [_id]}, `{ _id, score { pace { acceleration, sprintSpeed } } }`)
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

    // only for testing
    it('Populate players', async () => {
      let lotOfPlayers = _players
      // for(let i = 0; i < 100; i++) {
      //   lotOfPlayers = [...lotOfPlayers, ..._players]
      // }
      const promises = lotOfPlayers.map(body => apiInstance.player_createPlayer(body))
      await Promise.all(promises)
    })
  })
})
