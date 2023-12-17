const Product = require('../models/productModel');
const Cart=require('../models/cartModel');
const { validationResult } = require('express-validator');
const getCarts=async(req,res)=>{
    try {
        const carts=await Cart.find();
        if(!carts){
            return res.status(400).json({message:'No carts found'});
        }
        res.status(200).json({carts});
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
const getCart=async(req,res)=>{
    try {
        const {uid}=req.params;
        const cart=await Cart.findOne({userID:uid});
        if(!cart){
            return res.status(400).json({message:'No cart found'});
        }
        res.status(200).json({cart});
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}
const addToCart=async(req,res)=>{
    try{
        const {uid}=req.params;
        const product={
            productID:req.body.productID,
            quantity:req.body.quantity
        }
        const pdt=await Product.findById(product.productID);
        const price=pdt.price;
        const total=price*product.quantity;
        const products=[]
        products.push(product);
        let cart=await Cart.findOne({userID:uid});
        if(!cart){
            const newCart=new Cart({
                userID:uid,
                products:products,
                amount:total,
            })
            await newCart.save();
            return res.status(200).json({message:'Cart created'});
        }else{
            cart.products.push(product);
            cart.amount+=total;
            await cart.save();
            return res.status(200).json({message:'Cart updated'});
        }
    }catch(error){
        res.status(500).json({message:error.message})
    }
}
const deleteFromCart=async(req,res)=>{
    try {
        const {productID}=req.params
        const {uid}=req.params
        const cart=await Cart.findOne({userID:uid});
        if(!cart){
            return res.status(400).json({message:'No cart found'});
        }else{
            cart.products.pull(productID);
            await cart.save();
            return res.status(200).json({message:'Product deleted from cart'});
        }
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
const deleteCart=async(req,res)=>{
    try {
        const {uid}=req.params
        const cart=await Cart.findOne({userID:uid});
        if(!cart){
            return res.status(400).json({message:'No cart found'});
        }else{
            await cart.remove();
            return res.status(200).json({message:'Cart deleted'});
        }
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
module.exports={
    getCarts,
    getCart,
    addToCart,
    deleteFromCart,
    deleteCart
}