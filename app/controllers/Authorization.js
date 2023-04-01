const User = require('../models/User.model')
const {createAndSendToken}= require('../services/Auth.service')
const catchAsync = require('../utils/catchAsync')
const {StatusCodes} = require('http-status-codes')
const {BadRequest, UnAuthenticated, InternalServerError, NotFound} = require('../errors')
const register = (Model) => 
    catchAsync(async(req, res)=>{
        if(!req.body) {
            throw new BadRequest('please enter the field')
        }
const user = await Model.findOne({email:req.body.email})

  if(user) throw new BadRequest('User already exist')
const newUser = await Model.create({...req.body})
createAndSendToken(newUser, StatusCodes.CREATED, 'Registered successful', res)

    })



const login = catchAsync(async(req, res)=>{
    const {email, password} = req.body
    if(!email || !password){
        throw new BadRequest('entail email and password')
    }
    const user = await User.findOne({email}).select('+password')
    if(!user){
        throw new UnAuthenticated('Invalid credential')
    }else if(user && user.status === 'pending'){
        throw new UnAuthenticated('Please verify your account to login')
    }
    const isPassword = await user.comparePassword(password)
    if(!isPassword){
        throw new UnAuthenticated('Invalide Credential')
    }
    createAndSendToken(user, StatusCodes.OK, 'Login successful', res)
})


const logOut = catchAsync(async(req, res)=>{
    res.cookie('jwt','Log Out user',{
        expire:new Date(Date.now() + 10 *60 *1000)
    })
    res.status(StatusCodes.OK).json({msg:'User as been loged out'})
})



const resetPassword = catchAsync(async(req, res)=>{
    const {oldPassword, password} = req.body
    if(!oldPassword || !password){
        throw new BadRequest('Plesae provide oldPassword and password')
    }

    const user = await User.findById(req.user._id).select('+password')
    const passCorrect = await user.comparePassword(oldPassword)
    if(!passCorrect){
        throw new UnAuthenticated('Invalid Credential')
    }
    user.password = password
    await user.save()
    createAndSendToken(user, StatusCodes.OK, 'Password Updated', res)
})

// const resetPassword = catchAsync(async(req, res)=>{
//     const hashedToken = crypto
//     .createHash('sha256')
//     .update(req.params.token)
//     .digest('hex')
//     const user = await User.findOne({
//         passwordResetToken:hashedToken,
//         resetTokenExpreAt
//     })
// })


module.exports = {
    register,
    login,
    logOut,
    resetPassword
    
}