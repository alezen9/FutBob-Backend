import { IsEnum, IsMongoId, Matches, MaxLength } from 'class-validator'
import { Field, InputType, Int } from 'type-graphql'
import { AppointmentState, AppointmentPlayerType } from '../../MongoDB/Appointment/Entities'
import { EnumArrayOf } from '../../Utils/customValidators/EnumArrayOf'

@InputType('typedPlayer')
export class TypedPlayerInput {
   @Field()
   @IsMongoId()
   player: string
   @Field(() => Int)
   @IsEnum(AppointmentPlayerType)
   type: number
}

@InputType()
export class CreateAppointmentInput {
   @Field()
   @IsMongoId()
   field: string
   @Field(() => Int, { nullable: true })
   autoBlockInvitesQuorum?: number
   @Field(() => String, { nullable: true })
   timeAndDate: Date|string
   @Field(() => [String], { nullable: true })
   invitedPlayers: string[]
   @Field(() => [TypedPlayerInput], { nullable: true })
   confirmedPlayers: TypedPlayerInput[]
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

@InputType('appointmentStats')
export class AppointmentStatsInput {
    @Field(() => [AppointmentPlayerInput])
    individualStats: AppointmentPlayerInput[]
}

@InputType()
export class UpdateAppointmentInput {
   @Field()
   _id: string
   @Field({ nullable: true })
   @IsMongoId()
   field?: string
   @Field(() => String, { nullable: true })
   timeAndDate?: Date|string
   @Field(() => [String], { nullable: true })
   invitedPlayers?: string[]
   @Field(() => [TypedPlayerInput], { nullable: true })
   ditchedPlayers?: TypedPlayerInput[]
   @Field(() => [TypedPlayerInput], { nullable: true })
   confirmedPlayers?: TypedPlayerInput[]
   @Field(() => Int, { nullable: true })
   autoBlockInvitesQuorum?: number
   @Field(() => [AppointmentMatchInput], { nullable: true })
   matches?: AppointmentMatchInput[]
   @Field(() => [AppointmentStatsInput], { nullable: true })
   stats?: AppointmentStatsInput[]
   notes?: string
}

@InputType()
export class FiltersAppointment {
   @Field(() => [String], { nullable: true })
   ids?: string[]
   @Field(() => [Int], { nullable: true })
   @EnumArrayOf(AppointmentState)
   state?: AppointmentState[]
   @Field(() => [String], { nullable: true })
   fields?: string[]
   @Field({ nullable: true })
   @MaxLength(50)
   searchText?: string
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