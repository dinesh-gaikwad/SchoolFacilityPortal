export default function TextAreaField({ label, error, ...props }) {
  return (
    <div>
      {label && <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>{label}</label>}
      <textarea aria-invalid={!!error} rows="5" {...props} />
      {error && <div style={{ color: "#dc2626", fontSize: 13 }}>{error}</div>}
    </div>
  );
}
