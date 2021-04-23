import { ClientSession, MongoClient, TransactionOptions } from 'mongodb'
import { CollectionContainer } from './Entities'
import chalk from 'chalk'
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
      await this.setupCollections(client)
      this.state = MongoState.Connected
      console.log(chalk.green('[futbob] Connected to DB'))
    } catch (error) {
      console.error('[futbob] Error while connecting to the DB')
      throw error
    }
  }

  async setupCollections(client: MongoClient) {
      const collection = new CollectionContainer()
      // create collections and indexes
      await this.createCollection(client, {
        name: 'User',
        indexes: [
          { 'registry.additionalInfo.email': 1 },
          { 'registry.name': 1 },
          { 'registry.surname': 1 },
          { 'registry.dateOfBirth': 1 },
          { 'registry.country': 1 },
          { 'credentials.email': 1 },
          { 'credentials.verifyAccount.code.value': 1 },
          { 'credentials.resetPassword.code.value': 1 },
          { player: 1 },
          { createdBy: 1 }
        ] }
      )
      await this.createCollection(client, {
        name: 'Player',
        indexes: [
          { createdBy: 1 }
        ] }
      )
      await this.createCollection(client, {
        name: 'Field',
        indexes: [
          { name: 1 },
          { price: 1 },
          { createdBy: 1 }
        ] }
      )
      await this.createCollection(client, {
        name: 'FreeAgent',
        indexes: [
          { createdBy: 1 }
        ] }
      )
      // populate colletion class
      collection.user = client.db(this.dbName).collection('User')
      collection.player = client.db(this.dbName).collection('Player')
      collection.field = client.db(this.dbName).collection('Field')
      collection.freeAgent = client.db(this.dbName).collection('FreeAgent')
      collection.appointment = client.db(this.dbName).collection('Appointment')
      // make collections and client available to class
      this.client = client
      this.collection = collection
  }

  private async createCollection(client: MongoClient, config: { name: string, indexes?: any[] }) {
    const exists = await client.db(this.dbName).listCollections({ name: config.name }).toArray()
    if(!exists || !exists.length){
      await client.db(this.dbName).createCollection(config.name)
    }
    if(config.indexes && config.indexes.length) {
      const promises = config.indexes.map(idx => client.db(this.dbName).collection(config.name).createIndex(idx))
      await Promise.all(promises)
    }
  }

  // Enable only with replica set
  //
  // createSession() {
  //   return this.client.startSession()
  // }

  // startTransaction(session: ClientSession, transactionOptions: TransactionOptions = { readConcern: { level: 'local' }, writeConcern: { w: 'majority' } }) {
  //   session.startTransaction(transactionOptions)
  // }

  // async commitTransaction(session: ClientSession) {
  //   await session.commitTransaction()
  //   session.endSession()
  // }

  // async abortTransaction(session: ClientSession) {
  //   await session.abortTransaction();
  //   session.endSession();
  // }

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
      console.error('[futbob] Error shutting donw mongo!')
      console.error(error)
    }
  }
}

export const MongoDBInstance = new MongoDB()
