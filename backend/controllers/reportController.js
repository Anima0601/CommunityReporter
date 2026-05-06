import { Op } from "sequelize";
import { Report, User, Vote, Comment } from "../models/index.js";

// Create a new report
export const createReport = async (req, res) => {
  try {
    const { title, description, category, latitude, longitude, address } =
      req.body;

    // Check if an image was uploaded via Cloudinary multer
    const imageUrl = req.file ? req.file.path : null;

    const newReport = await Report.create({
      title,
      description,
      category,
      latitude,
      longitude,
      address,
      imageUrl,
      userId: req.user.id, // From auth middleware
    });

    res.status(201).json(newReport);
  } catch (error) {
    console.error("Error creating report:", error.message);
    res.status(500).json({ error: "Failed to create report" });
  }
};

// Fetch all reports
export const getAllReports = async (req, res) => {
  try {
    const { category, status, search } = req.query;

    // Build query filter
    const whereClause = {};
    if (category) whereClause.category = category;
    if (status) whereClause.status = status;
    if (search) {
      whereClause.title = {
        [Op.iLike]: `%${search}%`,
      };
    }

    const reports = await Report.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "email"],
        },
        {
          model: Comment,
          include: [{ model: User, as: "author", attributes: ["name"] }],
          attributes: ["id", "text", "createdAt"],
        },
        {
          model: User,
          as: "upvoters",
          attributes: ["id"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
};

// Fetch a single report by ID
export const getReportById = async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "email"],
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              as: "author",
              attributes: ["id", "name"],
            },
            {
              model: Comment, // Nested replies
              as: "replies",
              include: [
                { model: User, as: "author", attributes: ["id", "name"] },
              ],
            },
          ],
          where: { parentId: null }, // Only top-level comments at root
          required: false, // Don't fail if no comments
        },
      ],
    });

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.status(200).json(report);
  } catch (error) {
    console.error("Error fetching report:", error);
    res.status(500).json({ error: "Failed to fetch report" });
  }
};

// Update the status of a report (Admin function)
export const updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const report = await Report.findByPk(req.params.id);

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    // Validate the status against your ENUM values
    const validStatuses = ["pending", "active", "completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    report.status = status;
    await report.save();

    res.status(200).json(report);
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Failed to update report status" });
  }
};

// Toggle an upvote for a report
export const toggleUpvote = async (req, res) => {
  try {
    const reportId = req.params.id;
    const userId = req.user.id; // From auth middleware

    // 1. Verify the report exists
    const report = await Report.findByPk(reportId);
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    // 2. Check if the user has already voted on this report
    const existingVote = await Vote.findOne({
      where: { reportId: reportId, userId: userId },
    });

    if (existingVote) {
      // 3a. If they already voted, remove the vote (Toggle OFF)
      await existingVote.destroy();
      return res.status(200).json({ message: "Upvote removed" });
    } else {
      // 3b. If they haven't voted, create a vote (Toggle ON)
      await Vote.create({ reportId: reportId, userId: userId });
      return res.status(201).json({ message: "Upvoted successfully" });
    }
  } catch (error) {
    console.error("Error toggling upvote:", error);
    res.status(500).json({ error: "Failed to process upvote" });
  }
};

// Delete a report
export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    // Check if user is the author or an admin
    if (report.userId !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this report" });
    }

    await report.destroy();
    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({ error: "Failed to delete report" });
  }
};
