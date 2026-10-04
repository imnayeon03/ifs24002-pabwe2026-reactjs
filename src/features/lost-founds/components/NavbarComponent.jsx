import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IconLogout, IconMenu2 } from "@tabler/icons-react";
// import { asyncLogout } from "../../auth/states/action"; // Aktifkan jika sudah ada

export default function NavbarComponent({ onOpenMenu }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Ganti dengan state user kamu yang sebenarnya
  const user = useSelector((state) => state.auth.user) || { name: "parkboyoung" };

  const handleLogout = async () => {
    // await dispatch(asyncLogout());
    // localStorage.removeItem("token");
    navigate("/auth/login");
  };

  const initials = user?.name ? user.name.substring(0, 2).toUpperCase() : "PA";

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <button onClick={onOpenMenu} className="lg:hidden text-gray-500">
          <IconMenu2 size={24} />
        </button>
        <h1 className="text-xl font-bold text-blue-600">Lost & Founds</h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">{user.name}</span>
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
          {initials}
        </div>
        <button onClick={handleLogout} className="text-gray-400 hover:text-gray-600 transition-colors">
          <IconLogout size={20} />
        </button>
      </div>
    </header>
  );
}