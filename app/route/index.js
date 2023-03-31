const userRouter = require('./User.route')


/**
 * @param {Express} app the express app
 */

const RegisterRoute = (app) =>{

app.get('/', async(req, res)=>{

    res.send('Applications is Up and Running')
})


    app.use('/api/v1/users', userRouter)
}

module.exports = RegisterRoute