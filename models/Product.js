import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import User from "./User.js";

const Product = sequelize.define("Product",{
  id:{ type:DataTypes.INTEGER, autoIncrement:true, primaryKey:true },
  category:{ type:DataTypes.STRING, allowNull:false },
  product_name:{ type:DataTypes.STRING, allowNull:false },
  description:{ type:DataTypes.TEXT },
  price_range:{ type:DataTypes.STRING },
  product_link:{ type:DataTypes.STRING },
  image_url:{ type:DataTypes.STRING },
  rating:{ type:DataTypes.FLOAT },
  created_by:{ type:DataTypes.INTEGER }
});

Product.belongsTo(User,{ foreignKey:"created_by", as:"creator" });

export default Product;
