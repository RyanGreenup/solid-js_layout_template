import { IconProps } from "./icons/types";
import { HeartIcon } from "./icons/Heart";

import { Component, JSXElement } from "solid-js";
import { HomeIcon } from "./icons/Home";
import { SearchIcon } from "./icons/Search";
import { UserIcon } from "./icons/User";
import { SettingsIcon } from "./icons/Settings";
import NavItemButton from "./NavItemButton";

export interface NavItem {
  id: string;
  label: string;
  icon: Component<IconProps>;
  active: boolean;
}

export const navItems: NavItem[] = [
  { id: "home", label: "Home", icon: HomeIcon, active: true },
  { id: "search", label: "Search", icon: SearchIcon, active: false },
  { id: "favorites", label: "Favorites", icon: HeartIcon, active: false },
  { id: "profile", label: "Profile", icon: UserIcon, active: false },
  { id: "settings", label: "Settings", icon: SettingsIcon, active: false },
  { id: "dashboard", label: "Dashboard", icon: HomeIcon, active: false },
  { id: "analytics", label: "Analytics", icon: SearchIcon, active: false },
  { id: "projects", label: "Projects", icon: UserIcon, active: false },
  { id: "team", label: "Team", icon: UserIcon, active: false },
  { id: "messages", label: "Messages", icon: HeartIcon, active: false },
  { id: "calendar", label: "Calendar", icon: SearchIcon, active: false },
  { id: "files", label: "Files", icon: SettingsIcon, active: false },
  {
    id: "notifications",
    label: "Notifications",
    icon: HeartIcon,
    active: false,
  },
  { id: "help", label: "Help", icon: SearchIcon, active: false },
  { id: "reports", label: "Reports", icon: SettingsIcon, active: false },
  { id: "billing", label: "Billing", icon: UserIcon, active: false },
  {
    id: "integrations",
    label: "Integrations",
    icon: HomeIcon,
    active: false,
  },
  { id: "activity", label: "Activity", icon: SearchIcon, active: false },
  { id: "security", label: "Security", icon: SettingsIcon, active: false },
  { id: "backup", label: "Backup", icon: HeartIcon, active: false },
];

export const SidebarContentWrapper = (props: {
  navItems: NavItem[];
}): JSXElement => {
  return (
    <>
      {/* Navigation items */}
      <nav class="space-y-2">
        {props.navItems.map((item) => (
          <NavItemButton item={item} />
        ))}
      </nav>

      {/* Quick actions */}
      <div class="mt-8 p-4 bg-base-200 rounded-xl">
        <h3 class="text-sm font-semibold text-base-content mb-3">
          Quick Actions
        </h3>
        <div class="space-y-2">
          <button class="w-full px-4 py-2 text-sm font-medium bg-primary text-primary-content rounded-lg hover:bg-primary/90 transition-colors duration-200">
            🚀 New Project
          </button>
          <button class="w-full px-4 py-2 text-sm font-medium bg-success text-success-content rounded-lg hover:bg-success/90 transition-colors duration-200">
            📊 View Reports
          </button>
        </div>
      </div>
    </>
  );
};

const SidebarContent = () => {
  return <SidebarContentWrapper navItems={navItems} />;
};

export default SidebarContent;
