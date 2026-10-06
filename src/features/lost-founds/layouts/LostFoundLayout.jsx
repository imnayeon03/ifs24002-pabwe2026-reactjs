import { useState } from "react";
import { NavLink, Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { IconLogout, IconMenu2, IconX } from "@tabler/icons-react";
// SESUAIKAN: import action logout yang sudah kamu punya
// import { asyncUnsetAuthUser } from "../../auth/states/action";

const NAV_ITEMS = [
  { to: "/", label: "Beranda", end: true },
  { to: "/?tampilan=statistik", label: "Statistik" },
  { to: "/users", label: "Pengguna" },
  { to: "/profile", label: "Profil" },
];

export default function LostFoundLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {
    // SESUAIKAN: dispatch(asyncUnsetAuthUser());
    navigate("/auth/login");
  };

  const linkClass = ({ isActive }) =>
    `rounded-xl px-4 py-2 text-sm font-bold transition ${
      isActive ? "bg-amber-300 text-indigo-950" : "text-white hover:bg-indigo-900"
    }`;

  return (
    <div className="min-h-screen bg-stone-100">
      <a
        href="#konten-utama"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2"
      >
        Lewati ke konten utama
      </a>

      <header className="bg-indigo-950">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="font-display text-xl font-extrabold text-amber-300">
            Lost &amp; Found
          </Link>

          <nav aria-label="Navigasi utama" className="hidden items-center gap-2 lg:flex">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={logout}
              className="ml-2 flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-rose-200 hover:bg-indigo-900"
            >
              <IconLogout size={18} aria-hidden="true" /> Keluar
            </button>
          </nav>

          <button
            type="button"
            aria-label={open ? "Tutup menu navigasi" : "Buka menu navigasi"}
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((v) => !v)}
            className="text-white lg:hidden"
          >
            {open ? <IconX size={24} aria-hidden="true" /> : <IconMenu2 size={24} aria-hidden="true" />}
          </button>
        </div>

        {open && (
          <nav id="menu-mobile" aria-label="Navigasi seluler" className="flex flex-col gap-1 px-4 pb-4 lg:hidden">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={linkClass} onClick={() => setOpen(false)}>
                {item.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-left text-sm font-bold text-rose-200 hover:bg-indigo-900"
            >
              <IconLogout size={18} aria-hidden="true" /> Keluar
            </button>
          </nav>
        )}
      </header>

      <main id="konten-utama" className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}