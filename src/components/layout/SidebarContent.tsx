import { IconProps } from "./icons/types";
import { HeartIcon } from "./icons/Heart";

import { Component } from "solid-js";
import { HomeIcon } from "./icons/Home";
import { SearchIcon } from "./icons/Search";
import { UserIcon } from "./icons/User";
import { SettingsIcon } from "./icons/Settings";

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
