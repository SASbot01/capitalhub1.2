interface TopbarProps {
  title: string;
  subtitle?: string;
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  return (
    <header className="mb-6">
      <div>
        <h1 className="text-xl font-display font-bold tracking-tight text-offwhite">{title}</h1>
        {subtitle && (
          <p className="text-xs text-muted mt-1">{subtitle}</p>
        )}
      </div>
    </header>
  );
}
