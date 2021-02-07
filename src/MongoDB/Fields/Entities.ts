import { Max, Min } from "class-validator"
import dayjs from "dayjs"
import { ObjectId } from "mongodb"
import { InputType, ObjectType, Field as FieldTG, ID, Int } from "type-graphql"
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

@ObjectType()
@InputType('measurements')
export class Measurements { // in centimeters
   @FieldTG(() => Int)
   @Min(500) // 5m
   @Max(15000) // 150m
   width: number
   @FieldTG(() => Int)
   @Min(500) // 5m
   @Max(15000) // 150m
   height: number
}

type CreateOrUpdateField = {
   _id?: ObjectId|string
   createdBy?: ObjectId|string
   createdAt?: Date|string
   updatedAt?: Date|string
   type?: FieldType
   name?: string
   measurements?: Measurements
   state?: FieldState
   price?: number
   location?: GeoPoint
}

@ObjectType()
export class Field {
   @FieldTG(() => ID)
   _id: ObjectId
   createdBy: ObjectId
   createdAt: Date|string
   updatedAt: Date|string
   @FieldTG(() => Int)
   @Min(0)
   @Max(1)
   type: FieldType
   @FieldTG()
   name: string
   @FieldTG(() => Measurements)
   measurements: Measurements
   @FieldTG(() => Int)
   state: FieldState
   @FieldTG(() => Int)
   price: number // in cents
   @FieldTG(() => GeoPoint)
   location: GeoPoint

   constructor(data?: CreateOrUpdateField) {
      if(data._id) this._id = new ObjectId(data._id)
      if(data.createdBy) this.createdBy = new ObjectId(data.createdBy)
      if(data.createdAt) this.createdAt = dayjs(data.createdAt).toISOString()
      if(data.updatedAt) this.updatedAt = dayjs(data.updatedAt).toISOString()
      if(![null, undefined].includes(data.type)) this.type = data.type
      if(data.name) this.name = data.name
      if(![null, undefined].includes(data.state)) this.state = data.state
      if(![null, undefined].includes(data.price)) this.price = data.price
      if(data.measurements) {
         const _measurements = new Measurements()
         _measurements.width = data.measurements.width
         _measurements.height = data.measurements.height
         this.measurements = _measurements
      }
      if(data.measurements) {
         const _location = new GeoPoint()
         _location.type = 'Point'
         _location.coordinates = data.location.coordinates
         this.location = _location
      }
   }
}