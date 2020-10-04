export const withCountStages = [
  { '$group': {
    '_id': null,
    'result': { '$push': '$$ROOT' },
    'totalCount': { '$sum': 1 }
  } },
  { $unset: '_id' }
]

export const facetCount = ({skip = 10, limit = 100}: { skip?: number, limit?: number }) => Object.freeze({
  $facet: {
    totalCount: [{ $count: 'count' }],
    result: [{ $skip: skip }, { $limit: limit }]
  }
})
