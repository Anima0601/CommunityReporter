import { Comment, Report, User } from "../models/index.js";

// @desc    Add a comment to a report
// @route   POST /api/comments
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { reportId, text, parentId } = req.body;
    const userId = req.user.id;

    if (!reportId || !text) {
      return res.status(400).json({ error: "Report ID and text are required" });
    }

    // Verify report exists
    const report = await Report.findByPk(reportId);
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    // If it's a reply, verify parent comment exists and belongs to the same report
    if (parentId) {
      const parentComment = await Comment.findByPk(parentId);
      if (!parentComment) {
        return res.status(404).json({ error: "Parent comment not found" });
      }
      if (parentComment.reportId !== reportId) {
        return res.status(400).json({ error: "Parent comment belongs to a different report" });
      }
    }

    const comment = await Comment.create({
      text,
      reportId,
      userId,
      parentId: parentId || null,
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Failed to add comment" });
  }
};
