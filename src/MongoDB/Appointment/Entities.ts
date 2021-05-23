import { IsEnum } from "class-validator"
import { ObjectId } from "mongodb"
import { createUnionType, Field as FieldTG, ID, Int, ObjectType } from "type-graphql"
import { Field } from "../Field/Entities"
import { FreeAgent } from "../FreeAgent/Entities"
import { Player } from "../Player/Entities"

export const AppointmentTypePlayerUnion = createUnionType({
  name: "AppointmentTypePlayerUnion", // the name of the GraphQL union
  types: () => [Player, FreeAgent] as const, // function that returns tuple of object types classes
})

export enum AppointmentPlayerType {
    Registered,
    FreeAgent
}
@ObjectType()
export class AppointmentTypePlayer {
    @FieldTG(() => AppointmentTypePlayerUnion)
    player: ObjectId
    @FieldTG(() => Int)
    @IsEnum(AppointmentPlayerType)
    type: AppointmentPlayerType
}
@ObjectType()
export class AppointmentPlayerMatchStats {
    @FieldTG(() => Int)
    total: number
    @FieldTG(() => Int)
    won: number
    @FieldTG(() => Int)
    lost: number
    @FieldTG(() => Int)
    draw: number
}

@ObjectType()
export class AppointmentPlayer {
    @FieldTG(() => AppointmentTypePlayer)
    player: AppointmentTypePlayer
    @FieldTG(() => Int)
    rating: number
    @FieldTG(() => Int)
    goals: number
    @FieldTG(() => Int)
    assists: number
    @FieldTG(() => AppointmentPlayerMatchStats)
    matchStats?: AppointmentPlayerMatchStats
    @FieldTG()
    paidAmount: number
}
@ObjectType()
export class AppointmentStatsMVP {
    @FieldTG(() => AppointmentTypePlayer)
    player: AppointmentTypePlayer
    @FieldTG()
    notes?: string
}

@ObjectType()
export class AppointmentStats {
    @FieldTG(() => Int)
    totalGoals: number
    @FieldTG(() => Int)
    totalAssists: number
    @FieldTG(() => AppointmentStatsMVP, { nullable: true })
    mvp?: AppointmentStatsMVP
    @FieldTG(() => [AppointmentTypePlayer])
    mvpElegible: AppointmentTypePlayer[]
    @FieldTG(() => AppointmentTypePlayer)
    topScorer: AppointmentTypePlayer
    @FieldTG(() => AppointmentTypePlayer)
    topAssistman: AppointmentTypePlayer
    @FieldTG(() => [AppointmentPlayer])
    individualStats: AppointmentPlayer[]
}

export enum AppointmentState {
    Scheduled,
    Confirmed,
    Completed,
    Canceled,
    Interrupted
}

@ObjectType()
export class AppointmentMatchTeam {
    @FieldTG(() => [AppointmentTypePlayer])
    players: AppointmentTypePlayer[]
    @FieldTG()
    name: string // if not set by the user automatically set Team A & Team B
    @FieldTG(() => Int)
    score: number
}

@ObjectType()
export class AppointmentMatch {
    @FieldTG(() => AppointmentMatchTeam)
    teamA: AppointmentMatchTeam
    @FieldTG(() => AppointmentMatchTeam)
    teamB: AppointmentMatchTeam
    @FieldTG()
    winner: 'teamA'|'teamB'|'draw'
    @FieldTG()
    notes?: string
}

export enum AppointmentInvitesState {
    Open,
    Closed
}

export enum InviteResponseType {
    Accepted,
    Declined
}

export enum InviteListType {
    Confirmed,
    Declined,
    Waiting,
    Blacklist,
    Ignored
}

@ObjectType()
export class AppointmentInvitesInvitedPlayer {
    @FieldTG(() => Player)
    player: ObjectId
    @FieldTG(() => Int)
    totalResponses: number 
}

@ObjectType()
export class AppointmentInviteLists {
    @FieldTG(() => AppointmentInvitesInvitedPlayer)
    invited: AppointmentInvitesInvitedPlayer[]
    @FieldTG(() => Player)
    declined: ObjectId[]
    @FieldTG(() => [AppointmentTypePlayer])
    waiting: AppointmentTypePlayer[]
    @FieldTG(() => [AppointmentTypePlayer])
    confirmed: AppointmentTypePlayer[]
    @FieldTG(() => [AppointmentTypePlayer])
    blacklisted: AppointmentTypePlayer[]
    @FieldTG(() => Player)
    ignored: ObjectId[]
}

export enum AppointmentInvitesMode {
    Auto,
    Manual
}
export class AppointmentInvites {
    mode: AppointmentInvitesMode
    state: AppointmentInvitesState
    minQuorum: number
    maxQuorum: number
    checkpointQuorum: number
    lists: AppointmentInviteLists
}

@ObjectType()
export class AppointmentDate {
    @FieldTG(() => String)
    start: Date|string
    @FieldTG(() => String)
    end: Date|string
}

@ObjectType()
export class Appointment {
    @FieldTG(() => ID)
    _id: ObjectId
    createdBy: ObjectId
    createdAt: Date|string
    updatedAt: Date|string
    @FieldTG(() => AppointmentDate)
    date: AppointmentDate
    @FieldTG(() => Field)
    field: ObjectId
    @FieldTG(() => Int)
    @IsEnum(AppointmentState)
    state: AppointmentState
    invites: AppointmentInvites
    @FieldTG(() => Int)
    pricePerPlayer: number // in cents, manually set or invited / field price, min 1.50€ if field price is not 0€
    @FieldTG(() => AppointmentStats)
    stats: AppointmentStats
    @FieldTG(() => [AppointmentMatch], { nullable: true })
    matches?: AppointmentMatch[]
    @FieldTG()
    notes?: string
}

/**
 * 
 * Creation
 * 
 * 1.1 set date and time
 * 1.2 choose field
 * 1.2.1 set pricePerPlayer
 * 1.3 invite players => Players[]
 * 1.4.1 optional set minQuorum (1-50 included) // these to be added later
 * 1.4.2 optional set maxQuorum (1-50 included)
 * 1.4.3 optional set checkpointQuorum (1-25)
 * => Appointment created
 * 
 * 
 * 
 * 
 * 
 * Invites
 * 
 * 2.1 send invites to every member of the INVITED array
 * 2.2 add some free agents to the CONFIRMED array
 * note: save last list a player was into
 * 2.3.1 INVITED player accepts => goes into CONFIRMED
 * 2.3.2 INVITED player declines => goes into DECLINED
 * 2.3.3 INVITED player that already accepted declines => goes into BLACKLIST
 * 2.3.4 INVITED player that already declined accepts =>
 *      goes into CONFIRMED if:
 *          - CONFIRMED < minQuorum || (CONFIRMED - minQuorum) % checkpointQuorum !== 0 [there are available spots]
 *      goes into WAITING otherwise
 * 2.3.5 BLACKLIST player accepts => goes into WAITING
 * 2.3.6 WAITING player declines =>
 *      goes into BLACKLIST if:
 *          - player already had been into BLACKLIST
 *      goes into DECLINED otherwise
 * 2.4 invites closed manually or automatically 1s after appointment is set to start
 * 
 * 
 * 
 * 
 * 
 * Playing
 * 
 * 3 play
 * 
 * 
 * 
 * 
 * 
 * Refine
 * 
 * 3 manage lists if needed
 *      - CONFIRMED => BLACKLIST if confirmed but didnt come
 *      - add to CONFIRMED if someone arrived in the meantime and played
 * 
 * 
 * 
 * 
 * 
 * Statistics
 * 
 * 4.1 set stats for each player that played
 * 4.1.1 set rating player
 * 4.1.2 set how many goals the player scored
 * 4.1.3 set how many assists player made
 * 4.1.4 set how much the player paid
 * 
 * 4.2.1 add matches to the appointmend
 * 4.2.2 for each match set
 *      - teamA
 *          - set which players were part of the team (pick from CONFIRMED list)
 *          - set name of the team (optinal)
 *          - set how many goals were scored byt this team
 *      - teamB (same as teamA)
 *          - set which players were part of the team (pick from CONFIRMED list)
 *          - set name of the team (optinal)
 *          - set how many goals were scored byt this team
 * 
 * 
 * 
 * 
 * 
 * Conclude
 * 
 * 5 archive the appointment by setting it to completed
 * 
 * 
 */