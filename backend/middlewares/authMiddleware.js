import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

export const protect = async (req, res, next) => {
  let token;

  // 1. Read the token from the "jwt" cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      // 2. Verify the token using your secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Find the user in the database, excluding their password
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ["password"] },
      });

      next(); // Move on to the next function/controller
    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(401).json({ error: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ error: "Not authorized, no token provided" });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Not authorized as an admin" });
  }
};
