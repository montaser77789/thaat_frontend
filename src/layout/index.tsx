// src/layout/RootLayout.tsx
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useState } from "react";

export default function RootLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const SIDEBAR_OPEN_WIDTH = 230;   // نفس الرقم اللي بتستخدمه جوه Sidebar
  const SIDEBAR_CLOSED_WIDTH = 60;  // عرض الأيكونات بس مثلاً

  const currentSidebarWidth = sidebarOpen
    ? SIDEBAR_OPEN_WIDTH
    : SIDEBAR_CLOSED_WIDTH;

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Sidebar ثابت على الشمال */}
      <Sidebar
        isOpen={sidebarOpen}
        sidebarWidth={SIDEBAR_OPEN_WIDTH}
      />

      {/* المحتوى الرئيسي متزق padding-left على قد عرض الـ sidebar */}
      <div
        className="min-h-screen flex flex-col transition-all duration-300"
        style={{ paddingLeft: currentSidebarWidth }}
      >
        <Navbar
          sidebarWidth={SIDEBAR_OPEN_WIDTH}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 mt-16">
          <div className="container mx-auto px-4 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
