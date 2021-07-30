import { IsEnum, IsMongoId, Matches, Max, MaxLength, Min, ValidateNested } from 'class-validator'
import { Field, InputType, Int } from 'type-graphql'
import { PhysicalState, PlayerPosition, PlayerScore } from '../../MongoDB/Player/Entities'
import { EnumArrayOf } from '../../Utils/customValidators/EnumArrayOf'

@InputType()
export class CreatePlayerInput {
   @Field()
   @IsMongoId()
   user: string
   @Field(() => [Int]!)
   @EnumArrayOf(PlayerPosition)
   positions: PlayerPosition[]
   @Field(() => Int, { nullable: true })
   @IsEnum(PhysicalState)
   state: PhysicalState
   @Field(() => PlayerScore)
   score: PlayerScore
}

@InputType()
export class UpdatePlayerInput {
   @Field()
   _id: string
   @Field(() => [Int], { nullable: true })
   positions?: PlayerPosition[]
   @Field(() => Int, { nullable: true })
   @Min(0)
   @Max(4)
   state?: PhysicalState
   @Field(() => PlayerScore, { nullable: true })
   @ValidateNested()
   score?: PlayerScore
}

@InputType()
export class FiltersPlayer {
   @Field(() => [String], { nullable: true })
   ids?: string[]
   @Field(() => [Int], { nullable: true })
   @EnumArrayOf(PlayerPosition)
   positions?: PlayerPosition[]
   @Field(() => [Int], { nullable: true })
   @EnumArrayOf(PhysicalState)
   states?: PhysicalState[]
   @Field(() => [String], { nullable: true })
   countries?: string[]
   @Field({ nullable: true })
   @MaxLength(50)
   searchText?: string
}

export enum EnumSortPlayer {
   name = 'name',
   country = 'country',
   age = 'age'
}
@InputType()
export class SortPlayer {
   @Field(() => String, { nullable: true })
   @IsEnum(EnumSortPlayer)
   field?: EnumSortPlayer
   @Field({ nullable: true })
   @Matches(/ASC|DESC/)
   sort?: 'ASC'|'DESC'
}