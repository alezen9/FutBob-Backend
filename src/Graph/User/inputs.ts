import { Field, InputType, Int } from "type-graphql"
import { Sex } from "../../MongoDB/User/Entities"

@InputType()
export class ChangePasswordInput {
   @Field()
   oldPassword: string
   @Field()
   newPassword: string
}

@InputType()
export class CreateUserInput {
   @Field()
   name: string
   @Field()
   surname: string
   @Field(() => String)
   dateOfBirth: string|Date
   @Field(() => Int)
   sex: Sex
   @Field()
   country: string
   @Field({ nullable: true })
   email?: string
   @Field()
   phone: string
}
@InputType()
export class UpdateRegistryInput {
   @Field()
   _id: string
   @Field({ nullable: true })
   name?: string
   @Field({ nullable: true })
   surname?: string
   @Field(() => String, { nullable: true })
   dateOfBirth?: string|Date
   @Field(() => Int, { nullable: true })
   sex?: Sex
   @Field({ nullable: true })
   country?: string
   @Field({ nullable: true })
   email?: string
   @Field({ nullable: true })
   phone?: string
}