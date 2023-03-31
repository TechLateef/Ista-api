const express = require('express')
const {restrictRouteTo, AuthenticationMiddlware} = require('../middlewares/Authentication.middleware')
const {  getMe, DeleteUser,UpdateUser, updateMe } = require('../controllers/User.controller')
const {register} = require('../controllers/Authorization')
const User = require('../models/User.model')

const userRouter = express.Router()


userRouter.post('/register', register(User))

userRouter.use(AuthenticationMiddlware, restrictRouteTo('user'))

userRouter.route('/me').get(getMe).patch(updateMe)



userRouter.route('/:userID')

module.exports = userRouter