const express = require("express");
const Complaint = require("../models/Complaint");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/admin", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    // ==============================
    // TOTAL COMPLAINTS
    // ==============================
    const totalComplaints = await Complaint.countDocuments();

    // ==============================
    // BY CATEGORY
    // ==============================
    const byCategory = await Complaint.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    // ==============================
    // BY PRIORITY
    // ==============================
    const byPriority = await Complaint.aggregate([
      { $group: { _id: "$priority", count: { $sum: 1 } } }
    ]);

    // ==============================
    // BY STATUS
    // ==============================
    const byStatus = await Complaint.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // ==============================
    // AGENT PERFORMANCE
    // ==============================
    const agentPerformance = await Complaint.aggregate([
      { $match: { assignedAgent: { $ne: null } } },
      {
        $group: {
          _id: "$assignedAgent",
          totalAssigned: { $sum: 1 },
          resolved: {
            $sum: {
              $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0]
            }
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "agent"
        }
      },
      { $unwind: "$agent" },
      {
        $project: {
          _id: "$agent.name",
          totalAssigned: 1,
          resolved: 1
        }
      }
    ]);

    // ==============================
    // ⭐ AVERAGE RESOLUTION TIME
    // ==============================
    const resolvedComplaints = await Complaint.find({
      status: "Resolved",
      resolvedAt: { $exists: true }
    });

    let avgResolutionTime = 0;

    if (resolvedComplaints.length > 0) {
      const totalTime = resolvedComplaints.reduce((sum, complaint) => {
        const created = new Date(complaint.createdAt);
        const resolved = new Date(complaint.resolvedAt);
        return sum + (resolved - created);
      }, 0);

      // convert milliseconds → hours
      avgResolutionTime =
        totalTime / resolvedComplaints.length / (1000 * 60 * 60);
    }

    // ==============================
    // FINAL RESPONSE
    // ==============================
    res.json({
      totalComplaints,
      byCategory,
      byPriority,
      byStatus,
      agentPerformance,
      avgResolutionTime: avgResolutionTime || 0   // ✅ SAFE DEFAULT
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Analytics fetch failed" });
  }
});


module.exports = router;
