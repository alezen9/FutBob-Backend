import 'reflect-metadata'
import { MongoDBInstance } from './MongoDB'
import graph from './Graph'
import isAuth from './Middleware/isAuth'
import http from 'http'
import express from 'express'
import { buildSchema } from 'type-graphql'
/** start resolvers */
import { AuthResolver } from './Graph/Auth'
import { UserResolver, UserFieldResolver } from './Graph/User'
import { PlayerResolver. PlayerFieldResolver } from './Graph/Player'
/** end resolvers */
import { ApolloServer } from 'apollo-server-express'
const shell = require('shelljs')
require('dotenv').config()

const { PubSub } = require('apollo-server-express')

const main = async () => {
  try {
    await MongoDBInstance.startConnection()

    const port = process.env.PORT || 7000

    const app = express()
    app.use(isAuth)
    const pubsub = new PubSub()
    // const server = new ApolloServer({
    //   typeDefs: graph.typeDefs,
    //   resolvers: graph.resolvers,
    //   context: ({ req, res }) => ({ req, res, pubsub }),
    //   ...process.env.NODE_ENV === 'development' && {
    //     introspection: true,
    //     playground: {
    //       settings: {
    //         'editor.theme': 'dark'
    //       }
    //     }
    //   }
    // })
    const schema = await buildSchema({
      resolvers: [
        AuthResolver,
        UserResolver, UserFieldResolver,
        PlayerResolver, PlayerFieldResolver
      ]
    })
    const server = new ApolloServer({
      schema,
      context: ({ req, res }) => ({ req, res, pubsub }),
      ...process.env.NODE_ENV === 'development' && {
        introspection: true,
        playground: {
          settings: {
            'editor.theme': 'dark'
          }
        }
      }
    })
    server.applyMiddleware({ app })
    const httpServer = http.createServer(app)
    server.installSubscriptionHandlers(httpServer)

    httpServer.listen(port)
    console.log(`connected to DB, listening on port ${port}`)
  } catch (error) {
    console.log(error)
    await MongoDBInstance.closeConnection()
  }
}

process.on('SIGINT', async () => {
  console.log('\nGracefully shutting down and cleaning mess...')
  if (process.env.NODE_ENV !== 'production') {
    await MongoDBInstance.closeConnection()
    shell.exec('lsof -ti tcp:27017 | xargs kill')
  }
  process.exit()
})

main()
