import dotenv from "dotenv";
dotenv.config(); // make env variables accessible inside app
import express from "express";
import { initDB } from "./config/db.js";
import "./models/index.js";
import reportRoutes from "./routes/reportRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
const app = express();
const port = process.env.PORT || 5000;

//Database connection

await initDB();

//Routes

app.use(express.json()); //makes json file readable (using middleware)
app.use(cookieParser()); //allows to update and read cookies
app.use("/api/reports", reportRoutes);
app.use("/api/users", userRoutes);

app.listen(port, () => {
  console.log(`Server is Running at ${port}`);
});
