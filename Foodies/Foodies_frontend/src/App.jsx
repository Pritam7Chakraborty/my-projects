import { Routes, Route } from 'react-router-dom'
import Login from "@/pages/Login"
import Home from "@/pages/Home"
import AdminDashboard from "@/pages/AdminDashboard"
import OrderHistory from "@/pages/OrderHistory"

function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      {/* Defines which page loads for which URL */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/orders" element={<OrderHistory />} />
      </Routes>
    </div>
  )
}

export default App