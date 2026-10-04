import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import NavbarComponent from "../components/NavbarComponent";
import SidebarComponent from "../components/SidebarComponent";

export default function LostFoundLayout() {
  const token = useSelector((state) => state.auth.token);
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (!token) return <Navigate to="/auth/login" replace />;

  return (
    <div className="flex h-screen bg-[#f8f9fa] font-sans">
      {/* Sidebar */}
      <SidebarComponent open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <NavbarComponent onOpenMenu={() => setDrawerOpen(true)} />

        {/* Halaman yang berubah-ubah */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}