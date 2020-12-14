export default {
  Query: `
    getFields (fieldsFilters: FieldsFilters!): ListOfField!
   `,
  Mutation: `
    createField (createFieldInput: CreateFieldInput!): String!
    updateField (updateFieldInput: UpdateFieldInput!): Boolean!
    deleteField (_id: String!): Boolean!
   `,
  Subscription: ``
}
