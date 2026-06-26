#!/usr/bin/env bash
set -e

PROJECT="school-facility-portal"

echo "=================================================="
echo "School Facility Reporting Portal - PART 1"
echo "Creating base project structure..."
echo "=================================================="

mkdir -p "$PROJECT"
cd "$PROJECT"

mkdir -p client/src/{components,pages,context,services,assets}
mkdir -p client/public
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
EOF

cd server

if [ ! -f package.json ]; then
  npm init -y
fi

npm install express mongoose cors dotenv bcryptjs jsonwebtoken multer nodemailer
npm install -D nodemon

cat > src/index.js <<'EOF'
const app = require("./app");
const connectDB = require("./config/db");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
EOF

cat > src/app.js <<'EOF'
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "School Facility Portal API is running" });
});

module.exports = app;
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

cat > src/models/User.js <<'EOF'
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["Parent", "Teacher", "Admin"], default: "Parent" },
    schoolId: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
EOF

cat > src/models/Issue.js <<'EOF'
const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    issueId: { type: String, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    priority: { type: String, enum: ["Low", "Medium", "High", "Critical"], default: "Medium" },
    status: { type: String, enum: ["Pending", "In Progress", "Resolved"], default: "Pending" },
    images: [{ type: String }],
    estimatedResolution: { type: String, default: "" },
    assignedTo: { type: String, default: "" },
    timeline: [
      {
        action: String,
        date: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema);
EOF

cat > src/models/Notification.js <<'EOF'
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    issueId: { type: mongoose.Schema.Types.ObjectId, ref: "Issue", required: true },
    message: { type: String, required: true },
    readStatus: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
EOF

cat > .env <<'EOF'
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EOF

node - <<'EOF'
const fs = require("fs");
const p = JSON.parse(fs.readFileSync("package.json", "utf8"));
p.scripts = { start: "node src/index.js", dev: "nodemon src/index.js" };
fs.writeFileSync("package.json", JSON.stringify(p, null, 2));
EOF

cd ../client

if [ ! -f package.json ]; then
  npm create vite@latest . -- --template react
fi

npm install
npm install axios react-router-dom

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

cat > src/App.jsx <<'EOF'
import { Routes, Route, Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>School Facility Portal</h1>
      <p>Report and track school infrastructure issues.</p>
      <nav style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/report">Report Issue</Link>
        <Link to="/tracking">Tracking</Link>
        <Link to="/notifications">Notifications</Link>
        <Link to="/admin">Admin</Link>
      </nav>
    </div>
  );
}

const Placeholder = ({ title }) => (
  <div style={{ padding: "20px" }}>
    <h2>{title}</h2>
  </div>
);

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Placeholder title="Login Page" />} />
      <Route path="/dashboard" element={<Placeholder title="Dashboard" />} />
      <Route path="/report" element={<Placeholder title="Report Issue" />} />
      <Route path="/tracking" element={<Placeholder title="Issue Tracking" />} />
      <Route path="/notifications" element={<Placeholder title="Notifications" />} />
      <Route path="/admin" element={<Placeholder title="Admin Panel" />} />
    </Routes>
  );
}
EOF

cat > src/services/api.js <<'EOF'
import axios from "axios";
export default axios.create({ baseURL: "http://localhost:5000" });
EOF

cat > src/context/AuthContext.jsx <<'EOF'
import { createContext } from "react";
export default createContext();
EOF

echo "=================================================="
echo "Setup complete for PART 1."
echo "=================================================="
#!/usr/bin/env bash
set -e

PROJECT="school-facility-portal"
cd "$PROJECT/server"

mkdir -p src/{controllers,middleware,routes,utils}

cat > src/utils/generateToken.js <<'EOF'
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

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
      name,
      email,
      password: hashedPassword,
      role,
      schoolId
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId,
      token: generateToken(user._id)
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
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getMe = async (req, res) => {
  res.json(req.user);
};

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
      userId: req.user._id,
      category,
      description,
      location,
      priority,
      images: images || [],
      timeline: [{ action: "Issue reported" }]
    });

    await Notification.create({
      userId: req.user._id,
      issueId: issue._id,
      message: `Your issue ${issue.issueId} has been submitted successfully.`
    });

    res.status(201).json(issue);
  } catch (error) {
    res.status(500).json({ message: "Failed to create issue", error: error.message });
  }
};

const getMyIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ userId: req.user._id }).sort({ createdAt: -1 });
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
      issueId: issue._id,
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
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
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

cat > src/app.js <<'EOF'
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.json({ message: "School Facility Portal API is running" }));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/issues", require("./routes/issueRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

module.exports = app;
EOF

node - <<'EOF'
const fs = require("fs");
const p = JSON.parse(fs.readFileSync("package.json", "utf8"));
p.scripts = { start: "node src/index.js", dev: "nodemon src/index.js" };
fs.writeFileSync("package.json", JSON.stringify(p, null, 2));
EOF

echo "PART 2 complete"
#!/usr/bin/env bash
set -e

PROJECT="school-facility-portal"
cd "$PROJECT/client"

mkdir -p src/{components,pages,context,services,assets}

cat > src/services/api.js <<'EOF'
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api"
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
import { createContext, useState, useEffect } from "react";

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

cat > src/components/Navbar.jsx <<'EOF'
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <nav style={{ display: "flex", gap: "12px", padding: "12px", background: "#f3f4f6", flexWrap: "wrap" }}>
      <Link to="/">Home</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/report">Report Issue</Link>
      <Link to="/tracking">Tracking</Link>
      <Link to="/notifications">Notifications</Link>
      <Link to="/admin">Admin</Link>
      <Link to="/login">Login</Link>
      <button onClick={logout}>Logout</button>
    </nav>
  );
}
EOF

cat > src/pages/Home.jsx <<'EOF'
export default function Home() {
  return (
    <div style={{ padding: "24px" }}>
      <h1>School Facility Reporting Portal</h1>
      <p>Report broken furniture, damaged toilets, unsafe classrooms, sanitation issues, and electrical hazards.</p>
    </div>
  );
}
EOF

cat > src/pages/Login.jsx <<'EOF'
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const { data } = await api.post("/auth/login", { email, password });
    login(data);
    navigate("/dashboard");
  };

  return (
    <form onSubmit={submit} style={{ padding: "24px", maxWidth: "420px" }}>
      <h2>Login</h2>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />
      <button type="submit">Login</button>
    </form>
  );
}
EOF

cat > src/pages/Register.jsx <<'EOF'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Parent", schoolId: "" });
  const navigate = useNavigate();

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/auth/register", form);
    navigate("/login");
  };

  return (
    <form onSubmit={submit} style={{ padding: "24px", maxWidth: "420px" }}>
      <h2>Register</h2>
      <input name="name" placeholder="Name" value={form.name} onChange={change} style={{ width: "100%", marginBottom: "10px" }} />
      <input name="email" placeholder="Email" value={form.email} onChange={change} style={{ width: "100%", marginBottom: "10px" }} />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={change} style={{ width: "100%", marginBottom: "10px" }} />
      <select name="role" value={form.role} onChange={change} style={{ width: "100%", marginBottom: "10px" }}>
        <option value="Parent">Parent</option>
        <option value="Teacher">Teacher</option>
        <option value="Admin">Admin</option>
      </select>
      <input name="schoolId" placeholder="School ID" value={form.schoolId} onChange={change} style={{ width: "100%", marginBottom: "10px" }} />
      <button type="submit">Register</button>
    </form>
  );
}
EOF

cat > src/pages/Dashboard.jsx <<'EOF'
import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    api.get("/issues/my").then(({ data }) => setIssues(data)).catch(() => setIssues([]));
  }, []);

  return (
    <div style={{ padding: "24px" }}>
      <h2>Dashboard</h2>
      <p><Link to="/report">Report a new issue</Link></p>
      <ul>
        {issues.map((issue) => (
          <li key={issue._id}>
            {issue.issueId} - {issue.category} - {issue.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
EOF

cat > src/pages/ReportIssue.jsx <<'EOF'
import { useState } from "react";
import api from "../services/api";

export default function ReportIssue() {
  const [form, setForm] = useState({
    category: "",
    description: "",
    location: "",
    priority: "Medium",
    images: ""
  });

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form, images: form.images ? form.images.split(",").map((x) => x.trim()) : [] };
    await api.post("/issues", payload);
    alert("Issue submitted");
    setForm({ category: "", description: "", location: "", priority: "Medium", images: "" });
  };

  return (
    <form onSubmit={submit} style={{ padding: "24px", maxWidth: "520px" }}>
      <h2>Report Issue</h2>
      <input name="category" placeholder="Category" value={form.category} onChange={change} style={{ width: "100%", marginBottom: "10px" }} />
      <textarea name="description" placeholder="Description" value={form.description} onChange={change} style={{ width: "100%", marginBottom: "10px" }} />
      <input name="location" placeholder="Location" value={form.location} onChange={change} style={{ width: "100%", marginBottom: "10px" }} />
      <select name="priority" value={form.priority} onChange={change} style={{ width: "100%", marginBottom: "10px" }}>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
        <option value="Critical">Critical</option>
      </select>
      <input name="images" placeholder="Image URLs separated by comma" value={form.images} onChange={change} style={{ width: "100%", marginBottom: "10px" }} />
      <button type="submit">Submit Issue</button>
    </form>
  );
}
EOF

cat > src/pages/Tracking.jsx <<'EOF'
import { useState } from "react";
import api from "../services/api";

export default function Tracking() {
  const [issueId, setIssueId] = useState("");
  const [issue, setIssue] = useState(null);

  const search = async () => {
    const { data } = await api.get(`/issues/${issueId}`);
    setIssue(data);
  };

  return (
    <div style={{ padding: "24px" }}>
      <h2>Issue Tracking</h2>
      <input value={issueId} onChange={(e) => setIssueId(e.target.value)} placeholder="Enter Issue ID or Mongo ID" />
      <button onClick={search} style={{ marginLeft: "10px" }}>Track</button>

      {issue && (
        <div style={{ marginTop: "20px" }}>
          <p>Issue ID: {issue.issueId}</p>
          <p>Status: {issue.status}</p>
          <p>Category: {issue.category}</p>
          <p>Location: {issue.location}</p>
          <p>Priority: {issue.priority}</p>
          <p>Assigned To: {issue.assignedTo || "Not assigned"}</p>
          <p>Estimated Resolution: {issue.estimatedResolution || "Not updated"}</p>
          <h4>Timeline</h4>
          <ul>
            {issue.timeline?.map((t, i) => <li key={i}>{t.action}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
EOF

cat > src/pages/Notifications.jsx <<'EOF'
import { useEffect, useState } from "react";
import api from "../services/api";

export default function Notifications() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/notifications").then(({ data }) => setItems(data)).catch(() => setItems([]));
  }, []);

  return (
    <div style={{ padding: "24px" }}>
      <h2>Notifications</h2>
      <ul>
        {items.map((n) => (
          <li key={n._id}>{n.message} {n.readStatus ? "(Read)" : "(Unread)"}</li>
        ))}
      </ul>
    </div>
  );
}
EOF

cat > src/pages/AdminPanel.jsx <<'EOF'
import { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminPanel() {
  const [issues, setIssues] = useState([]);
  const [statusMap, setStatusMap] = useState({});

  const load = async () => {
    const { data } = await api.get("/issues");
    setIssues(data);
  };

  useEffect(() => { load(); }, []);

  const update = async (id) => {
    await api.put(`/issues/${id}`, {
      status: statusMap[id] || "In Progress",
      assignedTo: "Maintenance Staff",
      estimatedResolution: "2 days",
      action: "Status updated by admin"
    });
    load();
  };

  return (
    <div style={{ padding: "24px" }}>
      <h2>Admin Panel</h2>
      {issues.map((issue) => (
        <div key={issue._id} style={{ border: "1px solid #ccc", padding: "12px", marginBottom: "12px" }}>
          <p><b>{issue.issueId}</b> - {issue.category}</p>
          <p>{issue.description}</p>
          <p>Status: {issue.status}</p>
          <select value={statusMap[issue._id] || issue.status} onChange={(e) => setStatusMap({ ...statusMap, [issue._id]: e.target.value })}>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
          <button onClick={() => update(issue._id)} style={{ marginLeft: "10px" }}>Update</button>
        </div>
      ))}
    </div>
  );
}
EOF

cat > src/App.jsx <<'EOF'
import { Routes, Route, Link } from "react-router-dom";
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

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report" element={<ReportIssue />} />
        <Route path="/tracking" element={<Tracking />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </AuthProvider>
  );
}
EOF

echo "PART 3 complete"
#!/usr/bin/env bash
set -e

PROJECT="school-facility-portal"
cd "$PROJECT/client"

mkdir -p src/{components,pages,styles}

cat > src/styles/global.css <<'EOF'
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  background: #f8fafc;
  color: #0f172a;
}

a {
  color: #2563eb;
  text-decoration: none;
}

button {
  cursor: pointer;
  border: none;
  background: #2563eb;
  color: white;
  padding: 10px 14px;
  border-radius: 8px;
}

input, textarea, select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  outline: none;
  margin-bottom: 12px;
  font-size: 14px;
}

input:focus, textarea:focus, select:focus {
  border-color: #2563eb;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08);
}

.grid {
  display: grid;
  gap: 16px;
}

.grid-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.grid-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.table-wrap {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.table th, .table td {
  border-bottom: 1px solid #e2e8f0;
  padding: 12px;
  text-align: left;
  white-space: nowrap;
}

.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.badge.pending { background: #fef3c7; color: #92400e; }
.badge.progress { background: #dbeafe; color: #1d4ed8; }
.badge.resolved { background: #dcfce7; color: #166534; }
.badge.critical { background: #fee2e2; color: #991b1b; }

.sidebar {
  background: #0f172a;
  color: white;
  padding: 18px;
}

.sidebar a {
  color: white;
  display: block;
  padding: 10px 0;
}

.layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  min-height: 100vh;
}

.content {
  padding: 20px;
}

@media (max-width: 768px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .grid-2,
  .grid-3 {
    grid-template-columns: 1fr;
  }
}
EOF

cat > src/components/StatCard.jsx <<'EOF'
export default function StatCard({ title, value, subtitle }) {
  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <div style={{ fontSize: "28px", fontWeight: "bold" }}>{value}</div>
      <p style={{ marginBottom: 0, color: "#475569" }}>{subtitle}</p>
    </div>
  );
}
EOF

cat > src/components/InputField.jsx <<'EOF'
export default function InputField({ label, error, ...props }) {
  return (
    <div>
      {label && <label style={{ display: "block", marginBottom: "6px", fontWeight: 600 }}>{label}</label>}
      <input aria-invalid={!!error} aria-describedby={error ? `${props.name}-error` : undefined} {...props} />
      {error && (
        <div id={`${props.name}-error`} style={{ color: "#dc2626", fontSize: "13px", marginTop: "-6px", marginBottom: "10px" }}>
          {error}
        </div>
      )}
    </div>
  );
}
EOF

cat > src/components/TextAreaField.jsx <<'EOF'
export default function TextAreaField({ label, error, ...props }) {
  return (
    <div>
      {label && <label style={{ display: "block", marginBottom: "6px", fontWeight: 600 }}>{label}</label>}
      <textarea aria-invalid={!!error} aria-describedby={error ? `${props.name}-error` : undefined} rows="5" {...props} />
      {error && (
        <div id={`${props.name}-error`} style={{ color: "#dc2626", fontSize: "13px", marginTop: "-6px", marginBottom: "10px" }}>
          {error}
        </div>
      )}
    </div>
  );
}
EOF

cat > src/pages/Login.jsx <<'EOF'
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
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
      <p style={{ marginTop: 12 }}>
        New user? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
EOF

cat > src/pages/Register.jsx <<'EOF'
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
        <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>Role</label>
        <select name="role" value={form.role} onChange={change}>
          <option value="Parent">Parent</option>
          <option value="Teacher">Teacher</option>
          <option value="Admin">Admin</option>
        </select>
        <InputField label="School ID" name="schoolId" value={form.schoolId} onChange={change} error={errors.schoolId} />
        <button type="submit">Register</button>
      </form>
      <p style={{ marginTop: 12 }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
EOF

cat > src/pages/Dashboard.jsx <<'EOF'
import { useEffect, useState } from "react";
import api from "../services/api";
import StatCard from "../components/StatCard";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    api.get("/issues/my").then(({ data }) => setIssues(data)).catch(() => setIssues([]));
  }, []);

  const pending = issues.filter((i) => i.status === "Pending").length;
  const progress = issues.filter((i) => i.status === "In Progress").length;
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
  const [form, setForm] = useState({
    category: "",
    description: "",
    location: "",
    priority: "Medium",
    images: ""
  });
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
      const payload = {
        ...form,
        images: form.images ? form.images.split(",").map((x) => x.trim()) : []
      };
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
        <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>Priority</label>
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
          <h4>Timeline</h4>
          <ul>
            {issue.timeline?.map((t, i) => <li key={i}>{t.action}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
EOF

cat > src/pages/Notifications.jsx <<'EOF'
import { useEffect, useState } from "react";
import api from "../services/api";

export default function Notifications() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/notifications").then(({ data }) => setItems(data)).catch(() => setItems([]));
  }, []);

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

export default function AdminPanel() {
  const [issues, setIssues] = useState([]);
  const [statusMap, setStatusMap] = useState({});

  const load = async () => {
    const { data } = await api.get("/issues");
    setIssues(data);
  };

  useEffect(() => { load(); }, []);

  const update = async (id) => {
    await api.put(`/issues/${id}`, {
      status: statusMap[id] || "In Progress",
      assignedTo: "Maintenance Staff",
      estimatedResolution: "2 days",
      action: "Status updated by admin"
    });
    load();
  };

  return (
    <div>
      <h2>Admin Panel</h2>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Issue ID</th>
              <th>Category</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue._id}>
                <td>{issue.issueId}</td>
                <td>{issue.category}</td>
                <td>
                  <select value={statusMap[issue._id] || issue.status} onChange={(e) => setStatusMap({ ...statusMap, [issue._id]: e.target.value })}>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </td>
                <td>{issue.priority}</td>
                <td><button onClick={() => update(issue._id)}>Update</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/report" element={<ReportIssue />} />
            <Route path="/tracking" element={<Tracking />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}
EOF

echo "PART 4 complete"
#!/usr/bin/env bash
set -e

PROJECT="school-facility-portal"
cd "$PROJECT/client"

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

cat > src/components/LoadingSpinner.jsx <<'EOF'
export default function LoadingSpinner() {
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <div style={{
        width: "32px",
        height: "32px",
        border: "4px solid #cbd5e1",
        borderTop: "4px solid #2563eb",
        borderRadius: "50%",
        margin: "0 auto",
        animation: "spin 1s linear infinite"
      }} />
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
EOF

cat > src/pages/Home.jsx <<'EOF'
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="card">
      <h1>School Facility Reporting Portal</h1>
      <p>Report broken furniture, damaged toilets, unsafe classrooms, sanitation issues, and electrical hazards.</p>
      <p>
        <Link to="/register">Get Started</Link> | <Link to="/login">Login</Link>
      </p>
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
  const progress = issues.filter((i) => i.status === "In Progress").length;
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

cd ../server

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

node - <<'EOF'
const fs = require("fs");
const p = JSON.parse(fs.readFileSync("package.json", "utf8"));
p.scripts = p.scripts || {};
p.scripts.seed = "node src/seed.js";
fs.writeFileSync("package.json", JSON.stringify(p, null, 2));
EOF

echo "PART 5 complete"
#!/usr/bin/env bash
set -e

PROJECT="school-facility-portal"
cd "$PROJECT/server"

mkdir -p src/middleware src/uploads

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
    return res.status(400).json({
      message: "File upload error",
      error: err.message
    });
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
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
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

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = upload;
EOF

cat > src/controllers/uploadController.js <<'EOF'
const path = require("path");

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    res.status(201).json({
      message: "File uploaded successfully",
      filename: req.file.filename,
      url: `/uploads/${req.file.filename}`
    });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

const getUploadedFile = async (req, res) => {
  try {
    const filePath = path.join(__dirname, "../uploads", req.params.filename);
    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch file", error: error.message });
  }
};

module.exports = { uploadImage, getUploadedFile };
EOF

cat > src/routes/uploadRoutes.js <<'EOF'
const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { uploadImage, getUploadedFile } = require("../controllers/uploadController");

router.post("/", upload.single("file"), uploadImage);
router.get("/:filename", getUploadedFile);

module.exports = router;
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

app.get("/", (req, res) => res.json({ message: "School Facility Portal API is running" }));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/issues", require("./routes/issueRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/uploads", require("./routes/uploadRoutes"));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
EOF

cd ../client

cat > src/pages/ReportIssue.jsx <<'EOF'
import { useState } from "react";
import api from "../services/api";
import InputField from "../components/InputField";
import TextAreaField from "../components/TextAreaField";

export default function ReportIssue() {
  const [form, setForm] = useState({
    category: "",
    description: "",
    location: "",
    priority: "Medium"
  });
  const [file, setFile] = useState(null);
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

  const uploadFile = async () => {
    if (!file) return [];
    const fd = new FormData();
    fd.append("file", file);
    const { data } = await api.post("/uploads", fd, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return [data.url];
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const images = await uploadFile();
      await api.post("/issues", { ...form, images });
      alert("Issue submitted");
      setForm({ category: "", description: "", location: "", priority: "Medium" });
      setFile(null);
    } catch (err) {
      alert(err?.response?.data?.message || "Submission failed");
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

        <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>Priority</label>
        <select name="priority" value={form.priority} onChange={change}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>

        <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>Upload Image</label>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />

        <button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit Issue"}</button>
      </form>
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

cat > src/pages/Tracking.jsx <<'EOF'
import { useState } from "react";
import api from "../services/api";

export default function Tracking() {
  const [issueId, setIssueId] = useState("");
  const [issue, setIssue] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setError("");
    setIssue(null);
    setLoading(true);
    try {
      const { data } = await api.get(`/issues/${issueId}`);
      setIssue(data);
    } catch {
      setError("Issue not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Issue Tracking</h2>
      <input value={issueId} onChange={(e) => setIssueId(e.target.value)} placeholder="Enter Issue ID or Mongo ID" />
      <button onClick={search} disabled={loading}>{loading ? "Searching..." : "Track"}</button>
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
          <h4>Timeline</h4>
          <ul>
            {issue.timeline?.map((t, i) => <li key={i}>{t.action}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
EOF

echo "PART 6 complete"
#!/usr/bin/env bash
set -e

PROJECT="school-facility-portal"

cd "$PROJECT/server"

cat > src/middleware/roleMiddleware.js <<'EOF'
const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied for your role" });
    }
    next();
  };
};

module.exports = allowRoles;
EOF

cat > src/routes/issueRoutes.js <<'EOF'
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const { createIssue, getMyIssues, getIssueById, updateIssueStatus, getAllIssues } = require("../controllers/issueController");

router.post("/", protect, allowRoles("Parent", "Teacher", "Admin"), createIssue);
router.get("/my", protect, getMyIssues);
router.get("/", protect, allowRoles("Admin"), getAllIssues);
router.get("/:id", protect, getIssueById);
router.put("/:id", protect, allowRoles("Admin"), updateIssueStatus);

module.exports = router;
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

app.get("/", (req, res) => res.json({ message: "School Facility Portal API is running" }));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/issues", require("./routes/issueRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/uploads", require("./routes/uploadRoutes"));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
EOF

cd ../client

cat > src/components/RoleBadge.jsx <<'EOF'
export default function RoleBadge({ role }) {
  const color = role === "Admin" ? "#991b1b" : role === "Teacher" ? "#1d4ed8" : "#166534";
  return (
    <span style={{ background: color, color: "white", padding: "4px 10px", borderRadius: 999, fontSize: 12 }}>
      {role}
    </span>
  );
}
EOF

cat > src/pages/Profile.jsx <<'EOF'
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import RoleBadge from "../components/RoleBadge";

export default function Profile() {
  const { user } = useContext(AuthContext);

  return (
    <div className="card">
      <h2>Profile</h2>
      {user ? (
        <>
          <p><b>Name:</b> {user.name}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>School ID:</b> {user.schoolId}</p>
          <p><b>Role:</b> <RoleBadge role={user.role} /></p>
        </>
      ) : (
        <p>No user logged in</p>
      )}
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
import Profile from "./pages/Profile";
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
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
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

cat > vercel.json <<'EOF'
{
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    },
    {
      "src": "server/src/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "server/src/index.js" },
    { "src": "/(.*)", "dest": "client/index.html" }
  ]
}
EOF

cat > README.md <<'EOF'
# School Facility Reporting Portal

## Features
- Login and Register
- Parent/Teacher issue reporting
- Issue tracking
- Notifications
- Admin panel
- File uploads
- Role-based access

## Test Accounts
- admin@school.com / password123
- parent@school.com / password123
- teacher@school.com / password123

## Run Backend
cd server
npm run dev

## Run Frontend
cd client
npm run dev

## Seed Data
cd server
npm run seed
EOF

echo "PART 7 complete"
#!/usr/bin/env bash
set -e

PROJECT="school-facility-portal"
cd "$PROJECT"

if [ ! -f package.json ]; then
  npm init -y
fi

npm install -D concurrently

node - <<'EOF'
const fs = require("fs");
const p = JSON.parse(fs.readFileSync("package.json", "utf8"));
p.scripts = p.scripts || {};
p.scripts.dev = "concurrently \"npm run dev --prefix server\" \"npm run dev --prefix client\"";
p.scripts.seed = "npm run seed --prefix server";
p.scripts.setup = "echo Setup completed";
fs.writeFileSync("package.json", JSON.stringify(p, null, 2));
EOF

cat > RUN.md <<'EOF'
# Run Instructions

## Install dependencies
cd server
npm install
cd ../client
npm install
cd ..

## Start development servers
npm run dev

## Seed sample data
npm run seed

## Test accounts
admin@school.com / password123
parent@school.com / password123
teacher@school.com / password123
EOF

cat > FINAL_CHECKLIST.md <<'EOF'
# Final Checklist

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] MongoDB connection works
- [ ] Register/Login works
- [ ] Issue reporting works
- [ ] Upload works
- [ ] Tracking works
- [ ] Admin panel works
- [ ] Notifications load
- [ ] Seed data inserted
EOF

echo "=================================================="
echo "PART 8 complete"
echo "Use: npm run dev"
echo "=================================================="
#!/usr/bin/env bash
set -e

PROJECT="school-facility-portal"
cd "$PROJECT"

cat > DEPLOYMENT.md <<'EOF'
# Deployment Guide

## Local Environment Variables

### server/.env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development

### client/.env
VITE_API_URL=http://localhost:5000/api

## Local Run
1. Install dependencies:
   - cd server && npm install
   - cd client && npm install
2. Seed database:
   - cd server && npm run seed
3. Start both apps:
   - cd .. && npm run dev

## Production Notes
- Set `NODE_ENV=production` on the backend.
- Use a cloud database like MongoDB Atlas.
- Configure frontend API URL to deployed backend.
- Ensure uploads folder is writable or move to cloud storage.
- Set secure JWT secret in production.

## Suggested Hosting
- Frontend: Vercel or Netlify.
- Backend: Render or Vercel serverless.
- Database: MongoDB Atlas.
EOF

cat > TROUBLESHOOTING.md <<'EOF'
# Troubleshooting

## Common Issues

### 1. Login not working
- Check backend URL.
- Check MongoDB connection.
- Confirm user exists.

### 2. File upload failing
- Ensure backend route `/api/uploads` is active.
- Check file type and size.
- Confirm multipart form-data is sent.

### 3. Dashboard empty
- Run seed script.
- Check token in localStorage.
- Confirm `/api/issues/my` responds with data.

### 4. Admin panel blocked
- Login with admin account.
- Confirm role is `Admin`.
EOF

cat > client/.env.example <<'EOF'
VITE_API_URL=http://localhost:5000/api
EOF

cat > server/.env.example <<'EOF'
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
EOF

cat > FINAL_NOTES.md <<'EOF'
# Final Notes

This project includes:
- Authentication
- Role-based access
- Issue reporting
- Tracking
- Notifications
- Admin panel
- Image uploads
- Responsive dashboard
- Seed data
- Production-ready docs
EOF

echo "PART 9 complete"
#!/usr/bin/env bash
set -e

PROJECT="school-facility-portal"
cd "$PROJECT"

if [ ! -d .git ]; then
  git init
fi

git branch -M main || true

cat > FINAL_PROJECT_CHECKLIST.md <<'EOF'
# Final Project Checklist

## Core Modules
- [x] Authentication
- [x] User registration/login
- [x] Parent/Teacher issue reporting
- [x] Upload image support
- [x] Issue tracking
- [x] Notifications
- [x] Admin panel
- [x] Role-based access

## Backend
- [x] Express server
- [x] Mongoose models
- [x] JWT auth
- [x] Protected routes
- [x] Error middleware
- [x] File upload middleware

## Frontend
- [x] React pages
- [x] Routing
- [x] Dashboard
- [x] Form validation
- [x] Responsive tables
- [x] Loading states

## Deployment
- [x] Environment templates
- [x] Deployment docs
- [x] Monorepo dev script
EOF

cat > GITHUB_PUSH.md <<'EOF'
# GitHub Push Steps

```bash
git add .
git commit -m "Initial full-stack school portal"
git remote add origin <your-repo-url>
git push -u origin main
```
EOF

cat > STRUCTURE.md <<'EOF'
# Final Project Structure

school-facility-portal/
├── client/
├── server/
├── docs/
├── README.md
├── DEPLOYMENT.md
├── TROUBLESHOOTING.md
├── FINAL_PROJECT_CHECKLIST.md
└── package.json
EOF

echo "=================================================="
echo "PART 10 complete"
echo "Git repository initialized."
echo "Project ready for commit."
echo "=================================================="