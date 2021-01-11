export default `
  input MeasurementsInput {
    width: Float!,
    height: Float!
  }

  input CreateFieldInput {
    type: Int!,
    name: String!,
    price: Int!,
    state: Int!,
    location: LocationInput,
    measurements: MeasurementsInput
  }

  input FieldsFilters {
    ids: [String],
    type: Int,
    states: [Int],
    searchText: String,
    pagination: PaginationInput
  }

  input UpdateFieldInput {
    _id: String!,
    type: Int,
    name: String,
    price: Int,
    state: Int,
    location: LocationInput,
    measurements: MeasurementsInput
  }
`
