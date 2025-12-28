interface AvatarProps {
  initials?: string;
}

export default function Avatar({ initials = "AD" }: AvatarProps) {
  return (
    <div className="w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-semibold">
      {initials}
    </div>
  );
}
