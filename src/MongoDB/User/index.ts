import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dayjs from 'dayjs'
import { MongoDBInstance } from '..'
import { ObjectId } from 'mongodb'
import { Privilege } from '../Entities'
import ErrorMessages from '../../Utils/ErrorMessages'
import { encodePrivileges, normalizeUpdateObject } from '../../Utils/helpers'
import { AuthData, Credentials, User } from './Entities'
import { ChangePasswordInput, UpdateRegistryInput } from '../../Graph/User/inputs'
import { isEmpty, get } from 'lodash'
import cleanDeep from 'clean-deep'
import { LoginInput, RegisterInput } from '../../Graph/Auth/inputs'
import { nodemailerInstance } from '../../Utils/NodeMailer'
require('dotenv').config()

class MongoUser {
  tokenExpiration: string

  constructor(){
    this.tokenExpiration = 'Never'
  }

  async register (data: RegisterInput): Promise<boolean> {
    await mongoUser.checkEmailExistance(data.email)
    const idUser = await mongoUser.create(data)
    const link = await this.createConfirmationLink(idUser)
    this.sendConfirmationEmail(link, data.email)
    return true
  }

  async confirm (_id: string): Promise<AuthData> {
    const user = await MongoDBInstance.collection.user.findOne({ _id: new ObjectId(_id) })
    if(!user) throw new Error(ErrorMessages.user_user_not_exists)
    const { modifiedCount } = await MongoDBInstance.collection.user.updateOne(
      { _id: new ObjectId(_id), createdBy: new ObjectId(_id) },
      { $set: { "credentials.confirmed": true } }
    )
    if (modifiedCount === 0) throw new Error(ErrorMessages.user_update_failed)
    const tokenData = {
         idUser: _id,
         privileges: user.privileges
      }
      const token = mongoUser.generateJWT(tokenData)
      return {
         token,
         expiresIn: this.tokenExpiration
      }
  }

  async login (data: LoginInput): Promise<AuthData> {
    const { email, password } = data
      const user: User = await this.getUserByEmail(email)
      if (!user) throw new Error(ErrorMessages.user_user_not_exists)
      const isEqual = await bcrypt.compare(password, user.credentials.password)
      if (!isEqual) throw new Error(ErrorMessages.user_password_not_correct)
      const tokenData = {
         idUser: user._id.toHexString(),
         privileges: user.privileges
      }
      const token = this.generateJWT(tokenData)
      return {
         token,
         expiresIn: this.tokenExpiration
      }
  }

  async create (data: RegisterInput, _createdBy?: string){
    const { password, ...registry } = data
    const now = dayjs().toISOString()
    let credentials = null
    const privileges = []
    if(data.password){
      credentials = new Credentials()
      credentials.email = data.email
      credentials.password = await this.encryptPassword(password)
      credentials.confirmed = false
      privileges.push(Privilege.Manager)
    }
    if(!privileges.length) privileges.push(Privilege.User)
    const _id = new ObjectId()
    const createdBy = _createdBy
      ? new ObjectId(_createdBy)
      : _id
    const user = new User(cleanDeep({ 
      _id,
      registry, 
      credentials, 
      createdAt: now, 
      updatedAt: now,
      privileges,
      createdBy
    }))
    await MongoDBInstance.collection.user.insertOne(user)
    return user._id.toHexString()
  }

  async update (data: UpdateRegistryInput, createdBy: string) {
    const { _id, ...registry } = data
    if(isEmpty(cleanDeep(registry))) return true
    const updatedUser = new User({ registry, updatedAt: dayjs().toISOString() })
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

  async changeEmail(newEmail: string, idUser: string) {
    const existingNewUsername = await MongoDBInstance.collection.user.findOne({ 'credentials.email': newEmail })
    if(existingNewUsername) throw new Error(ErrorMessages.user_email_already_exists)
    const { modifiedCount } = await MongoDBInstance.collection.user.updateOne(
      {_id: new ObjectId(idUser)},
      { $set: { 'credentials.email': newEmail }},
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

  async getUserByEmail (email: string): Promise<User> {
    const user: User = await MongoDBInstance.collection.user.findOne({ "credentials.email": email })
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

  async checkEmailExistance (email: string): Promise<void> {
    const user = await this.getUserByEmail(email)
    if(user)throw new Error(ErrorMessages.user_email_already_exists)
  }

  private async encryptPassword (password: string): Promise<string> {
      const salt = await bcrypt.genSalt(+process.env.HASH_SALT)
      const hashedPassword = await bcrypt.hash(password, salt)
      return hashedPassword
  }

  private async createConfirmationLink(_id: string): Promise<string> {
    const link = `${process.env.BASE_FRONTEND_URL}/confirm/${_id}`
    return link
  }

  private sendConfirmationEmail(link: string, email: string): void {
    nodemailerInstance.sendEmailSync({
      to: email,
      text: link
    })
  }

  generateJWT(data: any): string {
    const privileges = encodePrivileges(get(data, 'privileges', []))
    const _data = { ...data, privileges }
    const token = jwt.sign(
        _data,
        process.env.SECRET
    )
    return token
  }
}

export const mongoUser = new MongoUser()