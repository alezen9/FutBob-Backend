import { mongoUser } from '../../MongoDB/User'
import { Privilege } from '../../MongoDB/Entities'
import bcrypt from 'bcrypt'
import ErrorMessages from '../../Utils/ErrorMessages'
import { User } from '../../MongoDB/User/entities'
import { MongoDBInstance } from '../../MongoDB'
import { ObjectId } from 'mongodb'
import {isEmpty} from 'lodash'
import cleanDeep from 'clean-deep'

const authResolver = {
  Query: {
    login: async (_, { signinInput }) => {
      const { username, password } = signinInput

      const user: User = await MongoDBInstance.collection.user.findOne({ 'credentials.username': username })
      if (!user) throw new Error(ErrorMessages.user_user_not_exists)

      const isEqual = await bcrypt.compare(password, user.credentials.password)
      if (!isEqual) throw new Error(ErrorMessages.user_password_not_correct)

      const tokenData = {
          idUser: user._id.toHexString(),
          privileges: user.privileges
        }
        const token = mongoUser.generateJWT(tokenData)
        return {
          token,
          expiresIn: mongoUser.tokenExpiration
        }
    },
    getUserConnected: async (_, __, { req }) => {
      if(!req.isAuth) throw new Error(ErrorMessages.user_unauthenticated)

      const user: User = await mongoUser.getUserById(req.idUser)
      if (!user) throw new Error(ErrorMessages.user_user_not_exists)

      return mongoUser.getTypeUserFields(user)
    }
  },
  Mutation: {
    signup: async (_, { signupInput }) => {
      try {
        const idUser = await mongoUser.createUser(signupInput)
        const tokenData = {
          idUser,
          privileges: [Privilege.Manager]
        }
        const token = mongoUser.generateJWT(tokenData)
        return {
          token,
          expiresIn: mongoUser.tokenExpiration
        }
      } catch (error) {
        throw error
      }
    },
    changePassword: async (_, { oldPassword, newPassword }, { req }) => {
      if(!req.isAuth) throw new Error(ErrorMessages.user_unauthenticated)

      const areEqual = oldPassword === newPassword
      if (areEqual) throw new Error(ErrorMessages.user_new_old_password_equal)
      
      const user: User = await mongoUser.getUserById(req.idUser)
      if (!user) throw new Error(ErrorMessages.user_user_not_exists)

      const isEqualOld = await bcrypt.compare(oldPassword, user.credentials.password)
      if (!isEqualOld) throw new Error(ErrorMessages.user_password_not_correct)

      const encryptedNewPassword = await mongoUser.encryptPassword(newPassword)
      MongoDBInstance.collection.user.updateOne(
        {_id: new ObjectId(req.idUser)},
        { $set: { 'credentials.password': encryptedNewPassword }},
        { upsert: true }
      )
      return true
    },
    changeUsername: async (_, { newUsername }, { req }) => {
      if(!req.isAuth) throw new Error(ErrorMessages.user_unauthenticated)

      const existingNewUsername = await MongoDBInstance.collection.user.findOne({ 'credentials.username': newUsername })
      if(existingNewUsername) throw new Error(ErrorMessages.user_username_already_exists)

      MongoDBInstance.collection.user.updateOne(
        {_id: new ObjectId(req.idUser)},
        { $set: { 'credentials.username': newUsername }},
        { upsert: true }
      )
      return true
    },
    updateUserConnected: async (_, { userInput }, { req }) => {
      if(!req.isAuth) throw new Error(ErrorMessages.user_unauthenticated)
      const { name, surname, dateOfBirth, phone, email, sex } = userInput

      if(isEmpty(cleanDeep(userInput))) return true

      const updatedUser = new User()
      if(name) updatedUser.name = name
      if(surname) updatedUser.surname = surname
      if(dateOfBirth) updatedUser.dateOfBirth = dateOfBirth
      if(phone) updatedUser.phone = phone
      if(email) updatedUser.email = email
      if(sex) updatedUser.sex = sex

      MongoDBInstance.collection.user.updateOne(
        {_id: new ObjectId(req.idUser)},
        { $set: updatedUser},
        { upsert: true }
      )
      return true
    },
  }
}

export default authResolver
