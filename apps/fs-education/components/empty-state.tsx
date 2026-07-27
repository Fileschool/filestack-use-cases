export function EmptyState({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-brand-200 bg-white/60 px-6 py-10 text-center">
      <p className="text-sm font-semibold text-brand-800">{title}</p>
      {children && (
        <div className="mt-1.5 text-sm text-brand-400">{children}</div>
      )}
    </div>
  );
}
