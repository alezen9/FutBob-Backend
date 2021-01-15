import { ObjectType } from "type-graphql";
import { Player } from "../../MongoDB/Player/Entities";
import { PaginatedListOf } from "../genericTypes";

@ObjectType()
export class PaginatedPlayerResponse extends PaginatedListOf(Player) {}