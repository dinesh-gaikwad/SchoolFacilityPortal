const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  issueId: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  priority: { type: String, enum: ["Low", "Medium", "High", "Critical"], default: "Medium" },
  status: { type: String, enum: ["Pending", "In Progress", "Resolved"], default: "Pending" },
  images: [String],
  assignedTo: { type: String, default: "" },
  estimatedResolution: { type: String, default: "" },
  timeline: [
    {
      action: String,
      date: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Issue", issueSchema);
