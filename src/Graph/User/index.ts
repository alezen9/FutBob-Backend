import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { mongoUser } from "../../MongoDB/User";
import { User } from "../../MongoDB/User/Entities";
import ErrorMessages from "../../Utils/ErrorMessages";
import { Privilege } from "../../MongoDB/Entities";
import { MyContext } from "../..";
import { userLoader } from "./Loader";
import { ChangePasswordInput, CreateUserInput, UpdateRegistryInput }  from './inputs'
@Resolver()
export class UserResolver {

   @Mutation(() => String)
   async createUser(@Ctx() ctx: MyContext, @Arg('body') body: CreateUserInput): Promise<String> {
      const { idUser } = ctx.req
      const _id = await mongoUser.create(body, idUser)
      return _id
   }

   @Query(() => User)
   @Authorized(Privilege.Manager)
   async getMe(@Ctx() ctx: MyContext): Promise<User> {
      const { idUser } = ctx.req
      const user: User = await mongoUser.getUserById(idUser)
      if (!user) throw new Error(ErrorMessages.user_user_not_exists)
      return user
   }

   @Mutation(() => Boolean)
   @Authorized(Privilege.Manager)
   async updateRegistry(@Ctx() ctx: MyContext, @Arg('body') data: UpdateRegistryInput): Promise<Boolean> {
      const { idUser } = ctx.req
      const done = await mongoUser.update(data, idUser)
      if(done) userLoader.clear(idUser)
      return done
   }

   @Mutation(() => Boolean)
   @Authorized(Privilege.Manager)
   async changeUsername(@Ctx() ctx: MyContext, @Arg('newUsername') newUsername: string): Promise<Boolean> {
      const { idUser } = ctx.req
      const done = await mongoUser.changeUsername(newUsername, idUser)
      if(done) userLoader.clear(idUser)
      return done
   }

   @Mutation(() => Boolean)
   @Authorized(Privilege.Manager)
   async changePassword(@Ctx() ctx: MyContext, @Arg('body') data: ChangePasswordInput): Promise<Boolean> {
      const { idUser } = ctx.req
      const done = await mongoUser.changePassword(data, idUser)
      if(done) userLoader.clear(idUser)
      return done
   }
   
}

export { PlayerFieldResolver } from './FieldResolvers/player'
