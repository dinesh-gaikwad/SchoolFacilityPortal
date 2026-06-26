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
