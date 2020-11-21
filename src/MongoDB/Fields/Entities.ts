import { ObjectID } from "mongodb"
import { GeoPoint } from '../Entities'

export enum FieldType {
   Indoor,
   Outdoor
}

export enum FieldState {
   Terrible,
   NotGreatNotTerrible,
   Great
}

export class Measurements {
   width: number
   height: number
}

export class Field {
   _id: ObjectID
   createdAt: Date
   updatedAt: Date
   type: FieldType
   name: string
   measurements: Measurements
   state: FieldState
   price: number
   location: GeoPoint
}