import { ObjectType } from "type-graphql";
import { FreeAgent } from "../../MongoDB/FreeAgent/Entities";
import { PaginatedListOf } from "../genericTypes";

@ObjectType()
export class PaginatedFreeAgentResponse extends PaginatedListOf(FreeAgent) {}