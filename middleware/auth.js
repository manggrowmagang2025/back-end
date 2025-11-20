import jwt from "jsonwebtoken";
import { getJwtSecret } from "../utils/jwt.js";

export const requireAuth = (req,res,next)=>{
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if(!token) return res.status(401).json({message:"No token"});
  try{
    const payload = jwt.verify(token, getJwtSecret());
    req.user = payload;
    next();
  }catch(e){ return res.status(401).json({message:"Invalid token"}); }
};

export const requireRole = (...roles)=>(req,res,next)=>{
  if(!req.user || !roles.includes(req.user.role))
    return res.status(403).json({message:"Forbidden"});
  next();
};
