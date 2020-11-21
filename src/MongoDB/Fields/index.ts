import moment from 'moment'
import { MongoDBInstance } from '..'
import { ObjectId } from 'mongodb'
import { facetCount } from '../helpers'
import { get } from 'lodash'
import { GeoPoint, List } from '../Entities'
import { Field, Measurements } from './Entities'

class MongoFields {
  
  async createField (data: Omit<Field, '_id'|'createdAt'|'updatedAt'>): Promise<string> {
    const now = moment().toDate()
    const field = new Field()
    field._id = new ObjectId()
    field.createdAt = now
    field.updatedAt = now
    field.price = data.price
    field.location = new GeoPoint()
    field.location.type = 'Point'
    field.location.coordinates = data.location.coordinates
    field.measurements = new Measurements()
    field.measurements.height = data.measurements.height
    field.measurements.width = data.measurements.width
    field.name = data.name
    field.state = data.state
    field.type = data.type    

    await MongoDBInstance.collection.fields.insertOne(field)
    return field._id.toHexString()
  }

  async getFields (filters: any): Promise<List<Field>> {
    const { 
      ids = [],
      searchText,
      type,
      states = [],
      pagination = {}
    } = filters
    const { skip = 0, limit } = pagination
    const _limit = !limit || limit < 0 || limit > 100
      ? 100
      : limit
    let query = []
    if(ids.length) query.push({ $match: { _id: { $in: ids.map(ObjectId) } } })
    if(type !== undefined) query.push({ $match: { type } })
    if(states.length) query.push({ $match: { state: { $in: states } } })
    if(searchText) query.push({ $match: { name: new RegExp(searchText, 'i') } })
    query.push(facetCount({ skip, limit: _limit }))
    const res: Field[] = await MongoDBInstance.collection.fields.aggregate(query).toArray()
    const result = {
      totalCount: get(res, '[0].totalCount[0].count', 0) as number,
      result: get(res, '[0].result', []) as Field[]
    }
    return result
  }

  async getFieldById (_id: string): Promise<Field> {
    const field: Field = await MongoDBInstance.collection.fields.findOne({ _id: new ObjectId(_id) })
    return field
  }

  getTypeFieldFields (field: Field):any {
    const { _id, ...rest } = field
    return {
      ...rest,
      _id: _id.toHexString()
    }
  }
}

export const mongoFields = new MongoFields()