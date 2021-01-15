import { Max, Min } from "class-validator"
import dayjs from "dayjs"
import { ObjectId } from "mongodb"
import { InputType, ObjectType, Field as FieldTG, ID, Int, Float } from "type-graphql"
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
   @Min(5)
   @Max(200)
   width: number
   @FieldTG(() => Int)
   @Min(5)
   @Max(200)
   height: number
}

type CreateOrUpdateField = {
   _id?: ObjectId|string
   createdBy?: ObjectId|string
   createdAt?: Date
   updatedAt?: Date
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
   createdAt: Date
   updatedAt: Date
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
      if(data.createdAt) this.createdAt = dayjs(data.createdAt).toDate()
      if(data.updatedAt) this.updatedAt = dayjs(data.updatedAt).toDate()
      if(data.type) this.type = data.type
      if(data.name) this.name = data.name
      if(data.state) this.state = data.state
      if(data.price) this.type = data.price
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