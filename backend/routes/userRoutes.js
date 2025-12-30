const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Get all agents
router.get("/agents", authMiddleware, adminMiddleware, async (req, res) => {
  const agents = await User.find({ role: "agent" }).select("name email");
  res.json(agents);
});

module.exports = router;
