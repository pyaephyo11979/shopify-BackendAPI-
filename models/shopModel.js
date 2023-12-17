const mongoose = require('mongoose');
const shopSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    user:{
        type:String,
        required:true
    }
})