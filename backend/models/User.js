const mongoose = require('mongoose');
const bycrpt = require('bycrptjs');
const { profile } = require('node:console');

const UserSchema = new mongoose.Schema({
    username : {
        type : String,
        required : [true, 'please add a username'],
        unique : true,
        trim : true,
        minlength : [3, 'username must be atleast 3 characters'],
    },
    email : {
        type: String,
        required : [true, 'please add an email'],
        unique : true,
        trim : true ,
        lowercase : true,
        match : [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'please add a valid email address'
        ]

    },

    password: {
        type: String,
        required : true,
        minlength : [4, 'please add atleast 4 characters'],
        select : false
    },
    profile : {
        type : mongoose.Schema.Types.ObjectId,
        ref  : profile
    },
    createdAt: {
        type : Date,
        default : Date.now
    }

});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')){
        return next();
    }
    try {
        const salt = await bycrpt.genSalt(10);
        this.password = await bycrpt.hash(this.password, salt);
        return next();
    } catch(err){
        return next(err); 
    }
});

UserSchema.methods.matchPassword = async function(enteredPassword){
    return await bycrpt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User' , UserSchema);