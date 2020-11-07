import { PlayerType } from "../Player/Entities"
import { ObjectId } from "mongodb"
import { GeoPoint } from "../Entities"

export class MatchPlayer {
    playerId: ObjectId
    rating?: number
    goals?: number
}

export enum MatchState {
    Scheduled,
    Confirmed,
    Completed,
    Canceled
}

export class Match {
    _id: ObjectId
    createdAt: Date
    updatedAt: Date
    location?: GeoPoint
    state: MatchState
    type: PlayerType
    invitedPlayers: ObjectId[]
    ditchedPlayers: ObjectId[]
    confirmedPlayers: MatchPlayer[]
    notes?: string
}