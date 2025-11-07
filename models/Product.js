import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  external_url: String,
  stock: Number,
  tags: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref:"User" }
},{timestamps:true});
export default mongoose.model("Product", productSchema);
