const winston = require('winston')

const instance = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: 'error-logs.log' }),
    new winston.transports.Console(),
  ],
})
// if (process.env.NODE_ENV !== 'production') {
//   instance.add(
//     new winston.transports.Console({
//       format: winston.format.simple(),
//     })
//   )
// }

const logger = (message, level = 'info') => {
  instance.log({
    level: level,
    message: message,
  })
}
module.exports = logger
