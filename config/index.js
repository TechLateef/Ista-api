const mongoose = require('mongoose')
require('dotenv').config()
mongoose.connect(
  process.env.NODE_ENV === 'production'
    ? process.env.DB_CONNECTION.replace(
        '<password>',
        process.env.DB_PASSWORD
      ).replace('<username>', process.env.DB_USERNAME)
    : 'mongodb://localhost/ista',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error: '))
db.once('open', function () {
  console.log('Connected successfully')
})