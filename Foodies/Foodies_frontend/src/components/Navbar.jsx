import { useCart } from "@/context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  UtensilsCrossed,
  ShoppingCart,
  LayoutDashboard,
  User,
} from "lucide-react"; // <--- 1. Import User Icon

const Navbar = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const isAdmin = token && localStorage.getItem("userEmail")?.includes("admin");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    alert("Logged out successfully!");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 z-50 py-4 px-8">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <UtensilsCrossed className="text-purple-500" size={28} />
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-pink-600">
            Foodie
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            Home
          </Link>
          {token && (
            <>
              <Link
                to="/orders"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                My Orders
              </Link>

              {/* ✅ NEW: Profile Link */}
              <Link
                to="/profile"
                className="text-zinc-400 hover:text-purple-400 transition-colors flex items-center gap-1"
              >
                <User size={18} /> Profile
              </Link>
            </>
          )}
          {/* ADMIN LINKS */}
          {isAdmin && (
            <>
              <Link
                to="/admin"
                className="text-purple-400 hover:text-purple-300 font-bold transition-colors"
              >
                Admin Dashboard
              </Link>
              <Link
                to="/owner"
                className="text-green-400 hover:text-green-300 font-bold transition-colors flex items-center gap-1"
              >
                <LayoutDashboard size={18} /> Owner Panel
              </Link>
            </>
          )}
          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative p-2 hover:bg-zinc-800 rounded-full transition"
          >
            <ShoppingCart className="text-white" size={24} />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full">
                {cartItems.length}
              </span>
            )}
          </Link>
          <div className="h-6 w-px bg-zinc-800"></div> {/* Separator */}
          {/* Auth Buttons */}
          {token ? (
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-red-400 hover:text-red-300 hover:bg-red-950/30"
            >
              Logout
            </Button>
          ) : (
            <Link to="/login">
              <Button className="bg-white text-black hover:bg-zinc-200">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
