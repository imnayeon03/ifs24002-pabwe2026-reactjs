import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AuthLayout() {
  const token = useSelector((state) => state.auth.token);
  if (token) return <Navigate to="/" replace />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Teks Lost & Founds di atas form */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-blue-600">Lost & Founds</h1>
        </div>
        <Outlet />
      </div>
    </div>
  );
}