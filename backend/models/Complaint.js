const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  priority: String,
  status: { type: String, default: "Open" },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  assignedAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Complaint", ComplaintSchema);
