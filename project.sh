#!/usr/bin/env bash
set -e

APP="school-facility-portal"

echo "Creating project: $APP"
mkdir -p "$APP"
cd "$APP"

mkdir -p client/src/{components,context,pages,services,styles}
mkdir -p server/src/{config,controllers,middleware,models,routes,utils,uploads}
mkdir -p docs

cat > .gitignore <<'EOF'
node_modules
dist
build
.env
uploads
.DS_Store
EOF

cat > README.md <<'EOF'
# School Facility Reporting Portal

A full-stack MERN app for parents, teachers, and admins to report and manage school facility issues.

## Features
- Authentication
- Role-based access
- Issue reporting
- Issue tracking
- Notifications
- Admin panel
- File upload
- Responsive frontend

## Run
- `npm run dev`
- `npm run seed`
EOF

cat > server/.env.example <<'EOF'
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
EOF

cat > client/.env.example <<'EOF'
VITE_API_URL=http://localhost:5000/api
EOF

cat > package.json <<'EOF'
{
  "name": "school-facility-portal",
  "private": true,
  "version": "1.0.0",
  "scripts": {
    "dev": "concurrently \"npm run dev --prefix server\" \"npm run dev --prefix client\"",
    "seed": "npm run seed --prefix server"
  },
  "devDependencies": {
    "concurrently": "^9.0.0"
  }
}
EOF

cd server
npm init -y >/dev/null 2>&1
npm install express mongoose cors dotenv bcryptjs jsonwebtoken multer nodemailer >/dev/null 2>&1
npm install -D nodemon >/dev/null 2>&1

cat > package.json <<'EOF'
{
  "name": "server",
  "version": "1.0.0",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "seed": "node src/seed.js"
  }
}
EOF

cat > src/index.js <<'EOF'
const app = require("./app");
const connectDB = require("./config/db");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
EOF

cat > src/config/db.js <<'EOF'
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
EOF

cat > src/app.js <<'EOF'
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.json({ message: "School Facility Portal API is running" });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/issues", require("./routes/issueRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/uploads", require("./routes/uploadRoutes"));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
EOF

cat > src/models/User.js <<'EOF'
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Parent", "Teacher", "Admin"], default: "Parent" },
  schoolId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
EOF

cat > src/models/Issue.js <<'EOF'
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
EOF

cat > src/models/Notification.js <<'EOF'
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  issueId: { type: mongoose.Schema.Types.ObjectId, ref: "Issue", required: true },
  message: { type: String, required: true },
  readStatus: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
EOF

cat > src/utils/generateToken.js <<'EOF'
const jwt = require("jsonwebtoken");

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

module.exports = generateToken;
EOF

cat > src/middleware/authMiddleware.js <<'EOF'
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }
  return res.status(401).json({ message: "Not authorized, no token" });
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "Admin") return next();
  return res.status(403).json({ message: "Admin access only" });
};

module.exports = { protect, adminOnly };
EOF

cat > src/middleware/errorMiddleware.js <<'EOF'
const multer = require("multer");

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: "File upload error", error: err.message });
  }
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack
  });
};

module.exports = { notFound, errorHandler };
EOF

cat > src/middleware/uploadMiddleware.js <<'EOF'
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, "_");
    cb(null, `${file.fieldname}-${Date.now()}-${base}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif/;
  const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = allowed.test(file.mimetype);
  if (extOk && mimeOk) cb(null, true);
  else cb(new Error("Only image files are allowed"), false);
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});
EOF

cat > src/controllers/authController.js <<'EOF'
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, schoolId } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name, email, password: hashedPassword, role, schoolId
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId,
      token: generateToken(user.id)
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId,
      token: generateToken(user.id)
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getMe = async (req, res) => res.json(req.user);

module.exports = { registerUser, loginUser, getMe };
EOF

cat > src/controllers/issueController.js <<'EOF'
const Issue = require("../models/Issue");
const Notification = require("../models/Notification");

const generateIssueId = () => `ISS-${Date.now()}`;

const createIssue = async (req, res) => {
  try {
    const { category, description, location, priority, images } = req.body;

    const issue = await Issue.create({
      issueId: generateIssueId(),
      userId: req.user.id,
      category,
      description,
      location,
      priority,
      images: images || [],
      timeline: [{ action: "Issue reported" }]
    });

    await Notification.create({
      userId: req.user.id,
      issueId: issue.id,
      message: `Your issue ${issue.issueId} has been submitted successfully.`
    });

    res.status(201).json(issue);
  } catch (error) {
    res.status(500).json({ message: "Failed to create issue", error: error.message });
  }
};

const getMyIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch issues", error: error.message });
  }
};

const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });
    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch issue", error: error.message });
  }
};

const updateIssueStatus = async (req, res) => {
  try {
    const { status, assignedTo, estimatedResolution, action } = req.body;
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    if (status) issue.status = status;
    if (assignedTo) issue.assignedTo = assignedTo;
    if (estimatedResolution) issue.estimatedResolution = estimatedResolution;
    if (action) issue.timeline.push({ action });

    await issue.save();

    await Notification.create({
      userId: issue.userId,
      issueId: issue.id,
      message: `Issue ${issue.issueId} status updated to ${issue.status}.`
    });

    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: "Failed to update issue", error: error.message });
  }
};

const getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find().populate("userId", "name email role schoolId").sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch issues", error: error.message });
  }
};

module.exports = { createIssue, getMyIssues, getIssueById, updateIssueStatus, getAllIssues };
EOF

cat > src/controllers/notificationController.js <<'EOF'
const Notification = require("../models/Notification");

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications", error: error.message });
  }
};

const markRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: "Notification not found" });
    notification.readStatus = true;
    await notification.save();
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: "Failed to update notification", error: error.message });
  }
};

module.exports = { getMyNotifications, markRead };
EOF

cat > src/controllers/uploadController.js <<'EOF'
const path = require("path");

const uploadImage = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.status(201).json({
    message: "File uploaded successfully",
    filename: req.file.filename,
    url: `/uploads/${req.file.filename}`
  });
};

module.exports = { uploadImage };
EOF

cat > src/routes/authRoutes.js <<'EOF'
const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);

module.exports = router;
EOF

cat > src/routes/issueRoutes.js <<'EOF'
const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { createIssue, getMyIssues, getIssueById, updateIssueStatus, getAllIssues } = require("../controllers/issueController");

router.post("/", protect, createIssue);
router.get("/my", protect, getMyIssues);
router.get("/", protect, adminOnly, getAllIssues);
router.get("/:id", protect, getIssueById);
router.put("/:id", protect, adminOnly, updateIssueStatus);

module.exports = router;
EOF

cat > src/routes/notificationRoutes.js <<'EOF'
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getMyNotifications, markRead } = require("../controllers/notificationController");

router.get("/", protect, getMyNotifications);
router.put("/:id/read", protect, markRead);

module.exports = router;
EOF

cat > src/routes/uploadRoutes.js <<'EOF'
const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { uploadImage } = require("../controllers/uploadController");

router.post("/", upload.single("file"), uploadImage);

module.exports = router;
EOF

cat > src/seed.js <<'EOF'
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
EOF

cd ../client
npm create vite@latest . -- --template react >/dev/null 2>&1
npm install axios react-router-dom >/dev/null 2>&1

cat > package.json <<'EOF'
{
  "name": "client",
  "private": true,
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
}
EOF

cat > src/main.jsx <<'EOF'
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
EOF

cat > src/services/api.js <<'EOF'
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});

api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    const token = JSON.parse(userInfo)?.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
EOF

cat > src/context/AuthContext.jsx <<'EOF'
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("userInfo");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (data) => {
    setUser(data);
    localStorage.setItem("userInfo", JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userInfo");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
EOF

cat > src/styles/global.css <<'EOF'
* { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; background: #f8fafc; color: #0f172a; }
a { color: #2563eb; text-decoration: none; }
button { cursor: pointer; border: none; background: #2563eb; color: white; padding: 10px 14px; border-radius: 8px; }
input, textarea, select { width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; margin-bottom: 12px; }
.card { background: white; border-radius: 12px; padding: 16px; box-shadow: 0 6px 18px rgba(15,23,42,.08); }
.grid { display: grid; gap: 16px; }
.grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.table-wrap { overflow-x: auto; }
.table { width: 100%; border-collapse: collapse; background: white; }
.table th, .table td { border-bottom: 1px solid #e2e8f0; padding: 12px; text-align: left; white-space: nowrap; }
.layout { display: grid; grid-template-columns: 220px 1fr; min-height: 100vh; }
.sidebar { background: #0f172a; color: white; padding: 18px; }
.sidebar a { color: white; display: block; padding: 10px 0; }
.content { padding: 20px; }
@media (max-width: 768px) { .layout { grid-template-columns: 1fr; } .grid-3 { grid-template-columns: 1fr; } }
EOF

cat > src/components/Navbar.jsx <<'EOF'
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <nav className="sidebar">
      <h2>Portal</h2>
      <Link to="/">Home</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/report">Report Issue</Link>
      <Link to="/tracking">Tracking</Link>
      <Link to="/notifications">Notifications</Link>
      <Link to="/admin">Admin</Link>
      <Link to="/register">Register</Link>
      <Link to="/login">Login</Link>
      <button onClick={logout} style={{ marginTop: 12, width: "100%" }}>Logout</button>
    </nav>
  );
}
EOF

cat > src/components/ProtectedRoute.jsx <<'EOF'
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
EOF

cat > src/components/StatCard.jsx <<'EOF'
export default function StatCard({ title, value, subtitle }) {
  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <div style={{ fontSize: 28, fontWeight: "bold" }}>{value}</div>
      <p>{subtitle}</p>
    </div>
  );
}
EOF

cat > src/components/LoadingSpinner.jsx <<'EOF'
export default function LoadingSpinner() {
  return <div style={{ padding: 20, textAlign: "center" }}>Loading...</div>;
}
EOF

cat > src/components/InputField.jsx <<'EOF'
export default function InputField({ label, error, ...props }) {
  return (
    <div>
      {label && <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>{label}</label>}
      <input aria-invalid={!!error} {...props} />
      {error && <div style={{ color: "#dc2626", fontSize: 13 }}>{error}</div>}
    </div>
  );
}
EOF

cat > src/components/TextAreaField.jsx <<'EOF'
export default function TextAreaField({ label, error, ...props }) {
  return (
    <div>
      {label && <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>{label}</label>}
      <textarea aria-invalid={!!error} rows="5" {...props} />
      {error && <div style={{ color: "#dc2626", fontSize: 13 }}>{error}</div>}
    </div>
  );
}
EOF

cat > src/pages/Home.jsx <<'EOF'
export default function Home() {
  return (
    <div className="card">
      <h1>School Facility Reporting Portal</h1>
      <p>Report broken furniture, damaged toilets, unsafe classrooms, sanitation issues, and electrical hazards.</p>
    </div>
  );
}
EOF

cat > src/pages/Login.jsx <<'EOF'
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import InputField from "../components/InputField";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = "Email is required";
    if (!password.trim()) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    const { data } = await api.post("/auth/login", { email, password });
    login(data);
    navigate("/dashboard");
  };

  return (
    <div className="card" style={{ maxWidth: 420, margin: "30px auto" }}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <InputField label="Email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
        <InputField label="Password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
        <button type="submit">Login</button>
      </form>
      <p>New user? <Link to="/register">Register</Link></p>
    </div>
  );
}
EOF

cat > src/pages/Register.jsx <<'EOF'
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import InputField from "../components/InputField";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Parent", schoolId: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.includes("@")) e.email = "Valid email required";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (!form.schoolId.trim()) e.schoolId = "School ID is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await api.post("/auth/register", form);
    navigate("/login");
  };

  return (
    <div className="card" style={{ maxWidth: 420, margin: "30px auto" }}>
      <h2>Register</h2>
      <form onSubmit={submit}>
        <InputField label="Name" name="name" value={form.name} onChange={change} error={errors.name} />
        <InputField label="Email" name="email" value={form.email} onChange={change} error={errors.email} />
        <InputField label="Password" name="password" type="password" value={form.password} onChange={change} error={errors.password} />
        <label>Role</label>
        <select name="role" value={form.role} onChange={change}>
          <option value="Parent">Parent</option>
          <option value="Teacher">Teacher</option>
          <option value="Admin">Admin</option>
        </select>
        <InputField label="School ID" name="schoolId" value={form.schoolId} onChange={change} error={errors.schoolId} />
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}
EOF

cat > src/pages/Dashboard.jsx <<'EOF'
import { useEffect, useState } from "react";
import api from "../services/api";
import StatCard from "../components/StatCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/issues/my")
      .then(({ data }) => setIssues(data))
      .catch(() => setIssues([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const pending = issues.filter((i) => i.status === "Pending").length;
  const resolved = issues.filter((i) => i.status === "Resolved").length;

  return (
    <div>
      <h2>Dashboard</h2>
      <div className="grid grid-3" style={{ marginBottom: 20 }}>
        <StatCard title="Total Issues" value={issues.length} subtitle="Reported by you" />
        <StatCard title="Pending" value={pending} subtitle="Awaiting action" />
        <StatCard title="Resolved" value={resolved} subtitle="Completed repairs" />
      </div>
      <div className="card">
        <p><Link to="/report">+ Report new issue</Link></p>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Issue ID</th>
                <th>Category</th>
                <th>Location</th>
                <th>Status</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr key={issue._id}>
                  <td>{issue.issueId}</td>
                  <td>{issue.category}</td>
                  <td>{issue.location}</td>
                  <td>{issue.status}</td>
                  <td>{issue.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
EOF

cat > src/pages/ReportIssue.jsx <<'EOF'
import { useState } from "react";
import api from "../services/api";
import InputField from "../components/InputField";
import TextAreaField from "../components/TextAreaField";

export default function ReportIssue() {
  const [form, setForm] = useState({ category: "", description: "", location: "", priority: "Medium", images: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.category.trim()) e.category = "Category is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.location.trim()) e.location = "Location is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = { ...form, images: form.images ? form.images.split(",").map((x) => x.trim()) : [] };
      await api.post("/issues", payload);
      alert("Issue submitted");
      setForm({ category: "", description: "", location: "", priority: "Medium", images: "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 640 }}>
      <h2>Report Issue</h2>
      <form onSubmit={submit}>
        <InputField label="Category" name="category" value={form.category} onChange={change} error={errors.category} />
        <TextAreaField label="Description" name="description" value={form.description} onChange={change} error={errors.description} />
        <InputField label="Location" name="location" value={form.location} onChange={change} error={errors.location} />
        <label>Priority</label>
        <select name="priority" value={form.priority} onChange={change}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
        <InputField label="Image URLs" name="images" value={form.images} onChange={change} />
        <button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit Issue"}</button>
      </form>
    </div>
  );
}
EOF

cat > src/pages/Tracking.jsx <<'EOF'
import { useState } from "react";
import api from "../services/api";

export default function Tracking() {
  const [issueId, setIssueId] = useState("");
  const [issue, setIssue] = useState(null);
  const [error, setError] = useState("");

  const search = async () => {
    setError("");
    setIssue(null);
    try {
      const { data } = await api.get(`/issues/${issueId}`);
      setIssue(data);
    } catch {
      setError("Issue not found");
    }
  };

  return (
    <div className="card">
      <h2>Issue Tracking</h2>
      <input value={issueId} onChange={(e) => setIssueId(e.target.value)} placeholder="Enter Issue ID or Mongo ID" />
      <button onClick={search}>Track</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {issue && (
        <div style={{ marginTop: 20 }}>
          <p><b>Issue ID:</b> {issue.issueId}</p>
          <p><b>Status:</b> {issue.status}</p>
          <p><b>Category:</b> {issue.category}</p>
          <p><b>Location:</b> {issue.location}</p>
          <p><b>Priority:</b> {issue.priority}</p>
          <p><b>Assigned To:</b> {issue.assignedTo || "Not assigned"}</p>
          <p><b>Estimated Resolution:</b> {issue.estimatedResolution || "Not updated"}</p>
        </div>
      )}
    </div>
  );
}
EOF

cat > src/pages/Notifications.jsx <<'EOF'
import { useEffect, useState } from "react";
import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/notifications")
      .then(({ data }) => setItems(data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="card">
      <h2>Notifications</h2>
      <ul>
        {items.map((n) => (
          <li key={n._id} style={{ marginBottom: 10 }}>
            {n.message} {n.readStatus ? "(Read)" : "(Unread)"}
          </li>
        ))}
      </ul>
    </div>
  );
}
EOF

cat > src/pages/AdminPanel.jsx <<'EOF'
import { useEffect, useState } from "react";
import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function AdminPanel() {
  const [issues, setIssues] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await api.get("/issues");
    setIssues(data);
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const update = async (id) => {
    await api.put(`/issues/${id}`, {
      status: statusMap[id] || "In Progress",
      assignedTo: "Maintenance Staff",
      estimatedResolution: "2 days",
      action: "Status updated by admin"
    });
    load();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2>Admin Panel</h2>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Issue ID</th>
              <th>Category</th>
              <th>Description</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue._id}>
                <td>{issue.issueId}</td>
                <td>{issue.category}</td>
                <td>{issue.description}</td>
                <td>
                  <select value={statusMap[issue._id] || issue.status} onChange={(e) => setStatusMap({ ...statusMap, [issue._id]: e.target.value })}>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </td>
                <td>{issue.priority}</td>
                <td><button onClick={() => update(issue._id)}>Save</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
EOF

cat > src/App.jsx <<'EOF'
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ReportIssue from "./pages/ReportIssue";
import Tracking from "./pages/Tracking";
import Notifications from "./pages/Notifications";
import AdminPanel from "./pages/AdminPanel";
import Navbar from "./components/Navbar";
import AuthProvider from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles/global.css";

export default function App() {
  return (
    <AuthProvider>
      <div className="layout">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/report" element={<ProtectedRoute><ReportIssue /></ProtectedRoute>} />
            <Route path="/tracking" element={<ProtectedRoute><Tracking /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}
EOF

cd ..
npm install -D concurrently >/dev/null 2>&1

cat > RUN.md <<'EOF'
# Run Instructions

## Install dependencies
- cd server && npm install
- cd client && npm install
- cd ..

## Run app
- npm run dev

## Seed data
- npm run seed
EOF

cat > FINAL_CHECKLIST.md <<'EOF'
# Final Checklist

- [x] Backend created
- [x] Frontend created
- [x] Auth system
- [x] Issue reporting
- [x] Tracking
- [x] Notifications
- [x] Admin panel
- [x] Upload support
- [x] Seed data
EOF

echo "========================================"
echo "Project created successfully."
echo "Next steps:"
echo "1. cd $APP"
echo "2. cp server/.env.example server/.env"
echo "3. cp client/.env.example client/.env"
echo "4. edit env values"
echo "5. npm run dev"
echo "========================================"