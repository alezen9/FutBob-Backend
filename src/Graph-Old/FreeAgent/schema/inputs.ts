export default `
  input CreateFreeAgentInput {
    name: String!,
    surname: String!
  }

  input FreeAgentFilters {
    ids: [String],
    searchText: String,
    pagination: PaginationInput
  }

  input UpdateFreeAgentInput {
    _id: String!,
    name: String,
    surname: String,
  }
`
