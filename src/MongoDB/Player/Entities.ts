import { ObjectId } from "mongodb"

export enum PlayerPosition {
    FutsalGoalKeeper,
    FutsalBack,
    FutsalLeftWing,
    FutsalRightWing,
    FutsalForward,
    Goalkeeper,
    Sweeper,
    CentreBack,
    LeftFullBack,
    RightFullBack,
    LeftWingBack,
    RightWingBack,
    DefensiveMidfielder,
    CentralMidfielder,
    LeftMidfielder,
    RightMidfielder,
    AttackingMidfielder,
    CenterForward,
    Striker,
    SecondStriker
}

export class RadarData {
    speed: number
    stamina: number
    defence: number
    balance: number
    ballControl: number
    passing: number
    finishing: number
}

export enum PlayerType {
    Football,
    Futsal
}

export enum PhysicalState {
    Top,
    Medium,
    Low,
    Injured,
    Recovery
}

export class Player {
    _id: ObjectId
    user: ObjectId
    positions: PlayerPosition[]
    type: PlayerType
    matches?: ObjectId[]
    state?: PhysicalState
    createdAt: Date
    updatedAt: Date
    radar: RadarData
}