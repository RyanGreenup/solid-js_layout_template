import { JSXElement } from "solid-js";

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navbarPosition?: string;
  children: JSXElement;
}
