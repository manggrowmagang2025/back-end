import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { connectDb } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import plantRoutes from "./routes/plants.routes.js";
import productRoutes from "./routes/products.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import alertsRoutes from "./routes/alerts.routes.js";
import "./cron/schedule.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

app.get("/", (_,res)=>res.json({ok:true, name:"PlantCare API"}));
app.use("/api/auth", authRoutes);
app.use("/api/plants", plantRoutes);
app.use("/api/products", productRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/alerts", alertsRoutes);

// error handler sederhana
app.use((err, req, res, next)=>{
  console.error(err);
  res.status(err.status || 500).json({message: err.message || "Server error"});
});

const port = process.env.PORT || 8000;

const start = async ()=>{
  await connectDb();
  app.listen(port, ()=>console.log("API running on", port));
};

start();
