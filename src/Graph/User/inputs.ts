import { IsEmail, IsEnum, IsMongoId, IsPhoneNumber, Max, MaxDate, MaxLength, Min, MinDate, MinLength } from "class-validator"
import { Field, InputType, Int } from "type-graphql"
import { Sex } from "../../MongoDB/User/Entities"
import { MaxAge } from "../../Utils/customValidators/MaxAge"
import { MinAge } from "../../Utils/customValidators/MinAge"


@InputType()
export class ChangePasswordInput {
   @Field()
   @MinLength(4)
   @MaxLength(50)
   oldPassword: string
   @Field()
   @MinLength(4)
   @MaxLength(50)
   newPassword: string
}

@InputType()
export class CreateUserInput {
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
   @IsEmail()
   email?: string
   @Field()
   @IsPhoneNumber('IT')
   phone: string
}
@InputType()
export class UpdateRegistryInput {
   @Field()
   @IsMongoId()
   _id: string
   @Field({ nullable: true })
   @MaxLength(50)
   name?: string
   @Field({ nullable: true })
   @MaxLength(50)
   surname?: string
   @Field(() => String, { nullable: true })
   @MinAge(5)
   @MaxAge(70)
   dateOfBirth?: string|Date
   @Field(() => Int, { nullable: true })
   @IsEnum(Sex)
   sex?: Sex
   @Field({ nullable: true })
   @MaxLength(4)
   country?: string
   @Field({ nullable: true })
   @IsEmail()
   email?: string
   @Field({ nullable: true })
   @IsPhoneNumber('IT')
   phone?: string
}