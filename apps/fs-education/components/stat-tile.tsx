export function StatTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="card p-4">
      <p className="section-title">{label}</p>
      <p className="mt-2 text-2xl font-bold text-brand-900">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-brand-400">{hint}</p>}
    </div>
  );
}
