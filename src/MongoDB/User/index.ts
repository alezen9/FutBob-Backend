import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dayjs from 'dayjs'
import { MongoDBInstance } from '..'
import { ObjectId } from 'mongodb'
import { Privilege } from '../Entities'
import ErrorMessages from '../../Utils/ErrorMessages'
import { normalizeUpdateObject } from '../../Utils/helpers'
import { Credentials, User } from './Entities'
import { ChangePasswordInput, UpdateRegistryInput } from '../../Graph/User/inputs'
import { isEmpty } from 'lodash'
import cleanDeep from 'clean-deep'
import { RegisterInput } from '../../Graph/Auth/inputs'

class MongoUser {
  tokenExpiration: string

  constructor(){
    this.tokenExpiration = 'Never'
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

  async delete (_id: string, createdBy: string){
    const user = await MongoDBInstance.collection.user.findOne({ _id: new ObjectId(_id), createdBy: new ObjectId(createdBy) })
    if(!user) throw new Error(ErrorMessages.system_permission_denied)
    await MongoDBInstance.collection.user.deleteOne({ _id: new ObjectId(_id) })
    if(user.player) await MongoDBInstance.collection.player.deleteOne({ _id: new ObjectId(user.player) })
    return {
      user: _id,
      player: user.player
        ? user.player.toHexString()
        : null
    }
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

  generateJWT(data: any): string {
    const token = jwt.sign(
        { ...data },
        process.env.SECRET
    )
    return token
  }
}

export const mongoUser = new MongoUser()