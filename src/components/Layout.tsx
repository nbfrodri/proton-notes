import React from "react";

interface LayoutProps {
  sidebar: React.ReactNode;
  content: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ sidebar, content }) => {
  return (
    <div className="flex h-screen w-screen bg-slate-900 text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
        {sidebar}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-slate-900 relative">
        {/* Drag region for Electron title bar */}
        <div
          className="h-8 w-full select-none"
          style={{ WebkitAppRegion: "drag" } as any}
        ></div>
        <div className="flex-1 overflow-auto">{content}</div>
      </main>
    </div>
  );
};
