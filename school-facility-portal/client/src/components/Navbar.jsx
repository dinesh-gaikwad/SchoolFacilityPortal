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
