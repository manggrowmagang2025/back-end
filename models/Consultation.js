import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import User from "./User.js";

const Consultation = sequelize.define("Consultation",{
  id:{ type:DataTypes.INTEGER, autoIncrement:true, primaryKey:true },
  user_id:{ type:DataTypes.INTEGER, allowNull:false },
  question:{ type:DataTypes.TEXT, allowNull:false },
  answer:{ type:DataTypes.TEXT },
  model:{ type:DataTypes.STRING }
});

Consultation.belongsTo(User,{ foreignKey:"user_id", as:"user" });
User.hasMany(Consultation,{ foreignKey:"user_id", as:"consultations" });

export default Consultation;
