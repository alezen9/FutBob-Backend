import { TypeListOf } from '../../genericTypes'

export default `
    type Measurements {
        width: Float!,
        height: Float!
    }

    type Field {
        _id: String!
        type: Int!,
        name: String!,
        measurements: Measurements!,
        state: Int!,
        price: Int!,
        location: GeoPoint!
    }

    ${TypeListOf('Field')}
`
