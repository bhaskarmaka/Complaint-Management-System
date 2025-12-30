const express = require("express");
const Complaint = require("../models/Complaint");
const { classifyComplaint, predictPriority } = require("../controllers/aiLogic");
const authMiddleware = require("../middleware/authMiddleware");
const sendEmail = require("../utils/sendEmail");


const router = express.Router();

// CREATE complaint (protected)
router.post("/create", authMiddleware, async (req, res) => {
  const category = classifyComplaint(req.body.description);
  const priority = predictPriority(req.body.description);

  const complaint = new Complaint({
    title: req.body.title,
    description: req.body.description,
    category,
    priority,
    userId: req.user.id   // 🔥 link complaint to logged-in user
  });

  await complaint.save();
  res.json(complaint);
});

// GET complaints (only user's complaints)
router.get("/", authMiddleware, async (req, res) => {
  res.set("Cache-Control", "no-store"); // 🔥 disable cache

  const complaints = await Complaint.find({ userId: req.user.id });
  res.json(complaints);
});


const adminMiddleware = require("../middleware/adminMiddleware");

// ADMIN: get all complaints
router.get("/admin/all", authMiddleware, adminMiddleware, async (req, res) => {
  const complaints = await Complaint.find().populate("userId", "name email");
  res.json(complaints);
});


// ADMIN: update complaint status
router.put(
  "/admin/update-status/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const { status } = req.body;

    const complaint = await Complaint.findById(req.params.id).populate(
      "userId",
      "email name"
    );

    complaint.status = status;
    await complaint.save();

    // 🔥 SEND EMAIL
    sendEmail(
      complaint.userId.email,
      "Complaint Status Updated",
      `Hello ${complaint.userId.name},

Your complaint titled "${complaint.title}" is now marked as: ${status}.

Thank you,
Support Team`
    );

    res.json(complaint);
  }
);


// ADMIN: assign agent
router.put(
  "/admin/assign-agent/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const { agentId } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { assignedAgent: agentId },
      { new: true }
    );

    res.json(complaint);
  }
);

// AGENT: get assigned complaints
router.get(
  "/agent/my",
  authMiddleware,
  async (req, res) => {
    // Allow only agents
    if (req.user.role !== "agent") {
      return res.status(403).json("Agent access only");
    }

    const complaints = await Complaint.find({
      assignedAgent: req.user.id
    }).populate("userId", "name email");

    res.json(complaints);
  }
);

// AGENT: update status of assigned complaint
router.put(
  "/agent/update-status/:id",
  authMiddleware,
  async (req, res) => {
    if (req.user.role !== "agent") {
      return res.status(403).json("Agent access only");
    }

    const { status } = req.body;

    const complaint = await Complaint.findOne({
      _id: req.params.id,
      assignedAgent: req.user.id
    }).populate("userId", "email name");

    if (!complaint) {
      return res.status(403).json("Not authorized");
    }

    complaint.status = status;
    await complaint.save();

    // 🔥 SEND EMAIL
    sendEmail(
      complaint.userId.email,
      "Complaint Status Updated",
      `Hello ${complaint.userId.name},

Your complaint titled "${complaint.title}" is now marked as: ${status}.

Regards,
Support Agent`
    );

    res.json(complaint);
  }
);



module.exports = router;
