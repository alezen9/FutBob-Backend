import { TypeListOf } from '../../genericTypes'

export default `
    type FreeAgent {
        _id: String!
        name: String!,
        surname: String!
    }

    ${TypeListOf('FreeAgent')}
`
