import { User, Report } from "../models/index.js";

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// @desc    Get all reports (admin overview)
// @route   GET /api/admin/reports
// @access  Private/Admin
export const getAllReportsAdmin = async (req, res) => {
  try {
    const reports = await Report.findAll({
      include: [
        { model: User, as: "author", attributes: ["id", "name", "email"] }
      ],
      order: [["createdAt", "DESC"]]
    });
    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching admin reports:", error);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
};
