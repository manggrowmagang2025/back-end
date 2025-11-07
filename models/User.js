import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type:String, unique:true },
  password: String,
  role: { type:String, enum:["member","admin"], default:"member" }
},{timestamps:true});

userSchema.pre("save", async function(){
  if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password, 10);
  }
});

userSchema.methods.compare = function(pw){ return bcrypt.compare(pw, this.password); };

export default mongoose.model("User", userSchema);
