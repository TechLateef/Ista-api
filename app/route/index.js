const userRouter = require('./User.route')
const authRouter = require('./auth.route')


/**
 * Register all Routes
 * @param {Express} app the express app
 */

const RegisterRoute = (app) =>{

app.get('/', async(req, res)=>{

    res.send('Applications is Up and Running')
})


    app.use('/api/v1/users', userRouter)
    app.use('/api/v1/auth', authRouter)
}

module.exports = RegisterRoute