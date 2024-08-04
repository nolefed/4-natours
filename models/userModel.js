const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,'Please provide your name!']
    },
    email:{
        type:String,
        required: [true,'Please provide your email'],
        unique:true,
        lowercase:true,
        validator:[validator.isEmail]
    },
    photo:String,
    role:{
        type: String,
        enum: ['user','guide','lead-guide','admin'],
        default: 'user'
    },
    password:{
        type:String,
        required: [true,'Please provide a password'],
        minlength:8,
        select:false
    },
    passwordConfirm:{
        type:String,
        required: [true,'Please confirm your password'],
        validate:{
            // This only works on CREATE and SAVE !! 
            validator: function(el){
                return el === this.password;
            },
            message: 'Passwords are not the same'
        },
        select:false     
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
});

userSchema.pre('save',async function(next){
    // only run this function if the password was actually modified
    if(!this.isModified('password')) return next();
    // hash the password with the cost of 12
    this.password = await bcrypt.hash(this.password,12);
    //delete the password confirm field
    this.passwordConfirm=undefined;
    next();

});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword,userPassword);
};

userSchema.methods.changedPasswordAfter =  function (JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000,10);
        return JWTTimestamp < changedTimestamp;
    }
    
    // FALSE means not changed
    return false;
}

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken=crypto.createHash('sha256').update(resetToken).digest('hex');

    console.log({resetToken}, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10*60*1000;
    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports=User;