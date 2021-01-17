import { Max, Min } from 'class-validator'
import { Field, InputType, Int } from 'type-graphql'
import { GeoPoint } from '../../MongoDB/Entities'
import { FieldState, FieldType, Measurements } from '../../MongoDB/Fields/Entities'

@InputType()
export class CreateFieldInput {
   @Field(() => Int)
   type: FieldType
   @Field()
   name: string
   @Field(() => Int)
   state: FieldState
   @Field(() => Int)
   price: number
   @Field(() => Measurements)
   measurements: Measurements
   @Field(() => GeoPoint)
   location: GeoPoint
}

@InputType()
export class UpdateFieldInput {
   @Field()
   _id: string
   @Field(() => Int, { nullable: true })
   type?: FieldType
   @Field({ nullable: true })
   name?: string
   @Field(() => Int, { nullable: true })
   state?: FieldState
   @Field(() => Int, { nullable: true })
   @Min(1)
   price?: number
   @Field(() => Measurements, { nullable: true })
   measurements?: Measurements
   @Field(() => GeoPoint, { nullable: true })
   location?: GeoPoint
}

@InputType()
export class FiltersField {
   @Field(() => [String], { nullable: true })
   ids?: string[]
   @Field(() => Int, { nullable: true })
   type?: FieldType
   @Field(() => [Int], { nullable: true })
   states?: number[]
   @Field({ nullable: true })
   searchText?: string
}