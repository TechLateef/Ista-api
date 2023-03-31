const userRouter = require('./User.route')


/**
 * @param {Express} app the express app
 */

const RegisterRoute = (app) =>{

    app.use('/api/v1/users', userRouter)
}

module.exports = RegisterRoute