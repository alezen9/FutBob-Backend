export const TypeListOf = (type: string) => `type ListOf${type} {
  totalCount: Int!,
  result: [${type}]
}`

export default `
  type GeoPoint {
    type: String!,
    coordinates: [Float!]
  }

  type SuccessOrFailure {
    errorMessage: String,
    success: Boolean!
  }
`