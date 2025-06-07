import { Component } from "solid-js";
import { MobileDrawerPosition } from "../mobile/types";
import { MenuIcon } from "../icons/Menu";

interface TopNavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  mobileDrawerPosition: () => MobileDrawerPosition;
  setMobileDrawerPosition: (
    value:
      | MobileDrawerPosition
      | ((prev: MobileDrawerPosition) => MobileDrawerPosition),
  ) => void;
}

const TopNavbar: Component<TopNavbarProps> = (props) => (
  <nav
    class={`fixed top-0 left-0 right-0 h-navbar-height bg-base-200/95 backdrop-blur-md border-b border-base-300 z-50 hidden md:flex`}
  >
    <div class="flex items-center justify-between w-full px-6">
      <div class="flex items-center gap-4">
        <button
          onClick={props.onToggleSidebar}
          classList={{
            "p-2 rounded-lg transition-colors duration-200": true,
            "text-primary bg-primary/10": props.isSidebarOpen,
            "text-base-content/70 hover:text-base-content hover:bg-base-300/50":
              !props.isSidebarOpen,
          }}
          aria-label={props.isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <MenuIcon class="w-6 h-6" />
        </button>
        <h1 class="text-lg font-semibold text-base-content">Dashboard</h1>
      </div>

      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <span class="text-sm text-primary-content font-medium">JD</span>
        </div>
        <span class="text-sm font-medium text-base-content">John Doe</span>
      </div>
    </div>
  </nav>
);

export default TopNavbar;
