import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
const r = Router();

r.post("/register", async (req,res,next)=>{
  try{
    const {name,email,password,role="member"} = req.body;
    const user = await User.create({name,email,password,role});
    const token = jwt.sign({id:user._id, role:user.role, email}, process.env.JWT_SECRET, {expiresIn:"7d"});
    res.json({token, user:{id:user._id, name, email, role:user.role}});
  }catch(e){ next(e); }
});

r.post("/login", async (req,res,next)=>{
  try{
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(!user || !(await user.compare(password))) return res.status(401).json({message:"Email/password salah"});
    const token = jwt.sign({id:user._id, role:user.role, email}, process.env.JWT_SECRET, {expiresIn:"7d"});
    res.json({token, user:{id:user._id, name:user.name, email, role:user.role}});
  }catch(e){ next(e); }
});

export default r;
