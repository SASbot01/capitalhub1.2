interface AvatarProps {
  initials?: string;
}

export default function Avatar({ initials = "CH" }: AvatarProps) {
  return (
    <div className="w-9 h-9 rounded-lg bg-accent text-carbon flex items-center justify-center text-xs font-semibold">
      {initials}
    </div>
  );
}
