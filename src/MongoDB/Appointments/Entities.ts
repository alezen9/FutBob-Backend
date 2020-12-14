import { ObjectId } from "mongodb"
import { GeoPoint } from "../Entities"

export class AppointmentPlayer {
    playerId: ObjectId
    rating: number
    goals: number
    assists: number
}

export class AppointmentStats {
    totalGoals: number
    totalAssists: number
    manOfTheMatch: ObjectId
    topScorer: ObjectId
    topAssistman: ObjectId
    individualStats: AppointmentPlayer[]
}

export enum AppointmentState {
    Scheduled,
    Confirmed,
    Completed,
    Canceled,
    Interrupted
}

export class Appointment {
    _id: ObjectId
    createdBy: ObjectId
    createdAt: Date
    updatedAt: Date
    timeAndDate: Date
    location: GeoPoint
    state: AppointmentState
    invitedPlayers: ObjectId[]
    ditchedPlayers: ObjectId[]
    confirmedPlayers: ObjectId[]
    stats: AppointmentStats
    notes?: string
}