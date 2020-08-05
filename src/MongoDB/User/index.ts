import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import { User, Credentials } from './entities'
import { MongoDBInstance, MongoState } from '..'
import { ObjectId } from 'mongodb'
import { Privilege } from '../Entities'
import ErrorMessages from '../../Utils/ErrorMessages'
import { PlayerType } from '../Player/Entities'
import { ISODates } from '../../Utils/helpers'

class MongoUser {
  tokenExpiration:string

  constructor() {
    this.tokenExpiration = '3h'
  }
  
  async createUser (data: any): Promise<string> {
    if(data.username && data.password){
      const res = await this.getUser({ username: data.username })
      if(res) throw new Error(ErrorMessages.user_username_already_exists)
    }
    const now = moment().toDate()
    const user = new User()
    user._id = new ObjectId()
    user.name = data.name
    user.surname = data.surname
    user.createdAt = now
    user.updatedAt = now
    user.dateOfBirth = moment(data.dateOfBirth).toDate()
    user.sex = data.sex
    user.phone = data.phone
    user.privileges = [data.privilege || Privilege.Manager]
    if (data.email) user.email = data.email
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

  async assignPlayer (params: {idUser: string, footballPlayer?: string, futsalPlayer?: string}): Promise<boolean> {
    const updateUser = new User()
    if(params.footballPlayer) updateUser.footballPlayer = new ObjectId(params.footballPlayer)
    if(params.futsalPlayer) updateUser.futsalPlayer = new ObjectId(params.futsalPlayer)

    await MongoDBInstance.collection.user.updateOne(
      { _id: new ObjectId(params.idUser) },
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
    const { credentials, _id, futsalPlayer, footballPlayer, dateOfBirth, createdAt, updatedAt, ...rest } = user
    return {
      ...rest,
      _id: _id.toHexString(),
      ...credentials && credentials.username && { username: credentials.username },
      ...ISODates({ dateOfBirth, createdAt, updatedAt}),
      ...futsalPlayer && { futsalPlayer: futsalPlayer.toHexString() },
      ...footballPlayer && { footballPlayer: footballPlayer.toHexString() }
    }
  }

  generateJWT(data: any): string {
    const token = jwt.sign(
        { ...data },
        process.env.SECRET,
        { expiresIn: this.tokenExpiration }
    )
    return token
  }
}

export const mongoUser = new MongoUser()