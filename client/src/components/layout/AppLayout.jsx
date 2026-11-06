import { useTheme } from '../../context/ThemeContext';
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar.jsx';
import { Sidebar } from './Sidebar.jsx';

export const AppLayout = () => {
  const { theme } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
   <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#080F19] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'} flex flex-col`}>
      {/* Top Navigation */}
      <Navbar onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

      {/* Main Container */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Dynamic View Content */}
        <main
          className={`flex-1 transition-all duration-300 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full ${
            isSidebarCollapsed ? 'lg:pl-28' : 'lg:pl-72'
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};
