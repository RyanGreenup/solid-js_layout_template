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
import MobileDrawer, { Overlay } from "./mobile/Drawer";
import TopNavbar from "./desktop/Navbar";







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

