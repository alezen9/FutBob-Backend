import { Field, InputType, Int } from 'type-graphql'
import { PhysicalState, PlayerPosition, PlayerScore } from '../../MongoDB/Player/Entities'

@InputType()
export class CreatePlayerInput {
   @Field()
   user: string
   @Field(() => [Int]!)
   positions: PlayerPosition[]
   @Field(() => Int, { nullable: true })
   state?: PhysicalState
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
   state?: PhysicalState
   @Field(() => PlayerScore, { nullable: true })
   score?: PlayerScore
}