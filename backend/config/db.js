import { Sequelize } from "sequelize";
import { configDotenv } from "dotenv";
configDotenv();
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "postgres",
    logging: false,
  },
);

export const initDB = async () => {
  try {
    await sequelize.authenticate(); //validates connection to dba
    console.log("database authenticated");
    await sequelize.sync({ alter: true }); //creates table using models
    console.log("Db synced");
  } catch (error) {
    console.log("DB Connection failed", error);
  }
};

export default sequelize;
