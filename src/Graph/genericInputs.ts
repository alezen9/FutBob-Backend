
export default `
  input PaginationInput {
    skip: Int,
    limit: Int
  }

  input LocationInput {
    type: String!,
    coordinates: [Float!]
  }
`
