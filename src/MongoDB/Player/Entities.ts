import { ObjectId } from "mongodb"

export enum PlayerPosition {
    FutsalGoalKeeper,
    FutsalBack,
    FutsalLeftWing,
    FutsalRightWing,
    FutsalForward
}

export class Pace {
    speed: number
    stamina: number
}

export class Shooting {
    finishing: number
    shotPower: number
    longShots: number
}

export class Passing {
    vision: number
    shortPassing: number
    longPassing: number
}

export class Technique {
    agility: number
    ballControl: number
    dribbling: number
}

export class Defense {
    interception: number
    defensiveAwareness: number
    versus: number // 1>1
}

export class Physical {
    strength: number
}

export class PlayerScore {
    pace: Pace
    shooting: Shooting
    passing: Passing
    technique: Technique
    defense: Defense
    physical: Physical
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
    createdBy: ObjectId
    createdAt: Date
    updatedAt: Date
    user: ObjectId
    positions: PlayerPosition[]
    state?: PhysicalState
    score: PlayerScore
}