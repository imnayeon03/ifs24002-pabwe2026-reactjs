import { NavLink } from "react-router-dom";
import { IconLayoutDashboard, IconUsers, IconUserCircle } from "@tabler/icons-react";

export default function SidebarComponent({ open, onClose }) {
  const menus = [
    { name: "Dashboard", path: "/", icon: <IconLayoutDashboard size={20} /> },
    { name: "Pengguna", path: "/users", icon: <IconUsers size={20} /> },
    { name: "Profil Saya", path: "/profile", icon: <IconUserCircle size={20} /> },
  ];

  return (
    <>
      {/* Overlay untuk mobile */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/20 lg:hidden" onClick={onClose} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Menu Utama
          </p>
          <nav className="space-y-1">
            {menus.map((menu) => (
              <NavLink
                key={menu.name}
                to={menu.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                {menu.icon}
                {menu.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}