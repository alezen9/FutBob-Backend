import { MongoDBInstance } from '..'
import { ObjectId } from 'mongodb'
import fs from 'fs'
import { final } from './backup'

class _Dev {
  async _backupAll () {
    const users = await MongoDBInstance.collection.user.find().toArray()
    const players = await MongoDBInstance.collection.player.find().toArray()
    const fields = await MongoDBInstance.collection.field.find().toArray()
    const freeAgents = await MongoDBInstance.collection.freeAgent.find().toArray()

    fs.mkdirSync('backup', { recursive: true })
    fs.writeFileSync('backup/users.json', JSON.stringify({ users }))
    fs.writeFileSync('backup/players.json', JSON.stringify({ players }))
    fs.writeFileSync('backup/fields.json', JSON.stringify({ fields }))
    fs.writeFileSync('backup/freeAgents.json', JSON.stringify({ freeAgents }))
    fs.writeFileSync('backup/index.json', JSON.stringify({
      users,
      players,
      fields,
      freeAgents
    }))
  }

  async _bonificaAll () {
    const { newUsers, newPlayers, fields: newFields } = final
    await MongoDBInstance.clearDb()
    const adaptedUsers = newUsers.map(usr => ({
      ...usr,
      _id: new ObjectId(usr._id),
      createdBy: new ObjectId(usr.createdBy),
      ...usr.player && {
        player: new ObjectId(usr.player)
      }
    }))
    await MongoDBInstance.collection.user.insertMany(adaptedUsers)
    const adaptedPlayers = newPlayers.map(plr => ({
      ...plr,
      _id: new ObjectId(plr._id),
      createdBy: new ObjectId(plr.createdBy),
      user: new ObjectId(plr.user)
    }))
    await MongoDBInstance.collection.player.insertMany(adaptedPlayers)
    const adaptedFields = newFields.map(fld => ({
      ...fld,
      _id: new ObjectId(fld._id),
      createdBy: new ObjectId(fld.createdBy)
    }))
    await MongoDBInstance.collection.field.insertMany(adaptedFields)
  }

  // _bonificaUsers () {
  //   const res = users.map(user => {
  //     return {
  //       _id: user._id,
  //       createdBy: user.createdBy,
  //       createdAt: user.createdAt,
  //       ...user.updatedAt && { updatedAt: user.updatedAt },
  //       registry: {
  //         name: user.name,
  //         surname: user.surname,
  //         dateOfBirth: user.dateOfBirth,
  //         sex: user.sex,
  //         country: user.country,
  //         phone: user.phone
  //       },
  //       ...user.credentials && {
  //         credentials: {
  //           email: user.email,
  //           password: user.credentials.password,
  //           verifyAccount: {
  //             confirmed: true,
  //             code: 'f0f6326d-6887-48e4-b503-b557529d1dbd'
  //           }
  //         }
  //       },
  //       privileges: user.privileges,
  //       ...user.futsalPlayer && { player: user.futsalPlayer }
  //     }
  //   })
  //   return res
  //   // write to db
  // }

  // _bonificaPlayers (_users) {
  //   const res = players.reduce((acc, player) => {
  //     const hasUser = _users.find(user => get(user, 'player', null) === player._id)
  //     if (!hasUser) return acc
  //     const newPlayer = {
  //       _id: player._id,
  //       createdBy: player.createdBy,
  //       createdAt: player.createdAt,
  //       ...player.updatedAt && { updatedAt: player.updatedAt },
  //       user: player.user,
  //       positions: [0],
  //       state: 1,
  //       score: initialScoreValues
  //     }
  //     acc.push(newPlayer)
  //     return acc
  //   }, [])
  //   return res
  //   // write to db
  // }
}

export const mongo_Dev = new _Dev()
