import React, { useState } from "react";
import { Menu } from "lucide-react";

interface LayoutProps {
  sidebar: React.ReactNode;
  content: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ sidebar, content }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen bg-slate-900 text-slate-100 overflow-hidden relative">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 border-r border-slate-800 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 md:w-64 md:shadow-none
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {sidebar}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-slate-900 relative w-full">
        {/* Drag region for Electron title bar */}
        <div
          className="h-20 md:h-8 w-full select-none flex items-center px-4 md:px-0 pt-10 md:pt-0"
          style={{ WebkitAppRegion: "drag" } as any}
        >
          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-slate-400 hover:text-white md:hidden mr-4"
            style={{ WebkitAppRegion: "no-drag" } as any}
          >
            <Menu size={28} />
          </button>
        </div>

        <div className="flex-1 overflow-auto w-full">{content}</div>
      </main>
    </div>
  );
};
