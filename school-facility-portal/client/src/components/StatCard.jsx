export default function StatCard({ title, value, subtitle }) {
  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <div style={{ fontSize: 28, fontWeight: "bold" }}>{value}</div>
      <p>{subtitle}</p>
    </div>
  );
}
