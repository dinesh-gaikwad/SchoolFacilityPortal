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
