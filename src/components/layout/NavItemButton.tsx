import { NavItem } from "./SidebarContent";

const NavItemButton: Component<{
  item: NavItem;
  onClick?: () => void;
  isMobile?: boolean;
}> = (props) => (
  <button
    onClick={props.onClick}
    classList={{
      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 w-full":
        true,
      "text-primary bg-primary/10": props.item.active,
      "text-base-content/70 hover:text-base-content hover:bg-base-300/50":
        !props.item.active,
      "flex-col gap-1 text-xs": props.isMobile,
      "text-sm": !props.isMobile,
    }}
    aria-label={props.item.label}
  >
    <props.item.icon class={props.isMobile ? "w-5 h-5" : "w-5 h-5"} />
    <span class={props.isMobile ? "text-xs font-medium" : "font-medium"}>
      {props.item.label}
    </span>
  </button>
);

export default NavItemButton;
