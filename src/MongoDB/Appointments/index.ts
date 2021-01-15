import dayjs from 'dayjs'
import { MongoDBInstance } from '..'
import { ObjectId } from 'mongodb'
import { mongoUser } from '../User'
import { facetCount } from '../helpers'
import { get } from 'lodash'
import { List } from '../Entities'
import { Appointment } from './Entities'

class MongoAppointment {

}

export const mongoAppointment = new MongoAppointment()
