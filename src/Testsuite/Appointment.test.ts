import 'reflect-metadata'
import assert from 'assert'
import { MongoDBInstance, MongoState } from '../MongoDB'
import { describe, it } from 'mocha'
import { validationErrorRegEx, setupTestsuite, TestsuiteSetupOperation } from './helpers'
import ErrorMessages from '../Utils/ErrorMessages'
import { ZenServer } from '../SDK'
import { field1, field2 } from './helpers/MockData/fields'
import dayjs from 'dayjs'
import { createPlayers } from './helpers/MassiveFakeInserts/createPlayers'
import { AppointmentPlayerType } from '../MongoDB/Appointment/Entities'
import { sampleSize, uniqBy } from 'lodash'
require('dotenv').config()

const apiInstance = new ZenServer()
const noTokenApiInstance = new ZenServer()

const setupConf = {
  [TestsuiteSetupOperation.Manager]: true,
  [TestsuiteSetupOperation.Fields]: true,
  [TestsuiteSetupOperation.FreeAgents]: true
}

describe('Appointment', () => {
  describe('Clear database', () => {
    it('Should clear database', async () => {
      if (MongoDBInstance.state === MongoState.Disconnected) {
        await MongoDBInstance.startConnection()
      }
      if (process.env.NODE_ENV === 'development') await MongoDBInstance.clearDb()
    })
  })

  describe('Setup', () => {
    it('Register a new manager', async () => {
      await setupTestsuite(setupConf, apiInstance)
    })
    it('Register 50 registered playres', async () => {
      await createPlayers(50, apiInstance)
    })
  })

  describe('Correct flow', () => {
    let appointmentId
    it('Create an appointment', async () => {
      const { result: invitedPlayers } = await apiInstance.player.getList({}, { skip: 0, limit: 20 }, {}, '{ result { _id } }')
      const { result: fields } = await apiInstance.field.getList({}, { skip: 0 }, '{ result { _id } }')
      const { result: freeAgents } = await apiInstance.freeAgent.getList({}, { skip: 0 }, '{ result { _id } }')
      const start = dayjs().add(7, 'days').toISOString()
      const end = dayjs(start).add(2, 'hours').toISOString()
      appointmentId = await apiInstance.appointment.create({
        field: fields[0]._id,
        start,
        end,
        pricePerPlayer: 150,
        notes: 'First appointment',
        invites: {
          confirmed: [{ _id: freeAgents[0]._id, type: AppointmentPlayerType.FreeAgent }],
          invited: invitedPlayers.map(({ _id }) => _id)
        }
      })
      const { result: appointments } = await apiInstance.appointment.getList({}, { skip: 0 }, '{ result { _id } }')
      assert.strictEqual(appointments.length, 1)
      assert.strictEqual(appointments[0]._id, appointmentId)
    })

    it('Edit appointment notes', async () => {
      const newNotes = 'Still first appointment but updated'
      await apiInstance.appointment.updateMainInfo({
        _id: appointmentId,
        notes: newNotes
      })
      const { result: appointments } = await apiInstance.appointment.getList({ ids: [appointmentId] }, { skip: 0 }, '{ result { _id, notes } }')
      assert.strictEqual(appointments.length, 1)
      assert.strictEqual(appointments[0].notes, newNotes)
    })

    it('Set appointment for tomorrow evening', async () => {
      const start = dayjs().add(1, 'days').toISOString()
      const end = dayjs(start).add(2, 'hours').toISOString()
      await apiInstance.appointment.updateMainInfo({
        _id: appointmentId,
        start,
        end
      })
      const { result: appointments } = await apiInstance.appointment.getList({ ids: [appointmentId] }, { skip: 0 }, '{ result { _id, date { start, end } } }')
      assert.strictEqual(appointments.length, 1)
      assert.strictEqual(dayjs(appointments[0].date.start).isSame(start), true)
      assert.strictEqual(dayjs(appointments[0].date.end).isSame(end), true)
    })

    it('Change location (field)', async () => {
      const { result: fields } = await apiInstance.field.getList({}, { skip: 0 }, '{ result { _id } }')
      await apiInstance.appointment.updateMainInfo({
        _id: appointmentId,
        field: fields[1]._id
      })
      const { result: appointments } = await apiInstance.appointment.getList({ ids: [appointmentId] }, { skip: 0 }, '{ result { _id, field { _id } } }')
      assert.strictEqual(appointments.length, 1)
      assert.strictEqual(appointments[0].field._id, fields[1]._id)
    })

    it('Change price per player', async () => {
      await apiInstance.appointment.updateMainInfo({
        _id: appointmentId,
        pricePerPlayer: 500 // 5€
      })
      const { result: appointments } = await apiInstance.appointment.getList({ ids: [appointmentId] }, { skip: 0 }, '{ result { pricePerPlayer } }')
      assert.strictEqual(appointments.length, 1)
      assert.strictEqual(appointments[0].pricePerPlayer, 500)
    })

    it('Change confirmed players', async () => {
      const { result } = await apiInstance.appointment.getList({}, { skip: 0 }, `{
        result {
          _id,
          invites {
            lists {
              invited {
                player {
                  _id
                }
              },
              confirmed {
                type,
                player {
                  ...on Player {
                    _id
                  },
                  ...on FreeAgent {
                    _id
                  }
                }
              }
            }
          }
        }
      }`)
      const { invites: { lists: { invited = [], confirmed = [] } } } = result[0]
      const confirmedFromInvited = sampleSize(invited, 7)
      const newConfirmed = uniqBy([...confirmed.map(el => ({ type: el.type, _id: el.player._id })), ...confirmedFromInvited.map(el => ({ type: AppointmentPlayerType.Registered, _id: el.player._id }))], '_id')

      await apiInstance.appointment.updateInvites({
        _id: appointmentId,
        invites: {
          confirmed: newConfirmed
        }
      })
      const { result: appointments } = await apiInstance.appointment.getList({ ids: [appointmentId] }, { skip: 0 }, `{
        result {
          _id,
          invites {
            lists {
              invited {
                player {
                  _id
                }
              },
              confirmed {
                type,
                player {
                  ...on Player {
                    _id
                  },
                  ...on FreeAgent {
                    _id
                  }
                }
              }
            }
          }
        }
      }`)
      assert.strictEqual(appointments.length, 1)
      assert.strictEqual(appointments[0].invites.lists.confirmed.length, newConfirmed.length)
    })
  })
})
