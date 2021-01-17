import { IsEmail, IsEnum, IsPhoneNumber, Max, MaxLength, Min, MinLength } from "class-validator"
import { Field, InputType, Int } from "type-graphql"
import { Sex } from "../../MongoDB/User/Entities"
import { MaxAge } from "../../Utils/customValidators/MaxAge"
import { MinAge } from "../../Utils/customValidators/MinAge"
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
   @MaxLength(50)
   name: string
   @Field()
   @MaxLength(50)
   surname: string
   @Field(() => String)
   @MinAge(5)
   @MaxAge(70)
   dateOfBirth: string|Date
   @Field(() => Int)
   @IsEnum(Sex)
   sex: Sex
   @Field()
   @MaxLength(4)
   country: string
   @Field({ nullable: true })
   @MaxLength(50)
   @IsEmail()
   email?: string
   @Field()
   @IsPhoneNumber('IT')
   phone: string
   @Field()
   @MaxLength(50)
   username?: string
   @Field()
   @MinLength(4)
   @MaxLength(50)
   password?: string
}