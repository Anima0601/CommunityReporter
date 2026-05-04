import express from "express";
import { getAllUsers, getAllReportsAdmin } from "../controllers/adminController.js";
import { updateReportStatus } from "../controllers/reportController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes in this file are protected and require admin privileges
router.use(protect, admin);

router.get("/users", getAllUsers);
router.get("/reports", getAllReportsAdmin);
router.patch("/reports/:id/status", updateReportStatus);

export default router;
