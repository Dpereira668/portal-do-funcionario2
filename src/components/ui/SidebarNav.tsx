
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SidebarNavProps {
  children: React.ReactNode;
  className?: string;
}

interface SidebarNavItemProps {
  href?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const SidebarNav = ({ children, className }: SidebarNavProps) => {
  return (
    <nav className={cn("flex flex-col gap-2 p-2", className)}>
      {children}
    </nav>
  );
};

export const SidebarNavItem = ({
  href,
  icon: Icon,
  children,
  onClick,
  className,
}: SidebarNavItemProps) => {
  const content = (
    <>
      {Icon && <Icon className="h-4 w-4" />}
      <span>{children}</span>
    </>
  );

  if (href) {
    return (
      <Link
        to={href}
        className={cn(
          "flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground",
          className
        )}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground",
        className
      )}
    >
      {content}
    </button>
  );
};
