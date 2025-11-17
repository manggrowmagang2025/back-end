import { DataTypes } from "sequelize";
import bcrypt from "bcryptjs";
import { sequelize } from "../config/db.js";

const User = sequelize.define("User",{
  id:{ type:DataTypes.INTEGER, autoIncrement:true, primaryKey:true },
  name:{ type:DataTypes.STRING, allowNull:false },
  email:{ type:DataTypes.STRING, allowNull:false, unique:true },
  password:{ type:DataTypes.STRING, allowNull:false },
  role:{ type:DataTypes.ENUM("member","admin"), defaultValue:"member" }
});

User.addHook("beforeCreate", async (user)=>{
  if(user.password){
    user.password = await bcrypt.hash(user.password, 10);
  }
});

User.addHook("beforeUpdate", async (user)=>{
  if(user.changed("password")){
    user.password = await bcrypt.hash(user.password, 10);
  }
});

User.prototype.comparePassword = function(pw){
  return bcrypt.compare(pw, this.password);
};

export default User;
