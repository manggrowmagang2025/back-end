import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import Plant from "../models/Plant.js";

const r = Router();

r.get("/due", requireAuth, async (req,res,next)=>{
  try{
    const now = new Date();
    const rows = await Plant.findAll({ where:{ user_id:req.user.id } });
    const dayMs = 24*60*60*1000;
    const due = rows.filter(p=>{
      const lastWater = p.last_watered ? new Date(p.last_watered) : new Date(0);
      const nextWater = new Date(lastWater.getTime() + (p.watering_frequency || 3)*dayMs);
      return nextWater <= now;
    });
    res.json(due);
  }catch(e){ next(e); }
});

export default r;
