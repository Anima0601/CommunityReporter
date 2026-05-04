import express from "express";
import {
  createReport,
  getAllReports,
  updateReportStatus,
  getReportById,
  toggleUpvote,
  deleteReport
} from "../controllers/reportController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.post("/", protect, upload.single("image"), createReport);
router.get("/", getAllReports);

// New routes for specific IDs
router.get("/:id", getReportById);
router.delete("/:id", protect, deleteReport);

// The upvote route
router.post("/:id/upvote", protect, toggleUpvote);

export default router;
