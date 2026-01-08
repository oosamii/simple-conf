"use client";

import type React from "react";

import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden ">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <main className="flex-1 overflow-y-auto bg-white">
          <div className="mx-auto max-w-[1200px] p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
