const fs = require('fs')

fs.readdirSync('./').forEach(file => {
  console.log('hereee')
  console.log(file)
})

export default {
  typeDefs: {

  },
  resolvers: {

  }
}
