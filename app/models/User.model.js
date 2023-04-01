const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const UserSchema = mongoose.Schema({
    fullName:{
        type:String
    },
    status:{
        type:String,
        enum:['pending', 'activated']
    },
    email:{
        type:String,
        required:[true, 'Email is required'],
        match:[
        /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
        'Enter a Valid Email Address',
      ],
      unique:[true, "Email address already taken"]
    },
    phone:{
        type:String,
        required:[true, 'Please provide phone']
    },
    password:String,
    passwordChangeAt:Date,
    resetTokenExpireAt:Date,
    passwordResetToken:String
},
{
    timestamp:true,
    discriminatorKey:'_kind',
    toJOSN:{virtuals:true},
    toObject:{vituals:true}
})

//Hooks this will hash the user password before its save in db
UserSchema.pre('save', async function(next){
if(!this.isModified('password')){
    next()
}
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt) 
    this.passwordChangeAt =  Date.now() - 1000
    next()
})



//create json token
UserSchema.methods.createJWT = function(){
    return jwt.sign({
        userId:this._id, name:this.name, iat:Date.now() +1000
    }, process.env.jwtSecret, {
        expiresIn:Date.now() +15 * 60 *1000
    })
}

//this generate token for reset password
UserSchema.methods.getResetPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex')

    this.passwordResetToken = crypto.createHash('Sha256')
    .update(resetToken)
    .digest('hex')
    this.resetTokenExpireAt = Date.now() + 15 *60 * 1000
    return resetToken
}


//this method is for comparing user entered password 
UserSchema.methods.comparePassword = async function(userPassword){

    const Match = await bcrypt.compare(userPassword, this.password)
return Match
}

module.exports = mongoose.model('Admin', UserSchema)