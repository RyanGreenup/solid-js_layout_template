import { Component, createEffect, JSXElement } from "solid-js";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navbarPosition?: string;
  children: JSXElement;
}

const SIDEBAR_WIDTH = "w-80";

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

export default DesktopSidebar;
