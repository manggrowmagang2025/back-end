import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const r = Router();

const signToken = (user)=>{
  return jwt.sign(
    { id:user.id, role:user.role, email:user.email, name:user.name },
    process.env.JWT_SECRET,
    { expiresIn:"7d" }
  );
};

const sanitizeUser = (user)=>({
  id:user.id,
  name:user.name,
  email:user.email,
  role:user.role
});

r.post("/register", async (req,res,next)=>{
  try{
    const {name,email,password,role="member"} = req.body;
    if(!name || !email || !password){
      return res.status(400).json({message:"Nama, email, dan password wajib diisi"});
    }
    const existing = await User.findOne({ where:{email} });
    if(existing) return res.status(409).json({message:"Email sudah terdaftar"});
    const user = await User.create({name,email,password,role});
    const token = signToken(user);
    res.json({token, user: sanitizeUser(user)});
  }catch(e){ next(e); }
});

r.post("/login", async (req,res,next)=>{
  try{
    const {email,password} = req.body;
    const user = await User.findOne({ where:{email} });
    if(!user || !(await user.comparePassword(password))){
      return res.status(401).json({message:"Email/password salah"});
    }
    const token = signToken(user);
    res.json({token, user: sanitizeUser(user)});
  }catch(e){ next(e); }
});

r.post("/logout", async (_req,res)=>{
  // JWT bersifat stateless, cukup minta FE menghapus token.
  res.json({ok:true});
});

r.get("/me", requireAuth, async (req,res,next)=>{
  try{
    const user = await User.findByPk(req.user.id);
    if(!user) return res.status(404).json({message:"User tidak ditemukan"});
    res.json({user: sanitizeUser(user)});
  }catch(e){ next(e); }
});

export default r;
