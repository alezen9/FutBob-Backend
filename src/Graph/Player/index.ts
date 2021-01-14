import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { mongoUser } from "../../MongoDB/User";
import { AuthData, User } from "../../MongoDB/User/Entities";
import ErrorMessages from "../../Utils/ErrorMessages";
import bcrypt from 'bcrypt'
import { Privilege } from "../../MongoDB/Entities";
import { CreatePlayerInput } from "./inputs";
import { MyContext } from "../..";
import { mongoPlayer } from "../../MongoDB/Player";

@Resolver()
export class PlayerResolver {

   // @Query(() => AuthData)
   // async getMe(@Arg('body') body: LoginInput): Promise<AuthData> {
   //    const { username, password } = body
   //    const user: User = await mongoUser.getUser({ username })
   //    if (!user) throw new Error(ErrorMessages.user_user_not_exists)
   //    const isEqual = await bcrypt.compare(password, user.credentials.password)
   //    if (!isEqual) throw new Error(ErrorMessages.user_password_not_correct)
   //    const tokenData = {
   //       idUser: user._id.toHexString(),
   //       privileges: user.privileges
   //    }
   //    const token = mongoUser.generateJWT(tokenData)
   //    return {
   //       token,
   //       expiresIn: mongoUser.tokenExpiration
   //    }
   // }

   @Mutation(() => String)
   async createPlayer(@Ctx() ctx: MyContext, @Arg('body') body: CreatePlayerInput): Promise<String> {
      const { idUser } = ctx.req
      const _id = await mongoPlayer.create(body, idUser)
      return _id
   }
}

export { UserFieldResolver } from './FieldResolvers/user'
