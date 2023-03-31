const path = require('path')

const cookiesParser = require('cookie-parser')
const helmet = require('helmet')
const xss = require('xss-clean')
const cors = require('cors')
const {urlencoded, json, raw, static} = require('express')



/**
 * @param {Express} app the express app
 */


const MiddlewareRegister = (app) =>{

//external libraries

//cross-origin resous sharing this prevent other server to make request to this server
app.use(cors())

app.use(cookiesParser())

app.use(xss())
app.use(urlencoded({extended:true}))

// app.use((req, res, next)=>{
//     if(req.originalUrl.startWith('/webhook')){
//         raw({type:'application/json'})(req, res, next)
//     }else{
//         json()(req, res, next)
//     }
// })
}
module.exports = MiddlewareRegister