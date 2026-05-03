import { Report, User, Vote } from "../models/index.js";
// Create a new report
export const createReport = async (req, res) => {
  try {
    const newReport = await Report.create(req.body);
    res.status(201).json(newReport);
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({ error: "Failed to create report" });
  }
};

// Fetch all reports
export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.findAll();
    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
};
// Fetch a single report by ID
export const getReportById = async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);

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
    const { userId } = req.body; // TODO: Replace with req.user.id once Auth is added

    if (!userId) {
      return res.status(400).json({ error: "userId is required to vote" });
    }

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
