export function MobileNav({
  icon,
  label,
  active,
  onClick,
  id,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  id?: string;
}) {
  return (
    <button
      id={id}
      onClick={onClick}
      className={`grid justify-items-center gap-0.5 text-[10px] ${active ? "text-[#1d5b45]" : "text-[#819087]"}`}
    >
      {icon}
      {label}
    </button>
  );
}
