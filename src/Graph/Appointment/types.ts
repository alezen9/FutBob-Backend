import { ObjectType } from "type-graphql";
import { Appointment } from "../../MongoDB/Appointment/Entities";
import { PaginatedListOf } from "../genericTypes";

@ObjectType()
export class PaginatedAppoontmentResponse extends PaginatedListOf(Appointment) {}