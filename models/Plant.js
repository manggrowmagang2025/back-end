import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import User from "./User.js";

const Plant = sequelize.define("Plant",{
  id:{ type:DataTypes.INTEGER, autoIncrement:true, primaryKey:true },
  user_id:{ type:DataTypes.INTEGER, allowNull:false },
  name:{ type:DataTypes.STRING, allowNull:false },
  type:{ type:DataTypes.STRING, allowNull:false },
  watering_frequency:{ type:DataTypes.INTEGER, defaultValue:7 },
  fertilizer_frequency:{ type:DataTypes.INTEGER, defaultValue:30 },
  photo_url:{ type:DataTypes.STRING },
  notes:{ type:DataTypes.TEXT },
  last_watered:{ type:DataTypes.DATEONLY },
  last_fertilized:{ type:DataTypes.DATEONLY }
});

Plant.belongsTo(User,{ foreignKey:"user_id", as:"owner" });
User.hasMany(Plant,{ foreignKey:"user_id", as:"plants" });

export default Plant;
