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
    passwordChangedAt: Date
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

const User = mongoose.model('User', userSchema);
module.exports=User;