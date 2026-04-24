import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import "./models/index.js";
dotenv.config(); // make env variables accessible inside app

const app = express();
app.use(express.json()); //makes json file readable (using middleware)

await initDB();

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is Running at ${port}`);
});
