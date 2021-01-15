import { ClassType, Field, Int, ObjectType } from "type-graphql";

export const PaginatedListOf = <T>(TClass: ClassType<T>) => {
    @ObjectType({ isAbstract: true })
    abstract class PaginatedResponseClass {
        @Field(() => Int)
        totalCount: number
        @Field(() => [TClass]!)
        result: T[]
    }
    return PaginatedResponseClass
}