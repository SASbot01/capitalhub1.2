interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
}

export default function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-neutral-200 p-4 flex flex-col justify-between min-h-[110px]">
      <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-500 mb-2">
        {label}
      </p>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold tracking-tight">{value}</span>
      </div>
      {hint && (
        <p className="text-[11px] text-neutral-500 mt-1 leading-tight">
          {hint}
        </p>
      )}
    </div>
  );
}
