const path = require('path')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const xss = require('xss-clean')
const cors = require('cors')
const bodyParser = require('body-parser')
const { urlencoded, json, raw, static } = require('express')

/**
 * Registers all custome and external middlewares
 * @param {Express} app The Express app
 */
const middlewaresRegister = (app) => {
  // Externa Libraries
  const corsOptions ={
    origin:'http://localhost:3000',
    credentials:true,
    optionsSuccessStatus:200,
    allowedHeaders:('Content-Type', 'Authorization')
  }
  app.use(cors(corsOptions))
  app.use(cookieParser())
  app.use(helmet())
  app.use(xss())
  app.use(bodyParser.json());
  app.use(urlencoded({ extended: true }))

  // serve static files
  app.use(static(path.join(__dirname, '../public')))

  // Use json for non webhook endpoints
  app.use((req, res, next) => {
    if (req.originalUrl.startsWith('/webhook')) {
      raw({ type: 'application/json' })(req, res, next)
    } else {
      json()(req, res, next)
    }
  })
}

module.exports = middlewaresRegister