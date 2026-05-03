import express from "express";
import {
  createReport,
  getAllReports,
  updateReportStatus,
  getReportById,
  toggleUpvote,
} from "../controllers/reportController.js";

const router = express.Router();

router.post("/", createReport);
router.get("/", getAllReports);

// New routes for specific IDs
router.get("/:id", getReportById);
router.patch("/:id/status", updateReportStatus); // PATCH is best for partial updates

// The upvote route
router.post("/:id/upvote", toggleUpvote);

export default router;
