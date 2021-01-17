import { IsEnum, IsMongoId, Max, MaxLength, Min, ValidateNested } from 'class-validator'
import { Field, InputType, Int } from 'type-graphql'
import { GeoPoint } from '../../MongoDB/Entities'
import { FieldState, FieldType, Measurements } from '../../MongoDB/Fields/Entities'
import { EnumArrayOf } from '../../Utils/customValidators/EnumArrayOf'

@InputType()
export class CreateFieldInput {
   @Field(() => Int)
   @IsEnum(FieldType)
   type: FieldType
   @Field()
   @MaxLength(50)
   name: string
   @Field(() => Int)
   @IsEnum(FieldState)
   state: FieldState
   @Field(() => Int)
   @Min(0) // 0€
   @Max(15000) // 150€
   price: number
   @Field(() => Measurements)
   measurements: Measurements
   @Field(() => GeoPoint)
   location: GeoPoint
}

@InputType()
export class UpdateFieldInput {
   @Field()
   @IsMongoId()
   _id: string
   @Field(() => Int, { nullable: true })
   @IsEnum(FieldType)
   type?: FieldType
   @Field({ nullable: true })
   name?: string
   @Field(() => Int, { nullable: true })
   @IsEnum(FieldState)
   state?: FieldState
   @Field(() => Int, { nullable: true })
   @Min(0) // 0€
   @Max(15000) // 150€
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
   @IsEnum(FieldType)
   type?: FieldType
   @Field(() => [Int], { nullable: true })
   @EnumArrayOf(FieldState)
   states?: FieldState[]
   @Field({ nullable: true })
   @MaxLength(50)
   searchText?: string
}