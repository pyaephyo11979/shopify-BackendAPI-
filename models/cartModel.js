const mongoose = require('mongoose');
const cartSchema=mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    products:[
        {
            productId:{
                type:String
            },
            quantity:{
                type:Number,
                default:1
            }
        }
    ],
    amount:{
        type:Number,
        default:0
    },
    status:{
        type:String,
        default:"pending"
    }
})
module.exports=mongoose.model('Cart',cartSchema);