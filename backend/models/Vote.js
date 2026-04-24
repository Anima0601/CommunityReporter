import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Vote = sequelize.define(
  "Vote",
  {},
  {
    timestamps: true,
  },
);

export default Vote;
