import { MongoClient } from 'mongodb'
import { CollectionContainer } from './Entities'
require('dotenv').config()

export enum MongoState {
  Connected,
  Disconnected
}

export class MongoDB {
  collection: CollectionContainer
  client: MongoClient
  dbUri: string
  dbName:string
  state: MongoState

  constructor(dbUri?:string, dbName?:string){
    const { dbUri: initDbUri, dbName: initDbName } = this.getMongoInit()
    this.dbUri = dbUri || initDbUri
    this.dbName = dbName || initDbName
    this.state = MongoState.Disconnected
  }

  getMongoInit (){
    return {
      dbUri: process.env.NODE_ENV === 'production'
        ? process.env.MONGO_DB_URI
        : 'mongodb://localhost:27017/',
      dbName: process.env.NODE_ENV === 'production'
        ? 'main'
        : 'test'
    }
  }

  async startConnection () {
    try {
      const client = await MongoClient.connect(
          this.dbUri,
          { useNewUrlParser: true, useUnifiedTopology: true }
        )
      this.setupCollections(client)
      this.state = MongoState.Connected
    } catch (error) {
      console.error(error)
    }
  }

  setupCollections(client:MongoClient) {
      const collection = new CollectionContainer()
      // create collections
      client.db(this.dbName).createCollection('User')
      client.db(this.dbName).createCollection('Player')
      client.db(this.dbName).createCollection('Fields')
      client.db(this.dbName).createCollection('FreeAgent')
      client.db(this.dbName).createCollection('Appointment')
      // create indexes
      client.db(this.dbName).collection('User').createIndex({ 'credentials.email': 1 })
      client.db(this.dbName).collection('User').createIndex({ player: 1 })
      client.db(this.dbName).collection('User').createIndex({ createdBy: 1 })
      client.db(this.dbName).collection('Player').createIndex({ createdBy: 1 })
      client.db(this.dbName).collection('Fields').createIndex({ createdBy: 1 })
      client.db(this.dbName).collection('Appointment').createIndex({ createdBy: 1 })
      client.db(this.dbName).collection('Appointment').createIndex({ 'location.coordinates': 1 })
      client.db(this.dbName).collection('Appointment').createIndex({ timeAndDate: 1 })
      client.db(this.dbName).collection('Appointment').createIndex({ state: 1 })

      // populate colletion class
      collection.user = client.db(this.dbName).collection('User')
      collection.player = client.db(this.dbName).collection('Player')
      collection.field = client.db(this.dbName).collection('Fields') // to make singular
      collection.freeAgent = client.db(this.dbName).collection('FreeAgent')
      collection.appointment = client.db(this.dbName).collection('Appointment')
      // make collections and client available to class
      this.client = client
      this.collection = collection
  }

  async clearDb () {
    await this.collection.user.deleteMany({})
    await this.collection.player.deleteMany({})
    await this.collection.field.deleteMany({})
    await this.collection.freeAgent.deleteMany({})
    await this.collection.appointment.deleteMany({})
  }

  async closeConnection () {
    try {
      if(this.client) this.client.close()
      this.state = MongoState.Disconnected
    } catch (error) {
      console.error(error)
    }
  }
}

export const MongoDBInstance = new MongoDB()
