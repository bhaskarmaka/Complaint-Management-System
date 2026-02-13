const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  priority: String,
  status: {
    type: String,
    default: "Open"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  assignedAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  resolvedAt: Date   // ✅ MUST EXIST
}, { timestamps: true });  // ✅ createdAt automatically added

module.exports = mongoose.model("Complaint", complaintSchema);
