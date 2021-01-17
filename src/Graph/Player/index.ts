import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { List, Pagination, Privilege } from "../../MongoDB/Entities";
import { CreatePlayerInput, UpdatePlayerInput, FiltersPlayer } from "./inputs";
import { MyContext } from "../..";
import { mongoPlayer } from "../../MongoDB/Player";
import { Player } from "../../MongoDB/Player/Entities"
import { PaginatedPlayerResponse } from "./types";

@Resolver()
export class PlayerResolver {

   @Query(() => PaginatedPlayerResponse)
   @Authorized(Privilege.Manager)
   async Player_getList(@Ctx() ctx: MyContext, @Arg('filters') filters: FiltersPlayer, @Arg('pagination') pagination: Pagination): Promise<List<Player>> {
      const { idUser } = ctx.req
      const result = await mongoPlayer.getList(filters, pagination, idUser)
      return result
   }

   @Mutation(() => String)
   @Authorized(Privilege.Manager)
   async Player_create(@Ctx() ctx: MyContext, @Arg('body') body: CreatePlayerInput): Promise<String> {
      const { idUser } = ctx.req
      const _id = await mongoPlayer.create(body, idUser)
      return _id
   }

   @Mutation(() => Boolean)
   @Authorized(Privilege.Manager)
   async Player_update(@Ctx() ctx: MyContext, @Arg('body') body: UpdatePlayerInput): Promise<Boolean> {
      const { idUser } = ctx.req
      const done = await mongoPlayer.update(body, idUser)
      return done
   }

   @Mutation(() => Boolean)
   @Authorized(Privilege.Manager)
   async Player_delete(@Ctx() ctx: MyContext, @Arg('_id') _id: string): Promise<Boolean> {
      const { idUser } = ctx.req
      const done = await mongoPlayer.delete(_id, idUser)
      return done
   }
}

export { UserFieldResolver } from './FieldResolvers/user'
