import 'reflect-metadata'
import { MongoDBInstance } from './src/MongoDB'
// import graph from './Graph'
import isAuth from './src/Middleware/isAuth'
import http from 'http'
import express, { Request, Response } from 'express'
import { buildSchema } from 'type-graphql'
/** start resolvers */
/** ------------------------------ */
import { _DevResolver } from './src/Graph/_Dev'
/** ------------------------------ */
import { AuthResolver } from './src/Graph/Auth'
import { UserResolver, PlayerFieldResolver } from './src/Graph/User'
import { PlayerResolver, UserFieldResolver } from './src/Graph/Player'
import { FreeAgentResolver } from './src/Graph/FreeAgent'
import { FieldResolver } from './src/Graph/Field'
/** end resolvers */
import { ApolloServer, PubSub } from 'apollo-server-express'
import { Privilege } from './src/MongoDB/Entities'
import { authChecker } from './src/Middleware/Authorization'
import { nodemailerInstance } from './src/NodeMailer'
import shell from 'shelljs'
import path from 'path'
require('dotenv').config()

interface ReqWithisAuth extends Request {
  isAuth?: boolean
  idUser?: string
  privileges?: Privilege[]
  token?: string
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
    const staticPath = path.join(__dirname, '/public')
    app.use('/public', express.static(staticPath))
    const pubsub = new PubSub()
    const schema = await buildSchema({
      resolvers: [
        _DevResolver,
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
    
    console.log('NODE_ENV: ', process.env.NODE_ENV)
    console.log(`connected to DB, listening on port ${port}`)
  } catch (error) {
    console.log(error)
    nodemailerInstance.cleanUp()
    try {
      await MongoDBInstance.closeConnection()
    } catch (error) {
      console.error('Error shutting donw mongo!')
    }
  }
}

process.on('SIGINT', async () => {
  console.log('\nGracefully shutting down and cleaning mess...')
  if (process.env.NODE_ENV !== 'production') {
    nodemailerInstance.cleanUp()
    try {
      await MongoDBInstance.closeConnection()
    } catch (error) {
      console.error('Error shutting donw mongo!')
    }
    shell.exec('lsof -ti tcp:27017 | xargs kill')
  }
  process.exit()
})

main()
