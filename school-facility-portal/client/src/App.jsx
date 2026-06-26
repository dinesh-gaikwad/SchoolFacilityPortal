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
