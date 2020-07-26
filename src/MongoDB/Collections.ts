const Collections = [
  {
    name: 'User',
    indexes: [
      { 'credentials.username': 1 }
    ]
  },
  {
    name: 'Player',
    indexes: []
  },
  {
    name: 'Match',
    indexes: []
  }
//   {
//     name: 'AggregationPlayer',
//     indexes: []
//   },
//   {
//     name: 'AggregationMatches',
//     indexes: []
//   }
]

export default Collections
