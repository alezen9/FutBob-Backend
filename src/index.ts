import 'reflect-metadata'
import { MongoDBInstance } from './MongoDB'
// import graph from './Graph'
import isAuth from './Middleware/isAuth'
import http from 'http'
import express, { Request, Response } from 'express'
import { buildSchema } from 'type-graphql'
/** start resolvers */
import { AuthResolver } from './Graph/Auth'
import { UserResolver, PlayerFieldResolver } from './Graph/User'
import { PlayerResolver, UserFieldResolver } from './Graph/Player'
import { FreeAgentResolver } from './Graph/FreeAgent'
import { FieldResolver } from './Graph/Field'
/** end resolvers */
import { ApolloServer, PubSub } from 'apollo-server-express'
import { Privilege } from './MongoDB/Entities'
import { authChecker } from './Middleware/Authorization'
const shell = require('shelljs')
require('dotenv').config()

interface ReqWithisAuth extends Request {
  isAuth?: boolean,
  idUser?: string,
  privileges?: Privilege[]
}
export interface MyContext {
  req: ReqWithisAuth,
  res: Response,
  pubsub: PubSub
}

const main = async () => {
  try {
    await MongoDBInstance.startConnection()

    const port = process.env.PORT || 7000

    const app = express()
    app.use(isAuth)
    const pubsub = new PubSub()
    const schema = await buildSchema({
      resolvers: [
        AuthResolver,
        UserResolver, PlayerFieldResolver,
        PlayerResolver, UserFieldResolver,
        FreeAgentResolver,
        FieldResolver
      ],
      dateScalarMode: 'isoDate',
      authChecker
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
