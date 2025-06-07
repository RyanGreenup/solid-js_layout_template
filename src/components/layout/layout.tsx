import {
  createEffect,
  createSignal,
  JSXElement,
  onCleanup,
  onMount,
  Show,
  type Component,
} from "solid-js";
import { Accessor } from "solid-js/types/server/reactive.js";
import { HomeIcon } from "./icons/Home";
import { SearchIcon } from "./icons/Search";
import { HeartIcon } from "./icons/Heart";
import { UserIcon } from "./icons/User";
import NavItemButton from "./NavItemButton";
import { MobileDrawerPosition } from "./mobile/types";
import { IconProps } from "./icons/types";
import { XIcon } from "./icons/Close";
import { MenuIcon } from "./icons/Menu";
import BottomNavbarContent from "./mobile/NavbarDashContent";
import BottomNavbar from "./mobile/NavbarDash";
import DesktopSidebar from "./desktop/Sidebar";




interface MobileDrawerProps extends SidebarProps {
  position: MobileDrawerPosition;
  isExpanded?: boolean;
  onToggleSize?: () => void;
}

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


interface OverlayProps {
  isVisible: boolean;
  onClose: () => void;
}

// Constants
// NOTE sidebar will eventually be resizable




// Components
const Overlay: Component<OverlayProps> = (props) => (
  <div
    classList={{
      "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden":
        true,
      "opacity-100": props.isVisible,
      "opacity-0 pointer-events-none": !props.isVisible,
    }}
    onClick={props.onClose}
    aria-hidden="true"
  />
);

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

const MobileDrawer: Component<MobileDrawerProps> = (props) => {
  let drawerRef: HTMLDivElement | undefined;
  const key = "Enter";
  const DragHandle = () => {
    return (
      <button
        onClick={props.onToggleSize}
        class="flex justify-center pt-3 pb-2 w-full hover:bg-base-200/50 transition-colors duration-200 cursor-pointer group"
        aria-label={
          props.isExpanded ? "Make drawer smaller" : "Make drawer larger"
        }
        title={`Press ${key} to toggle drawer size`}
      >
        <div class="w-12 h-1 bg-base-content/20 rounded-full"></div>
      </button>
    );
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === " " || e.key === key) {
      e.preventDefault();
      props.onToggleSize?.();
    }
  };

  onMount(() => {
    document.addEventListener("keydown", handleKeyDown);

    onCleanup(() => {
      document.removeEventListener("keydown", handleKeyDown);
    });
  });

  // Focus the drawer when it opens
  createEffect(() => {
    if (props.isOpen && drawerRef) {
      drawerRef.focus();
    }
  });

  return (
    <div
      ref={drawerRef}
      tabIndex={-1}
      classList={{
        // Base classes
        "fixed bg-base-100 shadow-2xl z-50 transform transition-all duration-300 ease-out md:hidden flex flex-col":
          true,
        // Bottom drawer positioning and styling
        "bottom-navbar-height left-0 right-0  rounded-t-2xl":
          props.position === "bottom",
        // Height of the drawer - dynamic based on expanded state
        "h-bottom-drawer-collapsed":
          props.position === "bottom" && !props.isExpanded,
        "h-bottom-drawer-expanded":
          props.position === "bottom" && props.isExpanded,
        "h-sidebar-height": props.position === "side",
        // Move the draw vertically if the drawer is set to bottom
        "translate-y-0": props.position === "bottom" && props.isOpen,
        "translate-y-full": props.position === "bottom" && !props.isOpen,
        // Side drawer positioning and styling
        [`top-0 left-0 h-drawer-width border-r border-base-300`]:
          props.position === "side",
        // Move the draw horizontally if the drawer is set to side
        "translate-x-0": props.position === "side" && props.isOpen,
        "-translate-x-full": props.position === "side" && !props.isOpen,
      }}
      style={{ "touch-action": "none" }}
    >
      {/* Drag handle - only for bottom drawer */}
      <Show when={props.position === "bottom"}>
        <DragHandle />
      </Show>

      {/* Header */}
      <div class="flex items-center justify-between p-4 border-b border-base-300 flex-shrink-0">
        <h2 class="text-lg font-semibold text-base-content">Menu</h2>
        <button
          onClick={props.onClose}
          class="p-2 rounded-lg hover:bg-base-300 transition-colors duration-200"
          aria-label="Close menu"
        >
          <XIcon class="w-5 h-5 text-base-content/70" />
        </button>
      </div>

      <div
        ref={drawerRef}
        class="flex-1 overflow-y-auto overscroll-contain p-4"
      >
        <div class="flex flex-col flex-1 p-4">{props.children}</div>
      </div>
    </div>
  );
};



interface ResponsiveLayoutProps {
  sidebarContent: Accessor<JSXElement>;
  children?: any;
}

export const ResponsiveLayout: Component<ResponsiveLayoutProps> = (props) => {
  const [isSidebarOpen, setIsSidebarOpen] = createSignal(false);
  const [mobileDrawerPosition, setMobileDrawerPosition] =
    createSignal<MobileDrawerPosition>("bottom");
  const [isDrawerExpanded, setIsDrawerExpanded] = createSignal(false);

  const toggleSidebar = () => {
    const wasOpen = isSidebarOpen();
    setIsSidebarOpen(!wasOpen);
  };
  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleDrawerSize = () => setIsDrawerExpanded(!isDrawerExpanded());

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && isSidebarOpen()) {
      closeSidebar();
    }
    if (e.ctrlKey && e.key === "b") {
      e.preventDefault();
      toggleSidebar();
    }
    if (e.ctrlKey && e.key === "m") {
      e.preventDefault();
      setMobileDrawerPosition(
        mobileDrawerPosition() === "bottom" ? "side" : "bottom",
      );
    }
  };

  onMount(() => {
    // Set initial state - closed on mobile, open on desktop
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    setIsSidebarOpen(mediaQuery.matches);

    const handleResize = (e: MediaQueryListEvent) => {
      // On desktop, keep sidebar open by default, on mobile keep it closed
      setIsSidebarOpen(e.matches);
    };

    mediaQuery.addEventListener("change", handleResize);
    document.addEventListener("keydown", handleKeydown);

    onCleanup(() => {
      mediaQuery.removeEventListener("change", handleResize);
      document.removeEventListener("keydown", handleKeydown);
    });
  });

  // Lock body scroll when mobile drawer is open
  createEffect(() => {
    const updateBodyScroll = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile && isSidebarOpen()) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    };

    // Update on sidebar state change
    updateBodyScroll();

    // Update on window resize
    const handleResize = () => updateBodyScroll();
    window.addEventListener("resize", handleResize);

    onCleanup(() => {
      document.body.style.overflow = "";
      window.removeEventListener("resize", handleResize);
    });
  });

  return (
    <div class="min-h-screen bg-base-100 text-base-content">
      {/* Top navbar - desktop only */}
      <TopNavbar
        onToggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen()}
        mobileDrawerPosition={mobileDrawerPosition}
        setMobileDrawerPosition={setMobileDrawerPosition}
      />

      {/* Mobile drawer */}
      <MobileDrawer
        isOpen={isSidebarOpen()}
        onClose={closeSidebar}
        position={mobileDrawerPosition()}
        isExpanded={isDrawerExpanded()}
        onToggleSize={toggleDrawerSize}
      >
        {props.sidebarContent()}
      </MobileDrawer>

      {/* Desktop sidebar */}
      <DesktopSidebar
        isOpen={isSidebarOpen()}
        onClose={closeSidebar}
        navbarPosition="top"
      >
        {props.sidebarContent()}
      </DesktopSidebar>

      {/* Main content */}
      <div
        classList={{
          "min-h-screen transition-all duration-300 ease-in-out": true,
          "pb-20 md:pb-0": true,
          "md:pt-16": true,
          "md:ml-80": isSidebarOpen(),
          "md:ml-0": !isSidebarOpen(),
        }}
      >
        {props.children}
      </div>

      {/* Bottom navbar - mobile only */}
      <BottomNavbar>
        <BottomNavbarContent
          mobileDrawerPosition={mobileDrawerPosition}
          setMobileDrawerPosition={setMobileDrawerPosition}
          onToggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
      </BottomNavbar>

      {/* Overlay */}
      <Overlay isVisible={isSidebarOpen()} onClose={closeSidebar} />
    </div>
  );
};

