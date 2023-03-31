const notFound = require('../middlewares/Not-Found')
const errorHandler = require('../middlewares/error-handler')
/**
 * @param {Express} app express app
 */
const globalHandlerRegister = (app)=>{
app.use(notFound)
app.use(errorHandler)

} 

module.exports = globalHandlerRegister