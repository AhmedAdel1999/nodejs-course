const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:[true,'Last name is required'],
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:[validator.isEmail,'Please enter a valid email']
        // validate:{
        //     validator:function(v){
        //         return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        //     },
        //     message:"Please enter a valid email"
        // }
    },
    password:{
        type:String,
        required:true,
    },
    token:{
        type:String,
    },
    role:{
        type:String,
        enum:['admin','user','manager'],
        default:'user'
    },
    avatar:{
        type:String,
        default:"uploads/profile.png"
    }
});

module.exports = mongoose.model("User",userSchema);