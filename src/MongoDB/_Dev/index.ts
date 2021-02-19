import { MongoDBInstance } from '..'
import fs from 'fs'

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
}

export const mongo_Dev = new _Dev()
