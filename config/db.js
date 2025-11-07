import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGO_URI, {})
  .then(()=>console.log("Mongo connected"))
  .catch(e=>console.error("Mongo error", e));
