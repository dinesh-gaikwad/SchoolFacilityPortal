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
