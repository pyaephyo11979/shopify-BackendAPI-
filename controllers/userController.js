const User=require('../models/userModel')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const {SECRET}=process.env;
const {validationResult}=require('express-validator')
const register=async(req,res)=>{
    try {
        const {name,email,password,phone,gender,birthday,role}=req.body
        const hashedPassword=await bcrypt.hash(password,10)
        const emptyFields=[]
        if(!name){
            emptyFields.push('name')
        }
        if(!email){
            emptyFields.push('email')
        }
        if(!password){
            emptyFields.push('password')
        }
        if(!phone){
            emptyFields.push('phone')
        }
        if(!gender){
            emptyFields.push('gender')
        }
        if(!birthday){
            emptyFields.push('birthday')
        }
        if(!role){
            emptyFields.push('role')
        }
        if(emptyFields.length>0){
            return res.status(400).json({message:`please fill in the ${emptyFields} field`})
        }
        const user=new User({name,email,password:hashedPassword,phone,gender,birthday,role})
        await user.save()
        res.status(200).json({message:'user created successfully,please Login to continue'})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
const login=async(req,res)=>{
    try {
        const {email,password}=req.body
        const user=await User.findOne({email})
        if(!user){
            return res.status(404).json({message:'user not found'})
        }else{
            const isMatch=await bcrypt.compare(password,user.password)
            if(!isMatch){
                return res.status(401).json({message:'invalid credentials'})
            }else{
                const token=jwt.sign({id:user._id},SECRET)
                res.status(200).json({message:'login successful',token})
            }
        }
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
const getUsers=async(req,res)=>{
    try {
        const users=await User.find()
        res.status(200).json({users})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
const updateUser=async(req,res)=>{
    try {
        const {id}=req.params
        const user=await User.findByIDAndUpdate(id,req.body)
        if(!user){
            return res.status(404).json({message:'user not found'})
        }
        res.status(200).json({message:'user updated successfully'})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
const deleteUser=async(req,res)=>{
    try {
        const {id}=req.params
        const {password}=req.body
        const user=await User.findById(id)
        if(!user){
            return res.status(404).json({message:'user not found'})
        }else{
            const isMatch=await bcrypt.compare(password,user.password)
            if(!isMatch){
                return res.status(401).json({message:'invalid credentials'})
            }else{
                await User.findByIdAndDelete(id)
                res.status(200).json({message:'user deleted successfully'})
            }
        }
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
const changePassword=async(req,res)=>{
    const {id}=req.params
    const {oldPassword,newPassword,confirmPassword}=req.body
    const user=await User.findById(id)
    if(!user){
        return res.status(404).json({message:'user not found'})
    }else{
        const isMatch=await bcrypt.compare(oldPassword,user.password)
        if(!isMatch){
            return res.status(401).json({message:'invalid credentials'})
        }else{
            if(newPassword!==confirmPassword){
                return res.status(400).json({message:'passwords do not match'})
            }
            const hashedPassword=await bcrypt.hash(newPassword,10)
            await User.findByIdAndUpdate(id,{password:hashedPassword})
            res.status(200).json({message:'password changed successfully'})
        }
    }
}
module.exports={
    register,
    login,
    updateUser,
    deleteUser,
    getUsers,
    changePassword
}