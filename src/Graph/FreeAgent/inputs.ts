import { IsMongoId, MaxLength } from 'class-validator'
import { Field, InputType } from 'type-graphql'

@InputType()
export class CreateFreeAgentInput {
   @Field()
   @MaxLength(50)
   name: string
   @Field()
   @MaxLength(50)
   surname: string
}

@InputType()
export class UpdateFreeAgentInput {
   @Field()
   @IsMongoId()
   _id: string
   @Field({ nullable: true })
   @MaxLength(50)
   name?: string
   @Field({ nullable: true })
   @MaxLength(50)
   surname?: string
}

@InputType()
export class FiltersFreeAgent {
   @Field(() => [String], { nullable: true })
   ids?: string[]
   @Field({ nullable: true })
   @MaxLength(50)
   searchText?: string
}