import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import Nav from "~/components/Nav";
import "./app.css";
import ResponsiveLayoutPage, {
  MainContent,
  ResponsiveLayout,
} from "./components/layout/layout";
import SidebarContent, { navItems } from "./components/layout/SidebarContent";

export default function App() {
  return (
    <Router
      root={(props) => (
        <>
          <ResponsiveLayout sidebarContent={() => <SidebarContent />}>
            <Suspense>{props.children}</Suspense>
          </ResponsiveLayout>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
