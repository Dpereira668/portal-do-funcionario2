
import { Link, useLocation } from "react-router-dom";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LucideIcon } from "lucide-react";

export interface MenuItem {
  title: string;
  icon: LucideIcon;
  path: string;
}

interface SidebarMenuListProps {
  items: MenuItem[];
  label: string;
}

const SidebarMenuList = ({ items, label }: SidebarMenuListProps) => {
  const location = useLocation();

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.path}>
          <SidebarMenuButton
            asChild
            isActive={location.pathname.startsWith(item.path)}
            tooltip={item.title}
          >
            <Link 
              to={item.path} 
              aria-label={`${label}: ${item.title}`}
              className="transition-colors"
            >
              <item.icon aria-hidden="true" className="shrink-0" />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

export default SidebarMenuList;
