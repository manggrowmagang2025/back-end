import { Router } from "express";
import Plant from "../models/Plant.js";
import { requireAuth } from "../middleware/auth.js";
const r = Router();

r.use(requireAuth);

r.get("/", async (req,res,next)=>{
  try{ const rows = await Plant.find({ owner:req.user.id }).sort("-updatedAt");
       res.json(rows); } catch(e){ next(e); }
});

r.post("/", async (req,res,next)=>{
  try{ const row = await Plant.create({...req.body, owner:req.user.id});
       res.status(201).json(row); } catch(e){ next(e); }
});

r.put("/:id", async (req,res,next)=>{
  try{ const row = await Plant.findOneAndUpdate({_id:req.params.id, owner:req.user.id}, req.body, {new:true});
       res.json(row); } catch(e){ next(e); }
});

r.delete("/:id", async (req,res,next)=>{
  try{ await Plant.deleteOne({_id:req.params.id, owner:req.user.id});
       res.json({ok:true}); } catch(e){ next(e); }
});

export default r;
