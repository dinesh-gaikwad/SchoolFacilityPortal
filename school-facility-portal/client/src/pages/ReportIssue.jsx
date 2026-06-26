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
