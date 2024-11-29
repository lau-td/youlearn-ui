import { cn } from "@/lib/utils";

interface SidebarItemProps {
  title: string;
  onClick?: () => void;
  className?: string;
  isChild?: boolean;
}

export function SidebarItem({
  title,
  onClick,
  className,
  isChild = false,
}: SidebarItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 cursor-pointer hover:bg-gray-100 text-black p-2 rounded-md",
        isChild ? "ml-6 text-sm" : "bg-white border border-[#3c3c3c]",
        className
      )}
      onClick={onClick}
    >
      <span>{title}</span>
    </div>
  );
}
