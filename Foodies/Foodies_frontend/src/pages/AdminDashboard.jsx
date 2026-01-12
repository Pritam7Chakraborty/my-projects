import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api, {
  createRestaurant,
  addFoodItem,
  getAllOrders,
  updateOrderStatus,
} from "@/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingBag, Users, TrendingUp } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalUsers: 0, salesData: [] });

  // Forms State
  const [newRestaurant, setNewRestaurant] = useState({
    title: "",
    description: "",
    address: "",
    imageUrl: "",
    open: true,
  });
  const [newFood, setNewFood] = useState({
    restaurantId: "",
    title: "",
    description: "",
    price: "",
    imageUrl: "",
  });

  // --- STABLE DATA FETCHER ---
  // We keep this stable with useCallback so it doesn't cause loops
  const refreshData = useCallback(async () => {
    try {
      const resData = await api.get("/api/restaurants");
      setRestaurants(resData.data);

      const orderData = await getAllOrders();
      if (orderData.data) {
        setOrders(
          orderData.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
      }

      // Fetch Admin Stats
      const statsData = await api.get("/api/admin/stats"); 
      setStats(statsData.data);

    } catch (e) {
      console.error("Failed to load admin data", e);
    }
  }, []);

  // --- ✅ FIXED USE EFFECT ---
  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail || !userEmail.includes("admin")) {
      navigate("/");
      return;
    }
    
    // Fix: Wrap in an internal async function to satisfy the linter
    const loadData = async () => {
      await refreshData();
    };
    
    loadData();
  }, [navigate, refreshData]);

  // --- HANDLERS ---
  const handleCreateRestaurant = async () => {
    try {
      await createRestaurant(newRestaurant);
      alert("Restaurant Created!");
      setNewRestaurant({
        title: "",
        description: "",
        address: "",
        imageUrl: "",
        open: true,
      });
      refreshData();
    } catch (e) {
      console.error(e);
      alert("Error creating restaurant");
    }
  };

  const handleAddFood = async () => {
    if (!newFood.restaurantId) return alert("Select a restaurant first!");
    try {
      await addFoodItem(newFood.restaurantId, {
        title: newFood.title,
        description: newFood.description,
        price: parseFloat(newFood.price),
        imageUrl: newFood.imageUrl,
      });
      alert("Food Item Added!");
      setNewFood({ ...newFood, title: "", description: "", price: "" });
    } catch (e) {
      console.error(e);
      alert("Error adding food");
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      refreshData();
    } catch (e) {
      console.error(e);
      alert("Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white py-24 pb-40 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-purple-500">
          Admin Dashboard
        </h1>
        <p className="text-zinc-400 mb-8">Manage your food empire & view analytics.</p>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-zinc-900 border border-zinc-800">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Manage Orders</TabsTrigger>
            <TabsTrigger value="restaurants">Add Restaurant</TabsTrigger>
            <TabsTrigger value="food">Add Food Menu</TabsTrigger>
          </TabsList>

          {/* TAB 1: ANALYTICS OVERVIEW */}
          <TabsContent value="overview" className="mt-6 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{stats.totalRevenue?.toLocaleString()}</div>
                        <p className="text-xs text-zinc-500 mt-1">+20.1% from last month</p>
                    </CardContent>
                </Card>
                
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Total Orders</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalOrders}</div>
                        <p className="text-xs text-zinc-500 mt-1">+12% new orders</p>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUsers}</div>
                        <p className="text-xs text-zinc-500 mt-1">+5 new users today</p>
                    </CardContent>
                </Card>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-zinc-900 border-zinc-800 col-span-2 lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp size={18} className="text-purple-500"/> Monthly Revenue
                        </CardTitle>
                        <CardDescription>Revenue overview for the current year</CardDescription>
                    </CardHeader>
                    <CardContent className="h-75">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.salesData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                    cursor={{fill: '#27272a'}}
                                />
                                <Bar dataKey="sales" fill="#9333ea" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800 col-span-2 lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest actions across the platform</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <div className="space-y-4">
                            {orders.slice(0, 5).map(order => (
                                <div key={order.id} className="flex items-center justify-between border-b border-zinc-800 pb-2 last:border-0">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none text-white">
                                            Order #{order.id}
                                        </p>
                                        <p className="text-xs text-zinc-400">
                                            {order.items.length} items • {order.status}
                                        </p>
                                    </div>
                                    <div className="font-bold text-white">
                                        +₹{order.totalAmount}
                                    </div>
                                </div>
                            ))}
                         </div>
                    </CardContent>
                </Card>
             </div>
          </TabsContent>

          {/* TAB 2: MANAGE ORDERS */}
          <TabsContent value="orders" className="mt-6 space-y-4">
            {orders.length === 0 && (
              <p className="text-zinc-500">No orders found.</p>
            )}
            {orders.map((order) => (
              <Card key={order.id} className="bg-zinc-900 border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    <CardDescription>
                      To: {order.deliveryAddress}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant="outline"
                      className="text-white border-zinc-700"
                    >
                      {order.status}
                    </Badge>
                    <Select
                      onValueChange={(val) => handleStatusUpdate(order.id, val)}
                    >
                      <SelectTrigger className="w-35 bg-zinc-800 border-zinc-700">
                        <SelectValue placeholder="Update Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="PREPARING">Preparing</SelectItem>
                        <SelectItem value="DELIVERED">Delivered</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-zinc-400">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>
                          {item.quantity}x {item.foodItem.title}
                        </span>
                        <span>${item.foodItem.price}</span>
                      </div>
                    ))}
                    <div className="mt-2 font-bold text-white text-right">
                      Total: ${order.totalAmount}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* TAB 3: CREATE RESTAURANT */}
          <TabsContent value="restaurants" className="mt-6">
            <Card className="bg-zinc-900 border-zinc-800 max-w-2xl">
              <CardHeader>
                <CardTitle>Create New Restaurant</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Restaurant Name</Label>
                  <Input
                    className="bg-zinc-800 border-zinc-700"
                    value={newRestaurant.title}
                    onChange={(e) =>
                      setNewRestaurant({
                        ...newRestaurant,
                        title: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input
                    className="bg-zinc-800 border-zinc-700"
                    value={newRestaurant.address}
                    onChange={(e) =>
                      setNewRestaurant({
                        ...newRestaurant,
                        address: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input
                    className="bg-zinc-800 border-zinc-700"
                    placeholder="https://..."
                    value={newRestaurant.imageUrl}
                    onChange={(e) =>
                      setNewRestaurant({
                        ...newRestaurant,
                        imageUrl: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    className="bg-zinc-800 border-zinc-700"
                    value={newRestaurant.description}
                    onChange={(e) =>
                      setNewRestaurant({
                        ...newRestaurant,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <Button
                  onClick={handleCreateRestaurant}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Create Restaurant
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 4: ADD FOOD */}
          <TabsContent value="food" className="mt-6">
            <Card className="bg-zinc-900 border-zinc-800 max-w-2xl">
              <CardHeader>
                <CardTitle>Add Food Item</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Restaurant</Label>
                  <Select
                    onValueChange={(val) =>
                      setNewFood({ ...newFood, restaurantId: val })
                    }
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700">
                      <SelectValue placeholder="Select a Restaurant" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                      {restaurants.map((r) => (
                        <SelectItem key={r.id} value={r.id.toString()}>
                          {r.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Food Name</Label>
                  <Input
                    className="bg-zinc-800 border-zinc-700"
                    value={newFood.title}
                    onChange={(e) =>
                      setNewFood({ ...newFood, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Price ($)</Label>
                  <Input
                    type="number"
                    className="bg-zinc-800 border-zinc-700"
                    value={newFood.price}
                    onChange={(e) =>
                      setNewFood({ ...newFood, price: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input
                    className="bg-zinc-800 border-zinc-700"
                    placeholder="https://..."
                    value={newFood.imageUrl}
                    onChange={(e) =>
                      setNewFood({ ...newFood, imageUrl: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    className="bg-zinc-800 border-zinc-700"
                    value={newFood.description}
                    onChange={(e) =>
                      setNewFood({ ...newFood, description: e.target.value })
                    }
                  />
                </div>

                <Button
                  onClick={handleAddFood}
                  className="w-full bg-pink-600 hover:bg-pink-700"
                >
                  Add Food Item
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;