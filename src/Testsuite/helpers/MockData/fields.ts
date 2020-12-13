import { FieldState, FieldType } from '../../../MongoDB/Fields/Entities'

export const field1 = {
  _id: undefined,
  type: FieldType.Outdoor,
  name: 'Bolbeno arena',
  measurements: {
    width: 15,
    height: 25
  },
  price: 1200,
  state: FieldState.NotGreatNotTerrible,
  location: {
    type: 'Point',
    coordinates: [46.03369715, 10.7372789]
  }
}

export const field2 = {
  _id: undefined,
  type: FieldType.Outdoor,
  name: 'Tione arena',
  measurements: {
    width: 17,
    height: 28
  },
  price: 1000,
  state: FieldState.Terrible,
  location: {
    type: 'Point',
    coordinates: [46.03362, 10.728869]
  }
}

export const fields = [field1, field2]
