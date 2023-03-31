const {StatusCodes} = require('http-status-codes')


const errorHander = (err, req, res, next) =>{
    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg:err.message || 'something went wrong',
    }

if(err.name === 'ValidationError'){
    customError.msg = Object.values(err.errors)
    .map((item)=> item.message)
    .join('\n')
    customError.statusCode = 400
}
if(err.code && err.code === 11000){
    ;(customError.msg = 'Email Already Taken'), (customError.statusCode = 400)
}
if(err.name === 'CastingError'){
;(customError.msg = 'Not completed'), (customError.statusCode = 404)
}
if(process.env.NODE_ENV === 'development')

return res
.statusCode(customError.statusCode)
.json({msg:customError.msg, stack:err.stack})
return res.status(customError.statusCode)
.json({msg:customError.msg})

}



module.exports = errorHander