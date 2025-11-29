// src/routes/jobRoutes.js
const express = require("express");
const Job = require("../models/job");
const { auth, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// @route   POST /api/jobs
// @desc    Create a new job (recruiter only)
// @access  Private
router.post("/", auth, authorizeRoles("recruiter"), async (req, res) => {
  try {
    const { title, description, skillsRequired, location, jobType, deadline } =
      req.body;

    const job = await Job.create({
      title,
      description,
      skillsRequired,
      location,
      jobType,
      deadline,
      postedBy: req.user._id,
    });

    res.status(201).json({ message: "Job created", job });
  } catch (err) {
    console.error("Create job error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/jobs
// @desc    Get all approved jobs
// @access  Public
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find({ isApproved: true }).populate(
      "postedBy",
      "name email"
    );
    res.json({ jobs });
  } catch (err) {
    console.error("Get jobs error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PATCH /api/jobs/:id/approve
// @desc    Approve a job (admin only)
// @access  Private
router.patch(
  "/:id/approve",
  auth,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const job = await Job.findByIdAndUpdate(
        req.params.id,
        { isApproved: true },
        { new: true }
      );
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json({ message: "Job approved", job });
    } catch (err) {
      console.error("Approve job error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
