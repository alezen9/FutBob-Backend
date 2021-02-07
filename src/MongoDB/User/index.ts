import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dayjs from 'dayjs'
import { MongoDBInstance } from '..'
import { ObjectId } from 'mongodb'
import { Privilege } from '../Entities'
import ErrorMessages from '../../Utils/ErrorMessages'
import { encodePrivileges, normalizeUpdateObject } from '../../Utils/helpers'
import { AuthData, Confirmation, Credentials, User } from './Entities'
import { ChangePasswordInput, CreateUserInput, UpdateRegistryInput } from '../../Graph/User/inputs'
import { isEmpty, get } from 'lodash'
import cleanDeep from 'clean-deep'
import { FinalizeRegistrationInput, LoginInput, RegisterInput, RequestResendInput } from '../../Graph/Auth/inputs'
import { nodemailerInstance } from '../../NodeMailer'
import { v4 as uuidv4 } from 'uuid'
require('dotenv').config()

class MongoUser {
  tokenExpiration: string
  private codeExpirationInHours: number

  constructor(){
    this.tokenExpiration = 'Never'
    this.codeExpirationInHours = 2
  }

  async requestRegistration (data: RegisterInput): Promise<boolean> {
    const user = await this.getUserByEmail(data.email)
    if(user) throw new Error(ErrorMessages.user_email_already_exists)
    const code = this.createConfirmationCode()
    const verifyAccount = new Confirmation(code, false)
    await this.create({ ...data, verifyAccount })
    const link = await this.createRegistrationLink(code)
    await this.sendRegistrationEmail(data.email, link)
    return true
  }

  private async checkVerifyAccountCode (code: string): Promise<boolean> {
    const user: User = await MongoDBInstance.collection.user.findOne({ "credentials.verifyAccount.code.value": code, "credentials.verifyAccount.confirmed": false })
    if(!user) throw new Error(ErrorMessages.user_user_not_exists_or_code_already_verified)
    this.checkExpirationCode(user)
    return true
  }

  async requestRegistrationEmailResend (expiredCode: string): Promise<boolean> {
    const user: User = await MongoDBInstance.collection.user.findOne({
      "credentials.verifyAccount.code.value": expiredCode,
      "credentials.verifyAccount.code.createdAt": { $lt: dayjs().subtract(this.codeExpirationInHours, 'hour').toISOString() },
      "credentials.verifyAccount.confirmed": false,
    })
    if(!user) throw new Error(ErrorMessages.invalid_code_or_not_yet_expired)
    const code = this.createConfirmationCode()
    const confirmation = new Confirmation(code, false)
    const { modifiedCount } = await MongoDBInstance.collection.user.updateOne(
      { _id: new ObjectId(user._id) },
      { $set: { "credentials.verifyAccount": confirmation } }
    )
    if (modifiedCount === 0) throw new Error(ErrorMessages.user_update_failed)
    const link = await this.createRegistrationLink(code)
    await this.sendRegistrationEmail(user.credentials.email, link)
    return true
  }

  async finalizeRegistration (data: FinalizeRegistrationInput): Promise<AuthData> {
    if(data.password !== data.confirmPassword) throw new Error(ErrorMessages.user_password_not_confirmed)
    await this.checkVerifyAccountCode(data.unverifiedCode)
    const encryptedPassword = await this.encryptPassword(data.password)
    const { modifiedCount } = await MongoDBInstance.collection.user.updateOne(
      { "credentials.verifyAccount.code.value": data.unverifiedCode },
      { $set: { 
        "credentials.verifyAccount.confirmed": true,
        "credentials.password": encryptedPassword
      } }
    )
    if (modifiedCount === 0) throw new Error(ErrorMessages.user_update_failed)
    const user: User = await MongoDBInstance.collection.user.findOne({ "credentials.verifyAccount.code.value": data.unverifiedCode })
    if(!user) throw new Error(ErrorMessages.user_user_not_exists)
    const tokenData = {
        idUser: user._id.toHexString(),
        privileges: user.privileges
    }
    const token = mongoUser.generateJWT(tokenData)
    return {
        token,
        expiresIn: this.tokenExpiration
    }
  }

  async requestResetPassword (email: string): Promise<boolean> {
    const user = await mongoUser.getUserByEmail(email)
    if(!user) throw new Error(ErrorMessages.user_user_not_exists)
    if(!user.credentials.verifyAccount.confirmed) throw new Error(ErrorMessages.user_user_not_confirmed)
    const code = this.createConfirmationCode()
    const resetPassword = new Confirmation(code, false)
    const { modifiedCount } = await MongoDBInstance.collection.user.updateOne(
      { _id: new ObjectId(user._id) },
      { $set: { "credentials.resetPassword": resetPassword } }
    )
    if (modifiedCount === 0) throw new Error(ErrorMessages.user_update_failed)
    const link = await this.createResetPasswordLink(code)
    await this.sendResetPasswordEmail(email, link)
    return true
  }

  private async checkResetPasswordCode (code: string): Promise<boolean> {
    const user: User = await MongoDBInstance.collection.user.findOne({ "credentials.resetPassword.code.value": code, "credentials.resetPassword.confirmed": false })
    if(!user) throw new Error(ErrorMessages.user_user_not_exists_or_code_already_verified)
    this.checkExpirationCode(user)
    return true
  }

  async requestResetPasswordEmailResend (expiredCode: string): Promise<boolean> {
    const user: User = await MongoDBInstance.collection.user.findOne({ 
      "credentials.resetPassword.code.value": expiredCode,
      "credentials.resetPassword.code.createdAt": { $lt: dayjs().subtract(this.codeExpirationInHours, 'hour').toISOString() },
      "credentials.resetPassword.confirmed": false
    })
    if(!user) throw new Error(ErrorMessages.invalid_code_or_not_yet_expired)
    const code = this.createConfirmationCode()
    const resetPassword = new Confirmation(code, false)
    const { modifiedCount } = await MongoDBInstance.collection.user.updateOne(
      { _id: new ObjectId(user._id) },
      { $set: { "credentials.resetPassword": resetPassword } }
    )
    if (modifiedCount === 0) throw new Error(ErrorMessages.user_update_failed)
    const link = await this.createResetPasswordLink(code)
    await this.sendResetPasswordEmail(user.credentials.email, link)
    return true
  }

  async finalizeResetPassword (data: FinalizeRegistrationInput): Promise<AuthData> {
    if(data.password !== data.confirmPassword) throw new Error(ErrorMessages.user_password_not_confirmed)
    await this.checkResetPasswordCode(data.unverifiedCode)
    const encryptedPassword = await this.encryptPassword(data.password)
    const { modifiedCount } = await MongoDBInstance.collection.user.updateOne(
      { "credentials.resetPassword.code.value": data.unverifiedCode },
      { $set: { 
        "credentials.resetPassword.confirmed": true,
        "credentials.password": encryptedPassword
      } }
    )
    if (modifiedCount === 0) throw new Error(ErrorMessages.user_update_failed)
    const user: User = await MongoDBInstance.collection.user.findOne({ "credentials.resetPassword.code.value": data.unverifiedCode })
    if(!user) throw new Error(ErrorMessages.user_user_not_exists)
    const tokenData = {
        idUser: user._id.toHexString(),
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
      if(!user) throw new Error(ErrorMessages.user_user_not_exists)
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

  async create (data: CreateUserInput & { verifyAccount?: Confirmation }, _createdBy?: string){
    const { verifyAccount, ...registry } = data
    const now = dayjs().toISOString()
    let credentials = null
    const privileges = []
    if(data.email && verifyAccount){
      credentials = new Credentials()
      credentials.email = data.email
      credentials.verifyAccount = verifyAccount
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

  private async encryptPassword (password: string): Promise<string> {
      const salt = await bcrypt.genSalt(+process.env.HASH_SALT)
      const hashedPassword = await bcrypt.hash(password, salt)
      return hashedPassword
  }

  private createConfirmationCode () {
    return uuidv4()
  }

  private checkExpirationCode (user: User) {
    const codeCreatedAt = user.credentials.verifyAccount.code.createdAt
    const isExpired = dayjs(codeCreatedAt).add(this.codeExpirationInHours, 'hour').isBefore(dayjs())
    if(isExpired) throw new Error(ErrorMessages.system_confirmation_code_expired)
  }

  private async createRegistrationLink(code: string): Promise<string> {
    const link = `${process.env.FRONTEND_FINALIZE_ACCOUNT_URL}/${code}`
    return link
  }

  private async sendRegistrationEmail(email: string, link: string): Promise<void> {
    await nodemailerInstance.emails.accountVerification.compileAndSend(email, { link, expiresIn: this.codeExpirationInHours })
  }

  private async createResetPasswordLink(code: string): Promise<string> {
    const link = `${process.env.FRONTEND_RESET_PASSWORD_URL}/${code}`
    return link
  }

  private async sendResetPasswordEmail(email: string, link: string): Promise<void> {
    await nodemailerInstance.emails.resetPassword.compileAndSend(email, { link, expiresIn: this.codeExpirationInHours })
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