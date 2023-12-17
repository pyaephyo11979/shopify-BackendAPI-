const Product = require('../models/productModel');
const { validationResult } = require('express-validator');
const fs = require('fs');
const getProducts=async(req,res)=>{
    try {
        const products=await Product.find()
        if(!products){
            return res.status(400).json({message:'No products found'})
        }else{
            return res.status(200).json({products})
        }
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
const getProduct=async(req,res)=>{
    try {
        const {id}=req.params
        const product=await Product.findById(id)
        if(!product){
            return res.status(400).json({message:'No product found'})
        }
        res.status(200).json({product})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
const createProduct=async(req,res)=>{
    try {
        const {title,description,price,image,instock,quantity,category}=req.body
        const product=new Product({
            title,
            description,
            price,
            image:{
                data:fs.readFileSync('public/images/'+req.file.filename),
                contentType:image.type
            },
            instock,
            quantity,
            category
        })
        await product.save()
        if(!product){
            return res.status(400).json({message:'Product not created'})
        }
        res.status(200).json({message:'Product created successfully'})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
const updateProduct=async(req,res)=>{
    try {
        const {id}=req.params
        const product=await Product.findByIDAndUpdate(id,req.body)
        if(!product){
            return res.status(400).json({message:'Product not found'})
        }
        res.status(200).json({message:'Product updated successfully'})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
const deleteProduct=async(req,res)=>{
    try {
        const {id}=req.params
        const product=await Product.findByIdAndDelete(id)
        if(!product){
            return res.status(400).json({message:'Product not found'})
        }
        res.status(200).json({message:'Product deleted successfully'})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
module.exports={
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
}
