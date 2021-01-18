import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { mongoUser } from "../../MongoDB/User";
import { User } from "../../MongoDB/User/Entities";
import ErrorMessages from "../../Utils/ErrorMessages";
import { Privilege } from "../../MongoDB/Entities";
import { MyContext } from "../..";
import { userLoader } from "./Loader";
import { ChangePasswordInput, CreateUserInput, UpdateRegistryInput }  from './inputs'
import { playerLoader } from "../Player/Loader";
@Resolver()
export class UserResolver {

   @Mutation(() => String)
   @Authorized(Privilege.Manager)
   async User_create(@Ctx() ctx: MyContext, @Arg('body') body: CreateUserInput): Promise<String> {
      const { idUser } = ctx.req
      const _id = await mongoUser.create(body, idUser)
      return _id
   }

   @Mutation(() => Boolean)
   @Authorized(Privilege.Manager)
   async User_update(@Ctx() ctx: MyContext, @Arg('body') body: UpdateRegistryInput): Promise<Boolean> {
      const { idUser } = ctx.req
      const done = await mongoUser.update(body, idUser)
      if(done) userLoader.clear(idUser)
      return done
   }

   @Mutation(() => Boolean)
   @Authorized(Privilege.Manager)
   async User_delete(@Ctx() ctx: MyContext, @Arg('_id') _id: string): Promise<Boolean> {
      const { idUser } = ctx.req
      const { user, player } = await mongoUser.delete(_id, idUser)
      if(user) userLoader.clear(user)
      if(player) playerLoader.clear(player)
      return true
   }

   @Query(() => User)
   @Authorized(Privilege.Manager)
   async User_getMe(@Ctx() ctx: MyContext): Promise<User> {
      const { idUser } = ctx.req
      const user: User = await mongoUser.getUserById(idUser)
      if (!user) throw new Error(ErrorMessages.user_user_not_exists)
      return user
   }

   @Mutation(() => Boolean)
   @Authorized(Privilege.Manager)
   async User_changeMyPassword(@Ctx() ctx: MyContext, @Arg('body') body: ChangePasswordInput): Promise<Boolean> {
      const { idUser } = ctx.req
      const done = await mongoUser.changePassword(body, idUser)
      if(done) userLoader.clear(idUser)
      return done
   }
   
}

export { PlayerFieldResolver } from './FieldResolvers/player'
