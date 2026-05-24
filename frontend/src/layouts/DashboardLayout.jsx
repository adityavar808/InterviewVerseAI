import { useState } from "react";

import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div
      className="flex text-white relative overflow-x-hidden"
      style={{
        background: "#020617",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          zIndex: 0,
        }}
      />

      {/* Ambient orb — top left */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "500px",
          height: "500px",
          top: "-120px",
          left: "-80px",
          background:
            "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />

      {/* Ambient orb — bottom right */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "400px",
          height: "400px",
          bottom: "-80px",
          right: "-60px",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />

      {/* Sidebar — sticky, full height, never scrolls */}
      {/* <div
        className="relative z-10 flex-shrink-0"
        style={{ height: "100vh", position: "sticky", top: 0 }}
      >
        <Sidebar />
      </div> */}

      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* DESKTOP SIDEBAR */}

      <div
        className={`
    hidden lg:block flex-shrink-0
    transition-all duration-300

    ${collapsed ? "w-24" : "w-72"}
  `}
      >
        <div className="sticky top-0 h-screen">
          <Sidebar collapsed={collapsed} setSidebarOpen={setSidebarOpen} />
        </div>
      </div>

      {/* MOBILE SIDEBAR */}

      <div
        className={`
    fixed top-0 left-0 z-50 h-screen transition-transform duration-300 lg:hidden

    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
  `}
      >
        <Sidebar collapsed={false} setSidebarOpen={setSidebarOpen} />
      </div>

      {/* Right panel — navbar pinned at top, only <main> scrolls */}
      <div
        className="relative z-10 flex-1 flex flex-col min-w-0"
        style={{ height: "100vh" }}
      >
        {/* Navbar — never scrolls */}
        <div className="flex-shrink-0 relative z-10">
          <Navbar
            setSidebarOpen={setSidebarOpen}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />
        </div>

        {/* Main content — the ONLY thing that scrolls */}
        <main className="flex-1 overflow-y-auto p-6 relative z-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
