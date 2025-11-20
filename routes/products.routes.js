import { Router } from "express";
import Product from "../models/Product.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const r = Router();
const uploadRoot = path.join(process.cwd(), "uploads", "products");
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

// public list (untuk katalog yang link ke marketplace)
r.get("/", async (_req,res,next)=>{
  try{
    const items = await Product.findAll({ order:[["rating","DESC"]] });
    res.json(items);
  }catch(e){ next(e); }
});

// admin CRUD
r.use(requireAuth, requireRole("admin"));

r.post("/upload-image", (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) return next(err);
    if (!req.file) {
      return res.status(400).json({ message: "File gambar diperlukan" });
    }
    const relativePath = `/uploads/products/${req.file.filename}`;
    res.json({ url: relativePath });
  });
});

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
