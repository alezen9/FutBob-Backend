import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { List, Pagination, Privilege } from "../../MongoDB/Entities";
import { CreateAppointmentInput, UpdateAppointmentInput, FiltersAppointment, SortAppointment } from "./inputs";
import { MyContext } from "../../../index";
import { PaginatedAppoontmentResponse } from "./types";
import { mongoAppointment } from "../../MongoDB/Appointment";
import { Appointment, AppointmentState, InviteState } from "../../MongoDB/Appointment/Entities";

@Resolver()
export class AppointmentResolver {

   @Query(() => PaginatedAppoontmentResponse)
   @Authorized(Privilege.Manager)
   async Appointment_getList(@Ctx() ctx: MyContext, @Arg('filters') filters: FiltersAppointment, @Arg('pagination') pagination: Pagination, @Arg('sort') sort: SortAppointment): Promise<List<Appointment>> {
      const { idUser } = ctx.req
      const result = await mongoAppointment.getList(filters, pagination, sort, idUser)
      return result
   }

   @Mutation(() => String)
   @Authorized(Privilege.Manager)
   async Appointment_create(@Ctx() ctx: MyContext, @Arg('body') body: CreateAppointmentInput): Promise<String> {
      const { idUser } = ctx.req
      const _id = await mongoAppointment.create(body, idUser)
      return _id
   }

   @Mutation(() => Boolean)
   @Authorized(Privilege.Manager)
   async Appointment_update(@Ctx() ctx: MyContext, @Arg('body') body: UpdateAppointmentInput): Promise<Boolean> {
      const { idUser } = ctx.req
      const done = await mongoAppointment.update(body, idUser)
      return done
   }

   @Mutation(() => Boolean)
   @Authorized(Privilege.Manager)
   async Appointment_delete(@Ctx() ctx: MyContext, @Arg('_id') _id: string): Promise<Boolean> {
      const { idUser } = ctx.req
      const done = await mongoAppointment.delete(_id, idUser)
      return done
   }

   @Mutation(() => Boolean)
   @Authorized(Privilege.Manager)
   async Appointment_UpdateState(@Ctx() ctx: MyContext, @Arg('_id') _id: string, @Arg('nextState') nextState: AppointmentState): Promise<Boolean> {
      const { idUser } = ctx.req
      const done = await mongoAppointment.updateState(_id, nextState, idUser)
      return done
   }

   @Mutation(() => Boolean)
   @Authorized(Privilege.Manager)
   async Appointment_UpdateInviteState(@Ctx() ctx: MyContext, @Arg('_id') _id: string, @Arg('nextState') nextState: InviteState): Promise<Boolean> {
      const { idUser } = ctx.req
      const done = await mongoAppointment.updateInviteState(_id, nextState, idUser)
      return done
   }
}

export { PlayerFieldResolver as AppointmentPlayerFieldResolver } from './FieldResolvers/players'
