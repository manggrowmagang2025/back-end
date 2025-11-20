import { Router } from "express";
import Plant from "../models/Plant.js";
import { requireAuth } from "../middleware/auth.js";
import multer from "multer";
import path from "path";
import fs from "fs";
const r = Router();

const uploadRoot = path.join(process.cwd(), "uploads", "plants");
fs.mkdirSync(uploadRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadRoot),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, "-");
    cb(null, `${Date.now()}-${base}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) return cb(null, true);
    cb(new Error("Tipe file harus berupa gambar"));
  }
});

r.use(requireAuth);

r.post("/upload-photo", (req, res, next) => {
  upload.single("photo")(req, res, (err) => {
    if (err) return next(err);
    if (!req.file) {
      return res.status(400).json({ message: "File gambar diperlukan" });
    }
    const relativePath = `/uploads/plants/${req.file.filename}`;
    res.json({ url: relativePath });
  });
});

r.get("/", async (req,res,next)=>{
  try{
    const rows = await Plant.findAll({
      where:{ user_id:req.user.id },
      order:[["updated_at","DESC"]]
    });
    res.json(rows);
  }catch(e){ next(e); }
});

r.post("/", async (req,res,next)=>{
  try{
    const payload = {
      user_id: req.user.id,
      name: req.body.name,
      type: req.body.type,
      watering_frequency: req.body.watering_frequency ?? 7,
      fertilizer_frequency: req.body.fertilizer_frequency ?? 30,
      photo_url: req.body.photo_url,
      notes: req.body.notes,
      last_watered: req.body.last_watered,
      last_fertilized: req.body.last_fertilized
    };
    const row = await Plant.create(payload);
    res.status(201).json(row);
  }catch(e){ next(e); }
});

r.put("/:id", async (req,res,next)=>{
  try{
    const plant = await Plant.findOne({
      where:{ id:req.params.id, user_id:req.user.id }
    });
    if(!plant) return res.status(404).json({message:"Tanaman tidak ditemukan"});
    await plant.update({
      name: req.body.name ?? plant.name,
      type: req.body.type ?? plant.type,
      watering_frequency: req.body.watering_frequency ?? plant.watering_frequency,
      fertilizer_frequency: req.body.fertilizer_frequency ?? plant.fertilizer_frequency,
      photo_url: req.body.photo_url ?? plant.photo_url,
      notes: req.body.notes ?? plant.notes,
      last_watered: req.body.last_watered ?? plant.last_watered,
      last_fertilized: req.body.last_fertilized ?? plant.last_fertilized
    });
    res.json(plant);
  }catch(e){ next(e); }
});

r.delete("/:id", async (req,res,next)=>{
  try{
    const deleted = await Plant.destroy({
      where:{ id:req.params.id, user_id:req.user.id }
    });
    if(!deleted) return res.status(404).json({message:"Tanaman tidak ditemukan"});
    res.json({ok:true});
  }catch(e){ next(e); }
});

export default r;
