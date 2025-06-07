import { Component, createEffect, onCleanup, onMount, Show } from "solid-js";
import { MobileDrawerPosition } from "./types";
import { SidebarProps } from "../types";
import { XIcon } from "../icons/Close";

interface OverlayProps {
  isVisible: boolean;
  onClose: () => void;
}

/**
 * This provides an overlay that dims the background. The user can click it to fire
 * an action. In this layout it's used by the mobile drawer to close it when opened.
 */
export const Overlay: Component<OverlayProps> = (props) => (
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

interface MobileDrawerProps extends SidebarProps {
  position: MobileDrawerPosition;
  isExpanded?: boolean;
  onToggleSize?: () => void;
}
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

export default MobileDrawer;
