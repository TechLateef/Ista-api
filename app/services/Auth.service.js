const { BadRequest, UnAuthenticated } = require('../errors')
const {StatusCodes} = require('http-status-codes')


class AuthService  {
    
    createAndSendToken = (user, code , message, res)=>{
    const token = user.createJWT()
res.cookie("jwt", token, {
    expire:new Date(
        Date.now() + process.env.JWT_COOKIES_EXPIRES_IN + 24 * 60 * 60 * 1000
    ),
    secure:process.env.NODE_ENV === "production",
    httpOnly:true
})
res.set('authorization', token)
res.status(code).json({status:code, message, token})
}
}

module.exports= new AuthService 