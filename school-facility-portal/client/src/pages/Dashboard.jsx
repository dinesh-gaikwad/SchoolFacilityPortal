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
