import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import NavbarComponent from "../components/NavbarComponent";
import SidebarComponent from "../components/SidebarComponent";

// Route guard: tanpa token -> login
// TODO: Nanti setelah slice `users` siap, aktifkan kembali cek profile:
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { asyncLogout } from "../../auth/states/action";
// import { asyncGetProfile } from "../../users/states/action";

export default function LostFoundLayout() {
  const token = useSelector((state) => state.auth.token);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const closeDrawer = () => setDrawerOpen(false);

  if (!token) return <Navigate to="/auth/login" replace />;

  return (
    <div className="min-h-screen lg:pl-72">
      <SidebarComponent open={drawerOpen} onClose={closeDrawer} />
      <NavbarComponent onOpenMenu={() => setDrawerOpen(true)} />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}