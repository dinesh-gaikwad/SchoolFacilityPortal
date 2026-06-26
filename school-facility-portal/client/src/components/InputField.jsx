export default function InputField({ label, error, ...props }) {
  return (
    <div>
      {label && <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>{label}</label>}
      <input aria-invalid={!!error} {...props} />
      {error && <div style={{ color: "#dc2626", fontSize: 13 }}>{error}</div>}
    </div>
  );
}
