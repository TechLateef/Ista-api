

const express = require('express')
const { login, logOut } = require('../controllers/Authorization')





const authRouter = express.Router()


authRouter.post('/login', login)
authRouter.get('/logout', logOut)

module.exports = authRouter