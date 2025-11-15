import { useEffect, useMemo, useState } from "react";
import {
  FaBell,
  FaComment,
  FaTh,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarWidth: number;
}

type AdminLS = {
  id?: number;
  name?: string;
  email?: string;
  permissions?: string[] | Record<string, unknown>;
};

function getInitials(input?: string) {
  if (!input) return "NA";
  // Try name first
  const parts = input.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  // Fallback: if it's an email, use before the @
  const first = input.split("@")[0];
  return (first.slice(0, 2) || "NA").toUpperCase();
}

export default function Navbar({
  sidebarOpen,
  setSidebarOpen,
  sidebarWidth,
}: NavbarProps) {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<AdminLS | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("admin");
      if (raw) {
        const parsed: AdminLS = JSON.parse(raw);
        setAdmin(parsed);
      }
    } catch {
      setAdmin(null);
    }
  }, []);

  const displayName = admin?.name || "System Admin";
  const displayEmail = admin?.email || "—";
  const initials = useMemo(
    () => getInitials(admin?.name || admin?.email),
    [admin]
  );

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav
      style={{ left: `${sidebarOpen ? sidebarWidth : 64}px` }}
      className="fixed top-0  right-0 bg-white border-b z-100 border-gray-200 shadow-sm transition-all duration-300"
    >
      <div className="flex items-center justify-between h-14 px-6">
        {/* Left side - Menu Toggle Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-primary cursor-pointer z-100 hover:bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
          >
            {sidebarOpen ? (
              <FaTimes className="w-5 h-5" />
            ) : (
              <FaBars className="w-5 h-5" />
            )}
          </button>
        </div>


        {/* Right side - User Profile and Icons */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex gap-2">
            {/* Theme Toggle - يمكن إضافته لاحقًا */}
            <button className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary cursor-pointer hover:bg-primary/20 transition-colors">
              <FaCog className="w-5 h-5" />
            </button>

            <Link to="/messages">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary cursor-pointer hover:bg-primary/20 transition-colors">
                <FaComment className="w-5 h-5" />
              </div>
            </Link>

            <button className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary cursor-pointer hover:bg-primary/20 transition-colors">
              <FaTh className="w-5 h-5" />
            </button>

            <Link to="/notifications">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary cursor-pointer hover:bg-primary/20 transition-colors relative">
                <FaBell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  3
                </span>
              </div>
            </Link>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 min-w-0 hover:bg-gray-50 rounded-lg p-2 transition-colors"
            >
              <div className="flex flex-col min-w-0 text-right">
                <h3 className="font-semibold text-gray-900 text-sm truncate">
                  {displayName}
                </h3>
                <p className="text-xs text-gray-500 truncate">{displayEmail}</p>
              </div>

              {/* Avatar with initials */}
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-primary/20 text-primary flex items-center justify-center border-2 border-white shadow-sm">
                <span className="text-sm font-bold">{initials}</span>
              </div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <Link
                  to="/profile/edit"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <FaUserCircle className="w-4 h-4 text-gray-400" />
                  Edit Profile
                </Link>

                <div className="border-t border-gray-200 my-1"></div>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <FaSignOutAlt className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </nav>
  );
}
