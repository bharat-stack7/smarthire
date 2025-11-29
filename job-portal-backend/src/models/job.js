// src/models/Job.js
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    skillsRequired: [
      {
        type: String,
        trim: true,
      },
    ],
    location: String,
    jobType: {
      type: String,
      enum: ["internship", "full-time"],
      default: "internship",
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // recruiter
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false, // admin will approve
    },
    deadline: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
