import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Report = sequelize.define(
  "Report",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    category: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    address: DataTypes.STRING,

    status: {
      type: DataTypes.ENUM("pending", "active", "completed"),
      defaultValue: "pending",
    },
  },
  {
    timestamps: true,
  },
);

export default Report;
