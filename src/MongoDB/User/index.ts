import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import { User, Credentials } from './entities'
import { MongoDBInstance, MongoState } from '..'
import { ObjectId } from 'mongodb'
import { Privilege } from '../Entities'
import ErrorMessages from '../../Utils/ErrorMessages'

class MongoUser {
  tokenExpiration:string

  constructor() {
    this.tokenExpiration = '3h'
  }
  
  async createUser (data: any): Promise<string> {
    const res = await MongoDBInstance.collection.user.findOne({ 'credentials.username': data.username })
    if(res) throw new Error(ErrorMessages.username_already_exists)
    const now = moment().toISOString()
    const user = new User()
    user._id = new ObjectId()
    user.name = data.name
    user.surname = data.surname
    user.createdAt = now
    user.updatedAt = now
    user.dateOfBirth = data.dateOfBirth
    user.sex = data.sex
    user.phone = data.phone
    user.privileges = data.privilege || Privilege.Manager
    if (data.email) user.email = data.email
    const credentials = new Credentials()
    credentials.username = data.username
    const encryptedPassword: string = await this.encryptPassword(data.password)
    credentials.password = encryptedPassword
    user.credentials = credentials
    await MongoDBInstance.collection.user.insertOne(user)
    return user._id.toHexString()
  }

  async getUserById (_id: string): Promise<User> {
    const user: User = await MongoDBInstance.collection.user.findOne({ _id: new ObjectId(_id) })
    return user
  }

  async encryptPassword (password: string): Promise<string> {
      const salt = await bcrypt.genSalt(+process.env.HASH_SALT)
      const hashedPassword = await bcrypt.hash(password, salt)
      return hashedPassword
  }

  getTypeUserFields (user: User):any {
    const { credentials, _id, ...rest } = user
    return {
      ...rest,
      _id: _id.toHexString(),
      username: credentials.username
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