import { ObjectId } from "mongodb"

export enum Positions {
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
    SecondStriker,
    FutsalGoalKeeper,
    FutsalBack,
    FutsalForward
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
    positions: Positions[]
    type: PlayerType
    matches?: ObjectId[]
    state?: PhysicalState
}