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
