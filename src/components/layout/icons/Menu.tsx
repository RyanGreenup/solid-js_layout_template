import { Component } from "solid-js";
import { IconProps } from "./types";

export const MenuIcon: Component<IconProps> = (props) => (
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
