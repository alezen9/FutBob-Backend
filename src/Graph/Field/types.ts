import { ObjectType } from "type-graphql";
import { Field } from "../../MongoDB/Field/Entities";
import { PaginatedListOf } from "../genericTypes";

@ObjectType()
export class PaginatedFieldResponse extends PaginatedListOf(Field) {}