export default function TileBadge({ label, status }: { label: string; status: "ok" | "warn" | "error" }) {
  return (
    <span className={`tile-badge ${status}`} title={label} aria-label={`Update status: ${label}`}>
      {label}
    </span>
  );
}
