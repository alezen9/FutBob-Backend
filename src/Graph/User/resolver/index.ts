import cleanDeep from "clean-deep"
import { Registry, User } from "../../../MongoDB/User/Entities"
import { ObjectId } from "mongodb"
import { MongoDBInstance } from "../../../MongoDB"
import ErrorMessages from "../../../Utils/ErrorMessages"
import { mongoUser } from "../../../MongoDB/User"
import {isEmpty} from 'lodash'
import dayjs from 'dayjs'
import bcrypt from 'bcrypt'
import { gql_User, userLoader } from "./transform"
import { checkPrivileges } from "../../../Middleware/isAuth"
import { normalizeUpdateObject } from "../../../Utils/helpers"

const userResolver = {
  Query: {
    getUserConnected: async (_, __, { req }) => {
      if(!req.isAuth) throw new Error(ErrorMessages.user_unauthenticated)

      const user: User = await mongoUser.getUser({ _id: req.idUser })
      if (!user) throw new Error(ErrorMessages.user_user_not_exists)

      return gql_User(user)
    }
  },
  Mutation: {
    changePassword: async (_, { oldPassword, newPassword }, { req }) => {
      if(!req.isAuth) throw new Error(ErrorMessages.user_unauthenticated)

      const areEqual = oldPassword === newPassword
      if (areEqual) throw new Error(ErrorMessages.user_new_old_password_equal)
      
      const user: User = await mongoUser.getUser({_id: req.idUser})
      if (!user) throw new Error(ErrorMessages.user_user_not_exists)

      const isEqualOld = await bcrypt.compare(oldPassword, user.credentials.password)
      if (!isEqualOld) throw new Error(ErrorMessages.user_password_not_correct)

      const encryptedNewPassword = await mongoUser.encryptPassword(newPassword)
      await MongoDBInstance.collection.user.updateOne(
        {_id: new ObjectId(req.idUser)},
        { $set: { 'credentials.password': encryptedNewPassword }}
      )
      return true
    },
    changeUsername: async (_, { newUsername }, { req }) => {
      if(!req.isAuth) throw new Error(ErrorMessages.user_unauthenticated)

      const existingNewUsername = await MongoDBInstance.collection.user.findOne({ 'credentials.username': newUsername })
      if(existingNewUsername) throw new Error(ErrorMessages.user_username_already_exists)

      const { modifiedCount } = await MongoDBInstance.collection.user.updateOne(
        {_id: new ObjectId(req.idUser)},
        { $set: { 'credentials.username': newUsername }},
      )

      if (modifiedCount === 0) throw new Error(ErrorMessages.user_update_failed)
      userLoader.clear(req.idUser)
      return true
    },
    updateUserConnected: async (_, { userInput }, { req }) => {
      if(!req.isAuth) throw new Error(ErrorMessages.user_unauthenticated)
      const { name, surname, dateOfBirth, phone, email, sex, country } = userInput

      if(isEmpty(cleanDeep(userInput))) return true

      const updatedUser = new User()
      const registry = new Registry()
      if(name) registry.name = name
      if(surname) registry.surname = surname
      if(dateOfBirth) registry.dateOfBirth = dayjs(dateOfBirth).toDate()
      if(phone) registry.phone = phone
      if(email) registry.email = email
      if(sex) registry.sex = sex
      if(country) registry.country = country
      updatedUser.registry = registry
      updatedUser.updatedAt = dayjs().toDate()

      const { modifiedCount } = await MongoDBInstance.collection.user.updateOne(
        { _id: new ObjectId(req.idUser) },
        { $set: normalizeUpdateObject(updatedUser) }
      )

      if (modifiedCount === 0) throw new Error(ErrorMessages.user_update_failed)
      userLoader.clear(req.idUser)

      return true
    },
    updateUser: async (_, { userInput }, { req }) => {
      if(!req.isAuth) throw new Error(ErrorMessages.user_unauthenticated)
      checkPrivileges(req)
      const { _id, name, surname, dateOfBirth, phone, email, sex, country } = userInput

      if(isEmpty(cleanDeep(userInput))) return true

      const updatedUser = new User()
      const registry = new Registry()
      if(name) registry.name = name
      if(surname) registry.surname = surname
      if(dateOfBirth) registry.dateOfBirth = dayjs(dateOfBirth).toDate()
      if(phone) registry.phone = phone
      if(email) registry.email = email
      if(sex) registry.sex = sex
      if(country) registry.country = country
      updatedUser.registry = registry
      updatedUser.updatedAt = dayjs().toDate()

      const { result } = await MongoDBInstance.collection.user.updateOne(
        { _id: new ObjectId(_id), createdBy: new ObjectId(req.idUser) },
        { $set: normalizeUpdateObject(updatedUser) }
      )
      
      if (!result.ok) throw new Error(ErrorMessages.user_update_failed)
      userLoader.clear(_id)

      return true
    }
  }
}

export default userResolver
