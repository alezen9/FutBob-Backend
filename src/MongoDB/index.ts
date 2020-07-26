import { MongoClient } from 'mongodb'
import { CollectionContainer } from './Entities'
import Collections from './Collections'
import { lowerCaseFirst } from '../Utils/helpers'
require('dotenv').config()

export enum MongoState {
  Connected,
  Disconnected
}

export class MongoDB {
  collection: CollectionContainer
  client: any
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
      dbUri: process.env.NODE_ENV === 'prod'
        ? process.env.MONGO_DB_URI
        : 'mongodb://localhost:27017/',
      dbName: process.env.NODE_ENV === 'prod'
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
      for(const { name, indexes = [] } of Collections) {
        client.db(this.dbName).createCollection(name)
        if(indexes.length){
          for(const index of indexes) {
            client.db(this.dbName).collection(name).createIndex(index)
          }
        }
        collection[lowerCaseFirst(name)] = client.db(this.dbName).collection(name)
      }
      this.client = client
      this.collection = collection
  }

  async clearDb () {
    for(let i = 0; i < Collections.length; i++) {
      const name = lowerCaseFirst(Collections[i].name)
      if(this.collection && this.collection[name]) await this.collection[name].deleteMany({})
    }
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
