const UnAuthenticated = require('./UnAuthenticate.error')
const NotFound = require('./NotFound.error')
const BadRequest = require('./BadRequest.error')
const InternalServerError = require('./ServerError.error')
const CustomApiError = require('./Custom.error')


module.exports = {
  CustomApiError,
  UnAuthenticated,
  BadRequest,
  NotFound,
  InternalServerError,
}