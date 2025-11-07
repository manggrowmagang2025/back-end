import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import Plant from "../models/Plant.js";
const r = Router();

r.get("/due", requireAuth, async (req,res,next)=>{
  try{
    const now = new Date();
    const rows = await Plant.find({ owner:req.user.id });
    const due = rows.filter(p=>{
      const last = p.lastWateredAt ? new Date(p.lastWateredAt) : new Date(0);
      const next = new Date(last.getTime() + (p.careIntervalDays||3)*24*60*60*1000);
      return next <= now;
    });
    res.json(due);
  }catch(e){ next(e); }
});

export default r;
