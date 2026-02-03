interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
}

export default function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="bg-panel rounded-xl border border-graphite p-4 flex flex-col justify-between min-h-[110px]">
      <p className="text-[11px] uppercase tracking-[0.12em] text-muted mb-2">
        {label}
      </p>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-display font-bold tracking-tight text-offwhite">{value}</span>
      </div>
      {hint && (
        <p className="text-[11px] text-muted mt-1 leading-tight">
          {hint}
        </p>
      )}
    </div>
  );
}
