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
import path from 'path'
import chalk from 'chalk'
import cmd from 'node-cmd'
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
      // ...process.env.NODE_ENV === 'development' && {
        ...true && {
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
    
    console.log(chalk.green(`[futbob] NODE_ENV: ${process.env.NODE_ENV}`))
    console.log(chalk.green`[futbob] Listening on port ${port}`)
  } catch (error) {
    console.log(error)
    nodemailerInstance.cleanUp()
    try {
      await MongoDBInstance.closeConnection()
    } catch (error) {}
  }
}

process.on('SIGINT', () => {
  let cleanedLocal = false
  console.log(chalk.green('\n[futbob] Gracefully shutting down and cleaning mess...'))
  if (process.env.NODE_ENV !== 'production') {
    nodemailerInstance.cleanUp()
    MongoDBInstance.closeConnection()
    .then(() => {
      cmd.runSync('lsof -ti tcp:27017 | xargs kill')
      cleanedLocal = true
    })
    .catch(() => {})
  }
  while(!cleanedLocal){
    if(process.env.NODE_ENV === 'production') break
  }
  console.log(chalk.green('\n[futbob] All clear, respect!'))
  process.exit(0)
})

main()
