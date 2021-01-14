import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dayjs from 'dayjs'
import { MongoDBInstance } from '..'
import { ObjectId } from 'mongodb'
import { Privilege } from '../Entities'
import ErrorMessages from '../../Utils/ErrorMessages'
import { ISODates, normalizeUpdateObject } from '../../Utils/helpers'
import { Credentials, Registry, User } from './Entities'
import { ChangePasswordInput, UpdateRegistryInput } from '../../Graph/User/inputs'
import { isEmpty } from 'lodash'
import cleanDeep from 'clean-deep'
import { RegisterInput } from '../../Graph/Auth/inputs'

class MongoUser {
  tokenExpiration: string

  constructor(){
    this.tokenExpiration = 'Never'
  }
  
  /** @depreated */
  async createUser (data: any, createdBy?: string): Promise<string> {
    // if(data.username && data.password){
    //   const res = await this.getUser({ username: data.username })
    //   if(res) throw new Error(ErrorMessages.user_username_already_exists)
    // }
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

  async create (data: RegisterInput, _createdBy?: string){
    const { username, password, ...registry } = data
    const existingUser = await MongoDBInstance.collection.user.findOne({ "credentials.username": username })
    if(existingUser) throw new Error(ErrorMessages.user_username_already_exists)
    const now = dayjs().toDate()
    let credentials = null
    const privileges = []
    if(data.username && data.password){
      credentials = new Credentials()
      credentials.username = username
      credentials.password = password
      privileges.push(Privilege.Manager)
    }
    if(!privileges.length) privileges.push(Privilege.User)
    const _id = new ObjectId()
    const createdBy = _createdBy
      ? new ObjectId(_createdBy)
      : _id
    const user = new User(cleanDeep({ 
      registry, 
      credentials, 
      createdAt: now, 
      updatedAt: now, 
      createdBy
    }))
    await MongoDBInstance.collection.user.insertOne(user)
    return user._id.toHexString()
  }

  async update (data: UpdateRegistryInput, createdBy: string) {
    const { _id, ...registry } = data
    if(isEmpty(cleanDeep(registry))) return true
    const updatedUser = new User({ registry, updatedAt: dayjs().toDate() })
    const { modifiedCount } = await MongoDBInstance.collection.user.updateOne(
      { _id: new ObjectId(_id), createdBy: new ObjectId(createdBy) },
      { $set: normalizeUpdateObject(updatedUser) }
    )
    if (modifiedCount === 0) throw new Error(ErrorMessages.user_update_failed)
    return true
  }

  async changeUsername(newUsername: string, idUser: string) {
    const existingNewUsername = await MongoDBInstance.collection.user.findOne({ 'credentials.username': newUsername })
    if(existingNewUsername) throw new Error(ErrorMessages.user_username_already_exists)
    const { modifiedCount } = await MongoDBInstance.collection.user.updateOne(
      {_id: new ObjectId(idUser)},
      { $set: { 'credentials.username': newUsername }},
    )
    if (modifiedCount === 0) throw new Error(ErrorMessages.user_update_failed)
    return true
  }

  async changePassword(data: ChangePasswordInput, idUser: string) {
    const { oldPassword, newPassword } = data
      const areEqual = oldPassword === newPassword
      if (areEqual) throw new Error(ErrorMessages.user_new_old_password_equal)
      const user: User = await MongoDBInstance.collection.user.findOne({_id: new ObjectId(idUser)})
      if (!user) throw new Error(ErrorMessages.user_user_not_exists)
      const isEqualOld = await bcrypt.compare(oldPassword, user.credentials.password)
      if (!isEqualOld) throw new Error(ErrorMessages.user_password_not_correct)
      const encryptedNewPassword = await mongoUser.encryptPassword(newPassword)
      await MongoDBInstance.collection.user.updateOne(
        {_id: new ObjectId(idUser)},
        { $set: { 'credentials.password': encryptedNewPassword }}
      )
      return true
  }

  async getUserById (_id: string|ObjectId): Promise<User> {
    const user: User = await MongoDBInstance.collection.user.findOne({ _id: new ObjectId(_id)})
    return user
  }

  async getUserByUsername (username: string): Promise<User> {
    const user: User = await MongoDBInstance.collection.user.findOne({ "credentials.username": username })
    return user
  }

  async setPlayer (idUser: string, idPlayer?: string): Promise<boolean> {
    const updateUser = new User()
    updateUser.player = idPlayer
      ? new ObjectId(idPlayer)
      : null
    await MongoDBInstance.collection.user.updateOne(
      { _id: new ObjectId(idUser) },
      { $set: updateUser }
    )
    return true
  }

  private async encryptPassword (password: string): Promise<string> {
      const salt = await bcrypt.genSalt(+process.env.HASH_SALT)
      const hashedPassword = await bcrypt.hash(password, salt)
      return hashedPassword
  }

  /** @depreated */
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