const { BadRequest, UnAuthenticated } = require('../errors')
const User = require('../models/User.model')
const {StatusCodes} = require('http-status-codes')


const createAndSendToken = (use, code , message, res)=>{
    const token = user.creatJWT()
res.cookies("jwt", token, {
    expires:new Date(
        Date.now() + process.env.JWT_COOKIES_EXPIRES_IN + 24 * 60 * 60 * 1000
    ),
    secure:process.env.NODE_ENV === "production",
    httpOnly:true
})
res.set('authorization', token)
res.status(code).json({status:code, message, token})
}


module.exports= createAndSendToken