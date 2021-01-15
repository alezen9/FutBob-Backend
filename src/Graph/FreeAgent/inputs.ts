import { Field, InputType } from 'type-graphql'

@InputType()
export class CreateFreeAgentInput {
   @Field()
   name: string
   @Field()
   surname: string
}

@InputType()
export class UpdateFreeAgentInput {
   @Field()
   _id: string
   @Field({ nullable: true })
   name?: string
   @Field({ nullable: true })
   surname?: string
}

@InputType()
export class FiltersFreeAgent {
   @Field(() => [String], { nullable: true })
   ids?: string[]
   @Field({ nullable: true })
   searchText?: string
}