import { Routes, Route } from "react-router-dom";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import AdminDashboard from "@/pages/AdminDashboard";
import OrderHistory from "@/pages/OrderHistory";
import RestaurantMenu from "@/pages/RestaurantMenu";
import Navbar from "@/components/Navbar"; 

function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      <Navbar />
      {/* Defines which page loads for which URL */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/restaurant/:id" element={<RestaurantMenu />} />
      </Routes>
    </div>
  );
}

export default App;
