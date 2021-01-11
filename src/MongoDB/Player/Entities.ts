import { ObjectId } from "mongodb"
import { Field, ID, Int, ObjectType } from "type-graphql"
import { User } from "../User/Entities"

export enum PlayerPosition {
    FutsalGoalKeeper,
    FutsalBack,
    FutsalLeftWing,
    FutsalRightWing,
    FutsalForward
}
@ObjectType()
export class Pace {
    @Field(() => Int)
    speed: number
    @Field(() => Int)
    stamina: number
}
@ObjectType()
export class Shooting {
    @Field(() => Int)
    finishing: number
    @Field(() => Int)
    shotPower: number
    @Field(() => Int)
    longShots: number
}
@ObjectType()
export class Passing {
    @Field(() => Int)
    vision: number
    @Field(() => Int)
    shortPassing: number
    @Field(() => Int)
    longPassing: number
}
@ObjectType()
export class Technique {
    @Field(() => Int)
    agility: number
    @Field(() => Int)
    ballControl: number
    @Field(() => Int)
    dribbling: number
}
@ObjectType()
export class Defense {
    @Field(() => Int)
    interception: number
    @Field(() => Int)
    defensiveAwareness: number
    @Field(() => Int)
    versus: number // 1>1
}

@ObjectType()
export class Physical {
    @Field(() => Int)
    strength: number
}
@ObjectType()
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
}

@ObjectType()
export enum PhysicalState {
    Top,
    Medium,
    Low,
    Injured,
    Recovery
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
}