
const express = require('express')

const app = express()
const path = require('path')


app.set('views', path.join(__dirname, './views'))



//register middlewares
require('./middlewares')(app)

//register routers
require('./route')(app)

require('./errors/globalHandler')(app)

module.exports = app