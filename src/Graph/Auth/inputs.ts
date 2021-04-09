import { IsEmail, IsEnum, MaxLength, MinLength } from "class-validator"
import { Field, InputType, Int } from "type-graphql"
import { Sex } from "../../MongoDB/User/Entities"
import { MaxAge } from "../../Utils/customValidators/MaxAge"
import { MinAge } from "../../Utils/customValidators/MinAge"
@InputType()
export class LoginInput {
   @Field()
   email: string
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
   @Field()
   phone: string
   @Field()
   @MaxLength(50)
   @IsEmail()
   email?: string
}

@InputType()
export class FinalizeRegistrationInput {
   @Field()
   unverifiedCode: string
   @Field()
   @MinLength(4)
   @MaxLength(50)
   password: string
   @Field()
   @MinLength(4)
   @MaxLength(50)
   confirmPassword: string
}