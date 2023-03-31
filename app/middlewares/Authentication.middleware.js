const UnAuthenticate = require("../errors/UnAuthenticate.error")
const jwt = require('jsonwebtoken')
const UserModel = require("../models/User.model")
const catchAsync = require('../utils/catchAsync')


exports.AuthenticationMiddlware = catchAsync(async(req, res, next)=>{
    if(req.user?._id) return next()

    const authHeader = req.headers.authorization
    let token 
    if(authHeader && authHeader.startWith('Bearer')){
        token = authHeader.split(' ')[1]
    }else if(req.cookies?.jwt){
        token = req.cookies.jwt
    }
    if(!token){
        return next(
            new UnAuthenticate('You are not logged in, please login o gain access')
        )
    }
    try{
        const decoded = jwt.verify(token,process.env.jwtSecret)
        const {UserId, iat} = decoded
        //verify if user still exist
        const user = await UserModel.findById(UserId)
        if(!user){
            return next(
                new UnAuthenticate('The user with this token no longer logedin')
            )
        }
    }catch (ex){
        throw new UnAuthenticate('Not Authorized')

    }
})

exports.restrictRouteTo = (...kinds) =>{
    return(req, res, next)=>{
        if(!req.user)
        return next(new UnAuthenticate('Please login to access this route'))
    if(!kinds.includes(req.user._kind)){
        return next(
            new UnAuthenticate('You are not allowed to perform this action')
        )
    }
    next()
    }
}