

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
mongoose.connect(
  process.env.NODE_ENV === 'production'
    ? process.env.DB_CONNECTION.replace(
        '<password>',
        process.env.DB_PASSWORD
      ).replace('<username>', process.env.DB_USERNAME)
    : process.env.mongo_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
).then(()=> { console.log("Connected to  mongodb")})
.catch(ex => console.log(ex))
