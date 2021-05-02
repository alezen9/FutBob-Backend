import { IsDateString, IsEnum, IsMongoId, Matches, MinDate } from 'class-validator'
import dayjs from 'dayjs'
import { Field, InputType, Int } from 'type-graphql'
import { AppointmentState, AppointmentPlayerType } from '../../MongoDB/Appointment/Entities'
import { EnumArrayOf } from '../../Utils/customValidators/EnumArrayOf'

@InputType('typedPlayer')
export class TypedPlayerInput {
   @Field()
   @IsMongoId()
   _id: string
   @Field(() => Int)
   @IsEnum(AppointmentPlayerType)
   type: number
}

@InputType()
export class SimpleInvitesInput {
    @Field(() => [TypedPlayerInput], { nullable: true })
    confirmed?: TypedPlayerInput[]
    @Field(() => [String], { nullable: true })
    invited?: string[]
}

@InputType()
export class EnhancedInvitesInput extends SimpleInvitesInput {
    @Field(() => [TypedPlayerInput], { nullable: true })
    blacklisted?: TypedPlayerInput[]
}

@InputType()
export class CreateAppointmentInput {
   @Field()
   @IsMongoId()
   field: string
   @Field(() => String)
   @IsDateString()
   @MinDate(dayjs().add(1, 'days').toDate())
   start: Date|string
   @Field(() => String, { nullable: true })
   @IsDateString()
   @MinDate(dayjs().add(1, 'days').toDate())
   end?: Date|string
   // Ignore for noe
   //
   // @Field(() => Int, { nullable: true })
   // checkpointQuorum?: number
   // @Field(() => Int, { nullable: true })
   // minQuorum?: number
   // @Field(() => Int, { nullable: true })
   // maxQuorum?: number
   @Field(() => Int, { nullable: true })
   pricePerPlayer?: number
   @Field(() => SimpleInvitesInput, { nullable: true })
   invites?: SimpleInvitesInput
   @Field(() => String, { nullable: true })
   notes?: string
}

@InputType('matchTeam')
export class AppointmentMatchTeamInput {
    @Field(() => [TypedPlayerInput])
    players: TypedPlayerInput[]
    @Field({ nullable: true })
    name?: string
    @Field(() => Int)
    score: number
}

@InputType('match')
export class AppointmentMatchInput {
    @Field(() => AppointmentMatchTeamInput)
    teamA: AppointmentMatchTeamInput
    @Field(() => AppointmentMatchTeamInput)
    teamB: AppointmentMatchTeamInput
}

@InputType('individualStats')
export class AppointmentPlayerInput {
   @Field(() => TypedPlayerInput)
   player: TypedPlayerInput
   @Field(() => Int)
   rating: number
   @Field(() => Int)
   goals: number
   @Field(() => Int)
   assists: number
}

@InputType('stats')
export class AppointmentStatsInput {
    @Field(() => [AppointmentPlayerInput])
    individualStats: AppointmentPlayerInput[]
}

@InputType()
export class UpdateAppointmentMainInput {
   @Field()
   _id: string
   @Field({ nullable: true })
   @IsMongoId()
   field?: string
   @Field(() => Int, { nullable: true })
   pricePerPlayer?: number
   @Field(() => String, { nullable: true })
   @IsDateString()
   @MinDate(dayjs().add(1, 'days').toDate())
   start?: Date|string
   @Field(() => String, { nullable: true })
   @IsDateString()
   @MinDate(dayjs().add(1, 'days').toDate())
   end?: Date|string
   @Field(() => String, { nullable: true })
   notes?: string
}

@InputType()
export class UpdateAppointmentInvitesInput {
   @Field()
   _id: string
   @Field(() => EnhancedInvitesInput, { nullable: true })
   invites?: EnhancedInvitesInput
}

@InputType()
export class UpdateAppointmentMatchesInput {
   @Field()
   _id: string
   @Field(() => [AppointmentMatchInput], { nullable: true })
   matches: AppointmentMatchInput[]
}

@InputType()
export class UpdateAppointmentStatsInput {
   @Field()
   _id: string
   @Field(() => [AppointmentStatsInput], { nullable: true })
   stats: AppointmentStatsInput
}

@InputType()
export class UpdateAppointmentStateInput {
   @Field()
   _id: string
   @Field(() => Int)
   @EnumArrayOf(AppointmentState)
   state: AppointmentState
}

@InputType()
export class FiltersAppointment {
   @Field(() => [String], { nullable: true })
   ids?: string[]
   @Field(() => [Int], { nullable: true })
   @EnumArrayOf(AppointmentState)
   states?: AppointmentState[]
   // @Field({ nullable: true })
   // @MaxLength(50)
   // searchText?: string
}

export enum EnumSortAppointment {
   timeAndDate = 'timeAndDate'
}
@InputType()
export class SortAppointment {
   @Field(() => String, { nullable: true })
   @IsEnum(EnumSortAppointment)
   field?: EnumSortAppointment
   @Field({ nullable: true })
   @Matches(/ASC|DESC/)
   sort?: 'ASC'|'DESC'
}