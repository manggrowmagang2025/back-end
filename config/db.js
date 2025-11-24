import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const {
  MYSQL_HOST = "localhost",
  MYSQL_PORT = "3306",
  MYSQL_USER = "root",
  MYSQL_PASSWORD = "",
  MYSQL_DATABASE = "manggrow"
} = process.env;

export const sequelize = new Sequelize(MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, {
  host: MYSQL_HOST,
  port: Number(MYSQL_PORT),
  dialect: "mysql",
  logging: false,
  define: {
    underscored: true
  }
});

export const connectDb = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("MySQL connected");
  } catch (err) {
    console.error("MySQL connection error", err);
    process.exit(1);
  }
};
