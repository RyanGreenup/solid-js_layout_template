
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

// Types
type MobileDrawerPosition = "bottom" | "side";

interface NavItem {
  id: string;
  label: string;
  icon: Component<IconProps>;
  active: boolean;
}

interface IconProps {
  class?: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navbarPosition?: string;
  children: JSXElement;
}

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

interface BottomNavbarProps {
  children: JSXElement;
}

interface OverlayProps {
  isVisible: boolean;
  onClose: () => void;
}

// Constants
// NOTE sidebar will eventually be resizable
const SIDEBAR_WIDTH = "w-80";

// Icons
const MenuIcon: Component<IconProps> = (props) => (
  <svg
    class={props.class}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const XIcon: Component<IconProps> = (props) => (
  <svg
    class={props.class}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const HomeIcon: Component<IconProps> = (props) => (
  <svg
    class={props.class}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

const SearchIcon: Component<IconProps> = (props) => (
  <svg
    class={props.class}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const HeartIcon: Component<IconProps> = (props) => (
  <svg
    class={props.class}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

const UserIcon: Component<IconProps> = (props) => (
  <svg
    class={props.class}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const SettingsIcon: Component<IconProps> = (props) => (
  <svg
    class={props.class}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

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

/**
 * DesktopSidebar - A fixed sidebar component for desktop layouts
 *
 * @param props.isOpen - Whether the sidebar is currently open/visible
 * @param props.onClose - Callback function to close the sidebar
 * @param props.navItems - Array of navigation items to display in the sidebar
 * @param props.navbarPosition - Optional position of the navbar ("top" by default)
 */
const DesktopSidebar: Component<SidebarProps> = (props) => {
  let sidebarRef: HTMLElement | undefined;
  const navbarPosition = props.navbarPosition ?? "top";

  // Focus the sidebar when it opens
  createEffect(() => {
    if (props.isOpen && sidebarRef) {
      sidebarRef.focus();
    }
  });

  return (
    <aside
      ref={sidebarRef}
      tabIndex={-1}
      classList={{
        // This inverses md:hidden, hiding on all displays smaller than md
        [` hidden md:block`]: true,
        // Animate the movement
        "transform transition-transform duration-300 ease-in-out": true,
        // Set the z-index level
        "z-30": true,
        // Add a border
        "border-r border-base-300": true,
        // This is for debugging
        "border-t-4 border-red-500": false,
        // Fix the potision on the far left
        "fixed  left-0": true,
        // Fix the top / bottom at the navbar height
        "top-navbar-height": navbarPosition === "top",
        "bottom-navbar-height": props.navbarPosition === "bottom",
        // Set the height to the screen less the sidebar
        "h-sidebar-height overflow-y-auto": true,
        // Use a translation along the x-axis to hide the sidebar
        "translate-x-0": props.isOpen,
        "-translate-x-full": !props.isOpen,
      }}
      style={{
        // Set the width here so it can later be dynamic
        width: SIDEBAR_WIDTH,
      }}
    >
      <div class="flex flex-col flex-1 p-4">{props.children}</div>
      <DragHandleDesktop />
    </aside>
  );
};

const DragHandleDesktop = (): JSXElement => {
  return (
    <div
      classList={{
        // Positioning - absolute positioning relative to parent
        "absolute top-0 right-0": true,

        // Dimensions - thin vertical strip taking full height
        "w-1 h-full": true,

        // Background and visual states - transparent by default, highlight on hover
        "bg-transparent hover:bg-primary/50": true,

        // Cursor and interaction - resize cursor to indicate draggable area
        "cursor-col-resize": true,

        // Animations - smooth color transitions
        "transition-colors duration-200": true,

        // Grouping - enables group hover effects for child elements
        group: true,
      }}
      // onMouseDown={props.onResizeStart}
      // onTouchStart={props.onResizeStart}
    >
      <div
        classList={{
          // Positioning - absolute positioning relative to parent, centered vertically
          "absolute top-1/2 right-0 transform -translate-y-1/2": true,

          // Dimensions - width, height for the drag handle visual indicator
          "w-3 h-8": true,

          // Background and visual styling - background color and rounded corners
          "bg-base-300 rounded-l-md": true,

          // Visibility and hover states - hidden by default, visible on parent group hover
          "opacity-0 group-hover:opacity-100": true,

          // Animations - smooth opacity transitions
          "transition-opacity duration-200": true,

          // Layout - flexbox for centering content
          "flex items-center justify-center": true,
        }}
      >
        <div class="w-0.5 h-4 bg-base-content/30 rounded-full"></div>
      </div>
    </div>
  );
};

const SidebarContent = (props: { navItems: NavItem[] }): JSXElement => {
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

const BottomNavbar: Component<BottomNavbarProps> = (props) => {
  return (
    <nav
      classList={{
        // Position and layout
        "fixed bottom-0 left-0 right-0": true,
        // Dimensions
        "h-navbar-height": true,
        // Background and visual effects
        "bg-base-200/95 backdrop-blur-md": true,
        // Borders
        "border-t border-base-300": true,
        // Z-index layering
        "z-50": true,
        // Responsive visibility, only show this on mobile
        "md:hidden": true,
      }}
    >
      <div class="flex items-center justify-between h-full px-4">
        {props.children}
      </div>
    </nav>
  );
};

/**
 * MainContent - The main content area component that displays the primary application content
 *
 * This component renders the main dashboard content including project overview, tabs,
 * and project cards. It automatically adjusts its layout based on whether the sidebar
 * is open or closed, providing appropriate margins and spacing.
 *
 * @param props.isSidebarOpen - Boolean indicating whether the sidebar is currently open,
 *                              used to adjust the main content layout and margins
 *                              whilst this can be ommited, the animation seems smoother with it and
 *                              the animation possibly can be disabled or modified for the main content with this structure
 */
const MainContent: Component<{ isSidebarOpen?: boolean }> = (props) => {
  const [activeTab, setActiveTab] = createSignal("recent");

  const tabs = [
    { id: "recent", label: "Recent", emoji: "🕒" },
    { id: "favorites", label: "Favorites", emoji: "⭐" },
    { id: "archived", label: "Archived", emoji: "📦" },
  ];

  const projects = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    title: `Project ${i + 1}`,
    description:
      "This is a sample project description that shows how content flows in the responsive layout.",
    icon: ["📊", "🎨", "🚀", "💡", "🔧", "📱"][i % 6],
    status: "Active",
    lastUpdated: "2 hours ago",
    members: ["A", "B", "C"],
  }));

  return (
    <main
      classList={{
        "min-h-screen transition-all duration-300 ease-in-out": true,
        "pb-20 md:pb-0": true,
        "md:pt-16": true,
        ...(props.isSidebarOpen !== undefined && {
          "md:ml-80": props.isSidebarOpen,
          "md:ml-4": !props.isSidebarOpen,
        }),
      }}
    >
      <div class="p-4 md:p-8 ">
        {/* Header */}
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-base-content mb-2 md:hidden">
            Good morning! 👋
          </h1>
          <h2 class="text-xl font-semibold text-base-content mb-2 hidden md:block">
            Project Overview
          </h2>
          <p class="text-base-content/70">
            Here's what's happening with your projects today.
          </p>
        </div>

        {/* Tab navigation */}
        <div class="flex gap-2 mb-6 bg-base-200 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              onClick={() => setActiveTab(tab.id)}
              classList={{
                "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all duration-200":
                  true,
                "bg-base-100 text-base-content shadow-sm":
                  activeTab() === tab.id,
                "text-base-content/70 hover:text-base-content":
                  activeTab() !== tab.id,
              }}
            >
              <span>{tab.emoji}</span>
              <span class="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content grid */}
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div class="bg-base-200 rounded-xl p-4 border border-base-300 hover:shadow-lg transition-shadow duration-200">
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <span class="text-lg">{project.icon}</span>
                  </div>
                  <div>
                    <h3 class="font-semibold text-base-content">
                      {project.title}
                    </h3>
                    <p class="text-sm text-base-content/70">
                      Updated {project.lastUpdated}
                    </p>
                  </div>
                </div>
                <span class="text-xs px-2 py-1 bg-success/20 text-success rounded-full">
                  {project.status}
                </span>
              </div>

              <p class="text-sm text-base-content/80 mb-3">
                {project.description}
              </p>

              <div class="flex items-center gap-2">
                <div class="flex -space-x-2">
                  {project.members.map((member) => (
                    <div class="w-6 h-6 bg-primary rounded-full border-2 border-base-200 flex items-center justify-center">
                      <span class="text-xs text-primary-content">{member}</span>
                    </div>
                  ))}
                </div>
                <span class="text-xs text-base-content/70">+2 more</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

interface ResponsiveLayoutProps {
  sidebarContent: Accessor<JSXElement>;
  children?: any;
}

const ResponsiveLayout: Component<ResponsiveLayoutProps> = (props) => {
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

const ResponsiveLayoutPage = (): JSXElement => {
  const navItems: NavItem[] = [
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

  const SBContent = () => {
    return <SidebarContent navItems={navItems} />;
  };

  return (
    <ResponsiveLayout
      sidebarContent={() => {
        return <SBContent />;
      }}
    >
      <MainContent isSidebarOpen={false} />
    </ResponsiveLayout>
  );
};

export default ResponsiveLayoutPage;
