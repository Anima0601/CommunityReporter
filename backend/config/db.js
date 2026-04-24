import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "communityreporter",
  "postgres",
  "Srijan@1234",
  {
    host: "localhost",
    dialect: "postgres",
    logging: false,
  },
);

export const initDB = async () => {
  try {
    await sequelize.authenticate(); //validates connection to db
    console.log("database authenticated");
    await sequelize.sync({ alter: true }); //creates table using models
    console.log("Db synced");
  } catch (error) {
    console.log("DB Connection failed", error);
  }
};

export default sequelize;
