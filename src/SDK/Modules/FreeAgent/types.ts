import { Pagination } from "../generic_types";

export type CreateFreeAgentInput = {
   name: string
   surname: string
}

export type UpdateFreeAgentInput = Partial<CreateFreeAgentInput> & {
   _id: string
}

export type FreeAgentFilters = {
   ids?: string[]
   searchText?: string
   pagination?: Pagination
}