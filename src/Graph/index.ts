import graph_Auth from './Auth/schema'
import resolver_Auth from './Auth/resolver'
import graph_User from './User/schema'
import resolver_User from './User/resolver'
import graph_Player from './Player/schema'
import resolver_Player from './Player/resolver'
import graph_Field from './Field/schema'
import resolver_Field from './Field/resolver'
/** */
import genericTypes from './genericTypes'
import genericInputs from './genericInputs'
/** */
import { gql } from 'apollo-server'
import cleanDeep from 'clean-deep'

export type graph_File = {
  resolver: {
    Query?: any
    Mutation?: any
    Subscription?: any
  }
  schema: {
    typesAndInputs: string
    api: {
      Query: string
      Mutation: string
      Subscription: string
    }
  }
}

/** JUST ADD HERE NEW SCHEMAS AND RESOLVERS */
const filesToCompute: graph_File[] = [
  { resolver: resolver_Auth, schema: graph_Auth },
  { resolver: resolver_User, schema: graph_User },
  { resolver: resolver_Player, schema: graph_Player },
  { resolver: resolver_Field, schema: graph_Field },
]

const { typeDefsString, typeQuery, typeMutation, typeSubscription, resolvers } = filesToCompute.reduce((acc, value) => {
  acc.typeDefsString = `${acc.typeDefsString} ${value.schema.typesAndInputs}`
  acc.typeQuery = `${acc.typeQuery} ${value.schema.api.Query}`
  acc.typeMutation = `${acc.typeMutation} ${value.schema.api.Mutation}`
  acc.typeSubscription = `${acc.typeSubscription} ${value.schema.api.Subscription}`
  acc.resolvers = {
    Query: {
      ...acc.resolvers.Query,
      ...value.resolver.Query || {}
    },
    Mutation: {
      ...acc.resolvers.Mutation,
      ...value.resolver.Mutation || {}
    },
    Subscription: {
      ...acc.resolvers.Subscription,
      ...value.resolver.Subscription || {}
    }
  }
  return acc
}, {
  typeDefsString: '',
  typeQuery: '',
  typeMutation: '',
  typeSubscription: '',
  resolvers: {
    Query: {},
    Mutation: {},
    Subscription: {}
  }
})

export default {
  typeDefs: gql(`
    ${genericTypes}
    ${genericInputs}
    ${typeDefsString}
    ${!!typeQuery.trim()
      ? `type Query { ${typeQuery} }`
      : ''}
    ${!!typeMutation.trim()
      ? `type Mutation { ${typeMutation} }`
      : ''}
    ${!!typeSubscription.trim()
      ? `type Subscription { ${typeSubscription} }`
      : ''}
  `),
  resolvers: cleanDeep(resolvers)
}
