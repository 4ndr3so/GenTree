type SidebarItemProps = {
  icon: string;
  text: string;
  active?: boolean;
  team?: boolean;
};

export function SidebarItem({ icon, text, active = false, team = false }: SidebarItemProps) {
  const base = team
    ? "flex items-center gap-3 text-sm px-3 py-2 text-indigo-100 rounded hover:bg-indigo-500"
    : "flex items-center gap-3 text-sm px-3 py-2 rounded hover:bg-indigo-500";
  return (
    <div className={`${base} ${active ? "bg-indigo-700" : ""}`}>
      <div className="w-6 h-6 bg-indigo-400 rounded-full flex items-center justify-center text-xs">
        {icon}
      </div>
      <span>{text}</span>
    </div>
  );
}
