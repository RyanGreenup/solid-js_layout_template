import { Component, JSXElement } from "solid-js";

interface BottomNavbarProps {
  children: JSXElement;
}

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


export default BottomNavbar;
