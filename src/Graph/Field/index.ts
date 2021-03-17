import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { List, Pagination, Privilege } from "../../MongoDB/Entities";
import { FiltersField, CreateFieldInput, UpdateFieldInput } from "./inputs";
import { MyContext } from "../../../index";
import { PaginatedFieldResponse } from "./types";
import { Field } from "../../MongoDB/Field/Entities";
import { mongoField } from "../../MongoDB/Field";

@Resolver()
export class FieldResolver {

   @Query(() => PaginatedFieldResponse)
   @Authorized(Privilege.Manager)
   async Field_getList(@Ctx() ctx: MyContext, @Arg('filters') filters: FiltersField, @Arg('pagination') pagination: Pagination): Promise<List<Field>> {
      const { idUser } = ctx.req
      const result = await mongoField.getList(filters, pagination, idUser)
      return result
   }

   @Mutation(() => String)
   @Authorized(Privilege.Manager)
   async Field_create(@Ctx() ctx: MyContext, @Arg('body') body: CreateFieldInput): Promise<String> {
      const { idUser } = ctx.req
      const _id = await mongoField.create(body, idUser)
      return _id
   }

   @Mutation(() => Boolean)
   @Authorized(Privilege.Manager)
   async Field_update(@Ctx() ctx: MyContext, @Arg('body') body: UpdateFieldInput): Promise<Boolean> {
      const { idUser } = ctx.req
      const done = await mongoField.update(body, idUser)
      return done
   }

   @Mutation(() => Boolean)
   @Authorized(Privilege.Manager)
   async Field_delete(@Ctx() ctx: MyContext, @Arg('_id') _id: string): Promise<Boolean> {
      const { idUser } = ctx.req
      const done = await mongoField.delete(_id, idUser)
      return done
   }
}