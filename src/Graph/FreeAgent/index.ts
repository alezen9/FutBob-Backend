import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { List, Pagination, Privilege } from "../../MongoDB/Entities";
import { CreateFreeAgentInput, UpdateFreeAgentInput, FiltersFreeAgent } from "./inputs";
import { MyContext } from "../..";
import { PaginatedFreeAgentResponse } from "./types";
import { mongoFreeAgent } from "../../MongoDB/FreeAgent";
import { FreeAgent } from "../../MongoDB/FreeAgent/Entities";

@Resolver()
export class FreeAgentResolver {

   @Query(() => PaginatedFreeAgentResponse)
   @Authorized(Privilege.Manager)
   async FreeAgent_getList(@Ctx() ctx: MyContext, @Arg('filters') filters: FiltersFreeAgent, @Arg('pagination') pagination: Pagination): Promise<List<FreeAgent>> {
      const { idUser } = ctx.req
      const result = await mongoFreeAgent.getList(filters, pagination, idUser)
      return result
   }

   @Mutation(() => String)
   @Authorized(Privilege.Manager)
   async FreeAgent_create(@Ctx() ctx: MyContext, @Arg('body') body: CreateFreeAgentInput): Promise<String> {
      const { idUser } = ctx.req
      const _id = await mongoFreeAgent.create(body, idUser)
      return _id
   }

   @Mutation(() => Boolean)
   @Authorized(Privilege.Manager)
   async FreeAgent_update(@Ctx() ctx: MyContext, @Arg('body') body: UpdateFreeAgentInput): Promise<Boolean> {
      const { idUser } = ctx.req
      const done = await mongoFreeAgent.update(body, idUser)
      return done
   }

   @Mutation(() => Boolean)
   @Authorized(Privilege.Manager)
   async FreeAgent_delete(@Ctx() ctx: MyContext, @Arg('_id') _id: string): Promise<Boolean> {
      const { idUser } = ctx.req
      const done = await mongoFreeAgent.delete(_id, idUser)
      return done
   }
}