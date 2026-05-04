import User from "./User.js";
import Report from "./Report.js";
import Comment from "./Comment.js";
import Vote from "./Vote.js";

/* ------------------ RELATIONSHIPS ------------------ */

// 🧑 User → Report (1 : Many)
User.hasMany(Report, { foreignKey: "userId", as: "reports" });
Report.belongsTo(User, { foreignKey: "userId", as: "author" });

// 🧑 User → Comment (1 : Many)
User.hasMany(Comment, { foreignKey: "userId", as: "comments" });
Comment.belongsTo(User, { foreignKey: "userId", as: "author" });

// 📄 Report → Comment (1 : Many)
Report.hasMany(Comment, { foreignKey: "reportId" });
Comment.belongsTo(Report, { foreignKey: "reportId" });

// 👍 Many-to-Many (User ↔ Report via Vote)
User.belongsToMany(Report, {
  through: Vote,
  as: "votedReports",
  foreignKey: "userId",
});
Report.belongsToMany(User, {
  through: Vote,
  as: "upvoters",
  foreignKey: "reportId",
});

/* Self Join (Comment replies) */

// One comment can have many replies
Comment.hasMany(Comment, {
  as: "replies",
  foreignKey: "parentId",
});

// A reply belongs to one parent comment
Comment.belongsTo(Comment, {
  as: "parent",
  foreignKey: "parentId",
});
export { User, Report, Comment, Vote };
