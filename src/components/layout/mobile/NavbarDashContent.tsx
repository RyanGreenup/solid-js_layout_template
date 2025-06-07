import { Accessor, Component } from "solid-js";
import { MobileDrawerPosition } from "./types";
import { HomeIcon } from "../icons/Home";
import { SearchIcon } from "../icons/Search";
import { HeartIcon } from "../icons/Heart";
import { UserIcon } from "../icons/User";
import NavItemButton from "../NavItemButton";
import { MenuIcon } from "../icons/Menu";

interface BottomNavbarContentProps {
  mobileDrawerPosition: () => MobileDrawerPosition;
  setMobileDrawerPosition: (
    value:
      | MobileDrawerPosition
      | ((prev: MobileDrawerPosition) => MobileDrawerPosition),
  ) => void;
  onToggleSidebar: () => void;
  isSidebarOpen: Accessor<boolean>;
}

const BottomNavbarContent: Component<BottomNavbarContentProps> = (props) => {
  const navItems = [
    { id: "home", label: "Home", icon: HomeIcon, active: true },
    { id: "search", label: "Search", icon: SearchIcon, active: false },
    { id: "favorites", label: "Favorites", icon: HeartIcon, active: false },
    { id: "profile", label: "Profile", icon: UserIcon, active: false },
  ];

  return (
    <>
      {/* Mobile drawer position toggle */}
      <button
        onClick={() =>
          props.setMobileDrawerPosition((prev) =>
            prev === "bottom" ? "side" : "bottom",
          )
        }
        class="flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-lg transition-all duration-200 text-base-content/70 hover:text-base-content hover:bg-base-300/50"
        aria-label={`Switch to ${props.mobileDrawerPosition() === "bottom" ? "side" : "bottom"} drawer`}
      >
        <span class="text-lg">
          {props.mobileDrawerPosition() === "bottom" ? "📲" : "📱"}
        </span>
        <span class="text-xs font-medium">Switch</span>
      </button>

      <div class="flex items-center justify-around flex-1 px-4">
        {navItems.slice(0, 4).map((item) => (
          <NavItemButton item={item} isMobile={true} />
        ))}

        <button
          onClick={props.onToggleSidebar}
          classList={{
            "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200":
              true,
            "text-primary bg-primary/20": props.isSidebarOpen(),
            "text-base-content/70 hover:text-base-content hover:bg-base-300/50":
              !props.isSidebarOpen(),
          }}
          aria-label={props.isSidebarOpen() ? "Close menu" : "Open menu"}
        >
          <MenuIcon class="w-5 h-5" />
          <span class="text-xs font-medium">Menu</span>
        </button>
      </div>
    </>
  );
};

export default BottomNavbarContent;
