require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Issue = require("./models/Issue");
const Notification = require("./models/Notification");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await User.deleteMany();
    await Issue.deleteMany();
    await Notification.deleteMany();

    const password = await bcrypt.hash("password123", 10);

    const users = await User.insertMany([
      { name: "Admin User", email: "admin@school.com", password, role: "Admin", schoolId: "SCH-001" },
      { name: "Parent User", email: "parent@school.com", password, role: "Parent", schoolId: "SCH-001" },
      { name: "Teacher User", email: "teacher@school.com", password, role: "Teacher", schoolId: "SCH-001" }
    ]);

    const issues = await Issue.insertMany([
      {
        issueId: "ISS-1001",
        userId: users[1]._id,
        category: "Toilet Damage",
        description: "Broken tap and poor sanitation in boys' toilet.",
        location: "Block A - Ground Floor",
        priority: "High",
        status: "Pending",
        timeline: [{ action: "Issue reported" }]
      },
      {
        issueId: "ISS-1002",
        userId: users[2]._id,
        category: "Electrical Hazard",
        description: "Loose wire near classroom projector area.",
        location: "Classroom 4",
        priority: "Critical",
        status: "In Progress",
        assignedTo: "Electrician Team",
        estimatedResolution: "1 day",
        timeline: [{ action: "Issue reported" }, { action: "Assigned to electrician team" }]
      }
    ]);

    await Notification.insertMany([
      {
        userId: users[1]._id,
        issueId: issues[0]._id,
        message: "Your toilet damage issue has been received."
      },
      {
        userId: users[2]._id,
        issueId: issues[1]._id,
        message: "Your electrical hazard issue is now in progress."
      }
    ]);

    console.log("Seed data inserted successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
