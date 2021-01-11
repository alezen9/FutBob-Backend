import { Field, InputType, Int } from "type-graphql"
import { Sex } from "../../MongoDB/User/Entities"

@InputType()
export class LoginInput {
   @Field()
   username: string
   @Field()
   password: string
}

@InputType()
export class RegisterInput {
   @Field()
   name: string
   @Field()
   surname: string
   @Field(() => String)
   dateOfBirth: Date
   @Field(() => Int)
   sex: Sex
   @Field()
   country: string
   @Field({ nullable: true })
   email?: string
   @Field()
   phone: string
   @Field()
   username: string
   @Field()
   password: string
}