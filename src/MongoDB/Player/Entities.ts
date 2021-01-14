import dayjs from "dayjs"
import { ObjectId } from "mongodb"
import { Field, ID, InputType, Int, ObjectType } from "type-graphql"
import { User } from "../User/Entities"

export enum PlayerPosition {
    FutsalGoalKeeper,
    FutsalBack,
    FutsalLeftWing,
    FutsalRightWing,
    FutsalForward
}
@ObjectType()
@InputType('pace')
export class Pace {
    @Field(() => Int)
    speed: number
    @Field(() => Int)
    stamina: number
}
@ObjectType()
@InputType('shooting')
export class Shooting {
    @Field(() => Int)
    finishing: number
    @Field(() => Int)
    shotPower: number
    @Field(() => Int)
    longShots: number
}
@ObjectType()
@InputType('passing')
export class Passing {
    @Field(() => Int)
    vision: number
    @Field(() => Int)
    shortPassing: number
    @Field(() => Int)
    longPassing: number
}
@ObjectType()
@InputType('technique')
export class Technique {
    @Field(() => Int)
    agility: number
    @Field(() => Int)
    ballControl: number
    @Field(() => Int)
    dribbling: number
}
@ObjectType()
@InputType('defense')
export class Defense {
    @Field(() => Int)
    interception: number
    @Field(() => Int)
    defensiveAwareness: number
    @Field(() => Int)
    versus: number // 1>1
}

@ObjectType()
@InputType('physical')
export class Physical {
    @Field(() => Int)
    strength: number
}
@ObjectType()
@InputType('score')
export class PlayerScore {
    @Field(() => Pace)
    pace: Pace
    @Field(() => Shooting)
    shooting: Shooting
    @Field(() => Passing)
    passing: Passing
    @Field(() => Technique)
    technique: Technique
    @Field(() => Defense)
    defense: Defense
    @Field(() => Physical)
    physical: Physical

    constructor(data?: PlayerScore) {
        if(!data) return
        const pace = new Pace()
        pace.speed = data.pace.speed
        pace.stamina = data.pace.stamina
        const shooting = new Shooting()
        shooting.finishing = data.shooting.finishing
        shooting.longShots = data.shooting.longShots
        shooting.shotPower = data.shooting.shotPower
        const passing = new Passing()
        passing.longPassing = data.passing.longPassing
        passing.shortPassing = data.passing.shortPassing
        passing.vision = data.passing.vision
        const technique = new Technique()
        technique.agility = data.technique.agility
        technique.ballControl = data.technique.ballControl
        technique.dribbling = data.technique.dribbling
        const defense = new Defense()
        defense.defensiveAwareness = data.defense.defensiveAwareness
        defense.interception = data.defense.interception
        defense.versus = data.defense.versus
        const physical = new Physical()
        physical.strength = data.physical.strength
        this.pace = pace
        this.shooting = shooting
        this.passing = passing
        this.technique = technique
        this.defense = defense
        this.physical = physical
    }
}

export enum PhysicalState {
    Top,
    Medium,
    Low,
    Injured,
    Recovery
}

type CreateOrUpdatePlayerType = {
    _id?: ObjectId
    createdBy?: ObjectId
    createdAt?: Date
    updatedAt?: Date
    user?: ObjectId
    positions?: PlayerPosition[]
    state?: PhysicalState
    score?: PlayerScore
}
@ObjectType()
export class Player {
    @Field(() => ID)
    _id: ObjectId
    createdBy: ObjectId
    createdAt: Date
    updatedAt: Date
    @Field(() => User)
    user: ObjectId
    @Field(() => [Int]!)
    positions: PlayerPosition[]
    @Field(() => Int, { nullable: true })
    state?: PhysicalState
    @Field(() => PlayerScore)
    score: PlayerScore

    constructor(data?: CreateOrUpdatePlayerType){
        if(!data) return
        if(data._id) this._id = new ObjectId(data._id)
        if(data.createdBy) this.createdBy = new ObjectId(data.createdBy)
        if(data.createdAt) this.createdAt = dayjs(data.createdAt).toDate()
        if(data.updatedAt) this.updatedAt = dayjs(data.updatedAt).toDate()
        if(data.user) this.user = new ObjectId(data.user)
        if(data.positions) this.positions = data.positions
        if(data.state) this.state = data.state
        if(data.score) this.score = new PlayerScore(data.score)
    }
}