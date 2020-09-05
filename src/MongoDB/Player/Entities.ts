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

export class Pace {
    acceleration: number
    sprintSpeed: number
}

export class Shooting {
    positioning: number
    finishing: number
    shotPower: number
    longShots: number
    volleys: number
    penalties: number
}

export class Passing {
    vision: number
    crossing: number
    freeKick: number
    shortPassing: number
    longPassing: number
    curve: number
}

export class Dribbling {
    agility: number
    balance: number
    reactions: number
    ballControl: number
    dribbling: number
    composure: number
}

export class Defense {
    interceptions: number
    heading: number
    defensiveAwareness: number
    standingTackle: number
    slidingTackle: number
}

export class Physical {
    jumping: number
    stamina: number
    strength: number
    aggression: number
}

export class PlayerScore {
    pace: Pace
    shooting: Shooting
    passing: Passing
    dribbling: Dribbling
    defense: Defense
    physical: Physical
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
    score: PlayerScore
}