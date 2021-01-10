import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dayjs from 'dayjs'
import { MongoDBInstance } from '..'
import { ObjectId } from 'mongodb'
import { Privilege } from '../Entities'
import ErrorMessages from '../../Utils/ErrorMessages'
import { ISODates } from '../../Utils/helpers'
import { Credentials, Registry, User } from './Entities'

class MongoUser {
  tokenExpiration: string

  constructor(){
    this.tokenExpiration = 'Never'
  }
  
  async createUser (data: any, createdBy?: string): Promise<string> {
    if(data.username && data.password){
      const res = await this.getUser({ username: data.username })
      if(res) throw new Error(ErrorMessages.user_username_already_exists)
    }
    const now = dayjs().toDate()
    const userID = new ObjectId()
    const user = new User()
    user._id = userID
    user.createdBy = createdBy ? new ObjectId(createdBy) : userID
    user.createdAt = now
    user.updatedAt = now
    const registry = new Registry()
    registry.name = data.name
    registry.surname = data.surname
    registry.dateOfBirth = dayjs(data.dateOfBirth).toDate()
    registry.sex = data.sex
    registry.country = data.country
    registry.phone = data.phone
    if (data.email) registry.email = data.email
    user.registry = registry
    user.privileges = [data.privilege || Privilege.Manager]
    if(data.username && data.password){
      const credentials = new Credentials()
      credentials.username = data.username
      const encryptedPassword: string = await this.encryptPassword(data.password)
      credentials.password = encryptedPassword
      user.credentials = credentials
    }
    await MongoDBInstance.collection.user.insertOne(user)
    return user._id.toHexString()
  }

  async getUser (params: {_id?: string, username?: string}): Promise<User> {
    const user: User = await MongoDBInstance.collection.user.findOne({ 
      ...params._id && { _id: new ObjectId(params._id) },
      ...params.username && { 'credentials.username': params.username },
    })
    return user
  }

  async linkPlayerToUser (idUser: string, idPlayer?: string): Promise<boolean> {
    const updateUser = new User()
    updateUser.player = idPlayer
      ? new ObjectId(idPlayer)
      : null

    await MongoDBInstance.collection.user.updateOne(
      { _id: new ObjectId(idUser) },
      { $set: updateUser },
      { upsert: true }
    )
    return true
  }

  async encryptPassword (password: string): Promise<string> {
      const salt = await bcrypt.genSalt(+process.env.HASH_SALT)
      const hashedPassword = await bcrypt.hash(password, salt)
      return hashedPassword
  }

  getTypeUserFields (user: User):any {
    const { credentials, _id, registry, player, createdAt, updatedAt, createdBy, ...rest } = user
    return {
      ...rest,
      _id: _id.toHexString(),
      createdBy: createdBy.toHexString(),
      registry: {
        ...registry,
        ...ISODates({ dateOfBirth: registry.dateOfBirth }),
      },
      ...credentials && credentials.username && { username: credentials.username },
      ...ISODates({ createdAt, updatedAt }),
      ...player && { player: player.toHexString() }
    }
  }

  generateJWT(data: any): string {
    const token = jwt.sign(
        { ...data },
        process.env.SECRET
    )
    return token
  }
}

export const mongoUser = new MongoUser()