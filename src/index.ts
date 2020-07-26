import { MongoDBInstance } from './MongoDB'
import typeDefs from './Graph/schema'
import resolvers from './Graph/resolvers'
import isAuth from './Middleware/isAuth'
import http from 'http'
import express from 'express'
import cors from 'cors'
require('dotenv').config()

const { ApolloServer, PubSub } = require('apollo-server-express')

const app = express()

app.use(cors())

app.use(isAuth)

const pubsub = new PubSub()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  context: ({ req, res }) => ({ req, res, pubsub }),
  playground: {
    settings: {
      'editor.theme': 'dark'
    }
  }
})

server.applyMiddleware({ app })

const httpServer = http.createServer(app)
server.installSubscriptionHandlers(httpServer)

const port = process.env.PORT || 7000

const setupAndStartServer = async () => {
  try {
    await MongoDBInstance.startConnection()
    httpServer.listen(port)
    console.log(`connected to DB, listening on port ${port}`)
  } catch (error) {
    console.log(error)
    await MongoDBInstance.closeConnection()
  }
}

setupAndStartServer()
