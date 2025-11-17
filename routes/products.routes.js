import { Router } from "express";
import Product from "../models/Product.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const r = Router();

// public list (untuk katalog yang link ke marketplace)
r.get("/", async (_req,res,next)=>{
  try{
    const items = await Product.findAll({ order:[["rating","DESC"]] });
    res.json(items);
  }catch(e){ next(e); }
});

// admin CRUD
r.use(requireAuth, requireRole("admin"));

r.post("/", async (req,res,next)=>{
  try{
    const payload = { ...req.body, created_by:req.user.id };
    const item = await Product.create(payload);
    res.status(201).json(item);
  }catch(e){ next(e); }
});

r.put("/:id", async (req,res,next)=>{
  try{
    const item = await Product.findByPk(req.params.id);
    if(!item) return res.status(404).json({message:"Produk tidak ditemukan"});
    await item.update(req.body);
    res.json(item);
  }catch(e){ next(e); }
});

r.delete("/:id", async (req,res,next)=>{
  try{
    const deleted = await Product.destroy({ where:{ id:req.params.id } });
    if(!deleted) return res.status(404).json({message:"Produk tidak ditemukan"});
    res.json({ok:true});
  }catch(e){ next(e); }
});

export default r;
