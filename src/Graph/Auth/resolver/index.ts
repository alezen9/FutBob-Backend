import { mongoUser } from '../../../MongoDB/User'
import { Privilege } from '../../../MongoDB/Entities'
import bcrypt from 'bcrypt'
import ErrorMessages from '../../../Utils/ErrorMessages'
import { User } from '../../../MongoDB/User/Entities'

const authResolver = {
  Query: {
    login: async (_, { signinInput }) => {
      const { username, password } = signinInput

      const user: User = await mongoUser.getUser({ username })
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
    }
  }
}

export default authResolver
