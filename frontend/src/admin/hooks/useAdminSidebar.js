import { useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BriefcaseBusiness,
  Code2,
  FileText,
  Settings,
} from "lucide-react";

export const ADMIN_NAV_ITEMS = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
    description:
      "Platform health, growth, and operational alerts.",
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: Users,
    description:
      "Manage learner and administrator accounts.",
  },
  {
    name: "Interviews",
    path: "/admin/interviews",
    icon: BriefcaseBusiness,
    description:
      "Maintain interview tracks and template inventory.",
  },
  {
    name: "Coding",
    path: "/admin/coding",
    icon: Code2,
    description:
      "Curate coding questions and practice coverage.",
  },
  {
    name: "Reports",
    path: "/admin/reports",
    icon: FileText,
    description:
      "Review adoption, content coverage, and trends.",
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: Settings,
    description:
      "Configure platform defaults and access rules.",
  },
];

const findActiveItem = (pathname) =>
  ADMIN_NAV_ITEMS.find((item) => {
    if (item.path === "/admin") {
      return pathname === "/admin";
    }

    return pathname.startsWith(item.path);
  }) || ADMIN_NAV_ITEMS[0];

const useAdminSidebar = () => {
  const location = useLocation();
  const activeItem = findActiveItem(
    location.pathname,
  );

  return {
    navItems: ADMIN_NAV_ITEMS,
    activeItem,
    pageTitle: activeItem.name,
    pageDescription:
      activeItem.description,
  };
};

export default useAdminSidebar;
