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
      // client.db(this.dbName).createCollection('Matches')
      // create indexes
      client.db(this.dbName).collection('User').createIndex({ 'credentials.username': 1 })
      client.db(this.dbName).collection('User').createIndex({ footballPlayer: 1 })
      client.db(this.dbName).collection('User').createIndex({ futsalPlayer: 1 })
      // populate colletion class
      collection.user = client.db(this.dbName).collection('User')
      collection.player = client.db(this.dbName).collection('Player')
      collection.fields = client.db(this.dbName).collection('Fields')
      // make collections and client available to class
      this.client = client
      this.collection = collection
  }

  async clearDb () {
    await this.collection.user.deleteMany({})
    await this.collection.player.deleteMany({})
    await this.collection.fields.deleteMany({})
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
