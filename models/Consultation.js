import mongoose from "mongoose";
const cSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref:"User" },
  question: String,
  answer: String,
  model: String
},{timestamps:true});
export default mongoose.model("Consultation", cSchema);
