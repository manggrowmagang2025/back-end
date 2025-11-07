import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { askPlantAI } from "../services/aiProvider.js";
import Consultation from "../models/Consultation.js";
const r = Router();

r.post("/consult", requireAuth, async (req,res,next)=>{
  try{
    const { question } = req.body;
    const answer = await askPlantAI(question);
    const rec = await Consultation.create({ user:req.user.id, question, answer, model:process.env.AI_PROVIDER });
    res.json(rec);
  }catch(e){ next(e); }
});

export default r;
