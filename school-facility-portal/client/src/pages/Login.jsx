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
