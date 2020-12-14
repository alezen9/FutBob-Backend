import { ObjectId } from "mongodb"

export class FreeAgentPlayer {
    _id: ObjectId
    name: string
    surname: string
    createdBy: ObjectId
    createdAt: Date
    updatedAt: Date
    
}