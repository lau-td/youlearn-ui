import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

interface ContentNavProps {
  documentId: string;
}

export function ContentNav({ documentId }: ContentNavProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const tabs = [
    {
      name: "Chat",
      href: `/documents/${documentId}/chat`,
    },
    {
      name: "Flashcards",
      href: `/documents/${documentId}/flashcards`,
    },
    {
      name: "Summary",
      href: `/documents/${documentId}/summary`,
    },
  ];

  return (
    <div className="flex items-center gap-4 px-4 py-2 border-b bg-background">
      {tabs.map((tab) => (
        <Link
          key={tab.name}
          to={tab.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            currentPath === tab.href
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground"
          )}
        >
          {tab.name}
        </Link>
      ))}
    </div>
  );
}
