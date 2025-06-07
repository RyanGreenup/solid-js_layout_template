import { Component, createSignal } from "solid-js";

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
const MainContent: Component = () => {
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

export default MainContent;
