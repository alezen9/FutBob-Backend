import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { List, Pagination, Privilege } from "../../MongoDB/Entities";
import { CreateAppointmentInput, FiltersAppointment, SetMpvManuallyInput, SortAppointment, UpdateAppointmentInvitesInput, UpdateAppointmentMainInput, UpdateAppointmentMatchesInput, UpdateAppointmentStateInput, UpdateAppointmentStatsInput } from "./inputs";
import { MyContext } from "../../../index";
import { PaginatedAppoontmentResponse } from "./types";
import { mongoAppointment } from "../../MongoDB/Appointment";
import { Appointment, AppointmentState, AppointmentInvitesState } from "../../MongoDB/Appointment/Entities";

@Resolver()
export class AppointmentResolver {

   @Query(() => PaginatedAppoontmentResponse)
   @Authorized(Privilege.Manager)
   async Appointment_getList(@Ctx() ctx: MyContext, @Arg('filters') filters: FiltersAppointment, @Arg('pagination') pagination: Pagination): Promise<List<Appointment>> {
      const { idUser } = ctx.req
      const result = await mongoAppointment.getList(filters, pagination, idUser)
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
   async Appointment_UpdateMainInfo(@Ctx() ctx: MyContext, @Arg('body') body: UpdateAppointmentMainInput): Promise<Boolean> {
      const { idUser } = ctx.req
      const done = await mongoAppointment.updateMainInfo(body, idUser)
      return done
   }

   @Mutation(() => Boolean)
   @Authorized(Privilege.Manager)
   async Appointment_UpdateState(@Ctx() ctx: MyContext, @Arg('body') body: UpdateAppointmentStateInput): Promise<Boolean> {
      const { idUser } = ctx.req
      const done = await mongoAppointment.updateState(body, idUser)
      return done
   }

   @Mutation(() => Boolean)
   @Authorized(Privilege.Manager)
   async Appointment_UpdateStats(@Ctx() ctx: MyContext, @Arg('body') body: UpdateAppointmentStatsInput): Promise<Boolean> {
      const { idUser } = ctx.req
      const done = await mongoAppointment.updateStats(body, idUser)
      return done
   }

   @Mutation(() => Boolean)
   @Authorized(Privilege.Manager)
   async Appointment_SetMpvManually(@Ctx() ctx: MyContext, @Arg('body') body: SetMpvManuallyInput): Promise<Boolean> {
      const { idUser } = ctx.req
      const done = await mongoAppointment.setMvpManually(body, idUser)
      return done
   }

   @Mutation(() => Boolean)
   @Authorized(Privilege.Manager)
   async Appointment_UpdateInvites(@Ctx() ctx: MyContext, @Arg('body') body: UpdateAppointmentInvitesInput): Promise<Boolean> {
      const { idUser } = ctx.req
      const done = await mongoAppointment.updateInvites(body, idUser)
      return done
   }

   @Mutation(() => Boolean)
   @Authorized(Privilege.Manager)
   async Appointment_UpdateMatches(@Ctx() ctx: MyContext, @Arg('body') body: UpdateAppointmentMatchesInput): Promise<Boolean> {
      const { idUser } = ctx.req
      const done = await mongoAppointment.updateMatches(body, idUser)
      return done
   }
}

export { AppointmentFieldResolvers } from './FieldResolvers'
