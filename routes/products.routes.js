import { Router } from "express";
import Product from "../models/Product.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
const r = Router();

// public list (untuk katalog yang link ke Shopee/POS)
r.get("/", async (_,res,next)=>{
  try{ res.json(await Product.find().sort("-createdAt")); } catch(e){ next(e); }
});

// admin CRUD
r.use(requireAuth, requireRole("admin"));
r.post("/", async (req,res,next)=>{ try{
  res.status(201).json(await Product.create({...req.body, createdBy:req.user.id}));
}catch(e){ next(e); }});
r.put("/:id", async (req,res,next)=>{ try{
  res.json(await Product.findByIdAndUpdate(req.params.id, req.body, {new:true}));
}catch(e){ next(e); }});
r.delete("/:id", async (req,res,next)=>{ try{
  await Product.findByIdAndDelete(req.params.id); res.json({ok:true});
}catch(e){ next(e); }});

export default r;
