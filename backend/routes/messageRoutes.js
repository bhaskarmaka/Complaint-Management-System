const express = require("express");
const Message = require("../models/Message");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * GET messages for a complaint
 */
router.get("/:complaintId", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({
      complaintId: req.params.complaintId
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json("Failed to load messages");
  }
});

/**
 * POST new message (USER + AGENT allowed)
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { complaintId, text } = req.body;

    if (!text || !complaintId) {
      return res.status(400).json("Invalid message");
    }

    const message = new Message({
      complaintId,
      text,
      senderRole: req.user.role,   // 🔥 FROM TOKEN
      senderName: req.user.name    // 🔥 FROM TOKEN
    });

    await message.save();

    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json("Message save failed");
  }
});

module.exports = router;
