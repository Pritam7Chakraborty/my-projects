import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, UtensilsCrossed } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  // A simple check to see if the user is likely an admin based on the email used previously.
  // In a real app, you'd decode the JWT to check the ROLE specifically.
  const isAdmin = token && localStorage.getItem("userEmail")?.includes("admin");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail"); // Clear email too if you stored it
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
          <Link to="/" className="text-zinc-400 hover:text-white transition-colors">
            Home
          </Link>
          {token && (
             <Link to="/orders" className="text-zinc-400 hover:text-white transition-colors">
               My Orders
             </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="text-purple-400 hover:text-purple-300 font-bold transition-colors">
              Admin Dashboard
            </Link>
          )}

          <div className="h-6 w-px bg-zinc-800"></div> {/* Separator */}

          {/* Auth Buttons */}
          {token ? (
            <Button onClick={handleLogout} variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-950/30">
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