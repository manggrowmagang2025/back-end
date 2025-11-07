import mongoose from "mongoose";
const plantSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref:"User" },
  name: String,
  species: String,
  location: String,
  lastWateredAt: Date,
  moisture: Number,
  notes: String,
  careIntervalDays: { type:Number, default:3 }
},{timestamps:true});
export default mongoose.model("Plant", plantSchema);
